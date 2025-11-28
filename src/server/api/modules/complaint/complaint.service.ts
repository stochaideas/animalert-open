import { and, eq, isNull, sql } from "drizzle-orm";
import puppeteer from "puppeteer";
import type { Readable } from "stream";
import type { z } from "zod";
import { petitionPlaceholderMap } from "~/constants/petition-form-constants";
import { env } from "~/env";
import { streamToBuffer } from "~/lib/stream-to-buffer";
import { db } from "~/server/db";
import type { complaintSchema } from "~/shared/sesizari/complaint.schema";
import { fillTemplate } from "~/utils/templates";
import { ComplaintTemplateService } from "../complaint-template/complaintTemplate.service";
import { EmailService } from "../email/email.service";
import { S3Service } from "./../s3/s3.service";
import {
  complaintReportContent,
  complaintReportPersonalData,
} from "./complaint.schema";
import {
  complaintCategoryInstitutions,
  complaintNumberingCounters,
  docTypes,
  institutions,
} from "./complaint_taxonomy.schema";
import { TRPCError } from "@trpc/server";

type DBTransaction = Parameters<typeof db.transaction>[0] extends (
  tx: infer T,
) => any
  ? T
  : never;

export class ComplaintService {
  private complaintTemplateService: ComplaintTemplateService;
  private emailService: EmailService;
  private s3Service: S3Service;

  private petitionName: string;
  private sender: string;
  private emailTo: string;
  constructor() {
    this.complaintTemplateService = new ComplaintTemplateService();
    this.emailService = new EmailService();
    this.s3Service = new S3Service();
    this.petitionName = "";
    this.sender = "";
    this.emailTo = "";
  }

  async generateAndSendComplaint(input: z.infer<typeof complaintSchema>) {
    try {
      this.sender = input.firstName + " " + input.lastName;
      this.emailTo = input.destionationInstituteEmail;

      const result = await db.transaction(async (tx) => {
        const template = await this.complaintTemplateService.getTemplate(
          input.incidentType,
          tx,
        );

        if (
          !template ||
          !template.categoryId ||
          !template.categoryCodeAlpha ||
          !template.categoryCodeNumeric
        ) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Incident type is not linked to a valid category.",
          });
        }

        this.petitionName = template.displayName;

        const docType = await this.getDocType(tx, "PET");
        if (!docType) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Document type PET is missing.",
          });
        }
        const institutionsForCategory = await this.getInstitutionsForCategory(
          tx,
          template.categoryId,
        );
        const institutionCodes = institutionsForCategory
          .map((inst) => inst.code)
          .filter(Boolean);
        const primaryInstitutionId = institutionsForCategory[0]?.id ?? null;

        const numbering = await this.reserveNumbers(tx, template.categoryId);

        const publicId = this.buildPublicId(
          template.categoryCodeNumeric,
          numbering.objNo,
          numbering.genNo,
        );
        const internalId = this.buildInternalId({
          docTypeCode: docType.code,
          institutionCode: institutionCodes.join("+") || "NA",
          categoryCodeAlpha: template.categoryCodeAlpha,
          objNo: numbering.objNo,
          genNo: numbering.genNo,
          totalNo: numbering.totalNo,
          title: this.petitionName,
        });

        const filledTemplate = await this.fillPDFTemplate(
          input,
          template.html,
          publicId,
        );
        if (!filledTemplate) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Template could not be loaded or filled.",
          });
        }

        const safePetitionName = this.petitionName.replace(
          /[^a-zA-Z0-9-_]/g,
          "_",
        );
        const pdfFileName = `Petitie-${safePetitionName}-${publicId}-${Date.now()}`;

        const pdfBuffer = Buffer.from(
          await this.generatePdfFromTemplate(filledTemplate),
        );

        const uploaded = await this.s3Service.uploadPdfBuffer(
          pdfBuffer,
          pdfFileName,
        );
        if (!uploaded) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to upload PDF to S3",
          });
        }

        const saveResult = await this.saveComplaint(
          tx,
          input,
          pdfFileName,
          {
            publicId,
            internalId,
            objNo: numbering.objNo,
            genNo: numbering.genNo,
            totalNo: numbering.totalNo,
            docTypeId: docType.id,
            categoryId: template.categoryId,
            primaryInstitutionId,
          },
        );
        return { ...saveResult, publicId, internalId };
      });

      return result;
    } catch (err) {
      console.error("Complaint generation failed:", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error while generating complaint.",
      });
    }
  }

  async sendEmail(
    fileName: string,
    buffer: Buffer,
    formAttachments?: string[],
    publicId?: string,
  ): Promise<{ success: boolean; error?: string }> {
    const idLine = publicId ? `Numar public petitie: ${publicId}\n` : "";
    const text = `${idLine}Stimate Doamna/Domn,
Atasez in acest email o petitie legata de o activitate de tip ${this.petitionName}.
Va rog sa analizati aceasta petitie si sa luati in considerare demersurile necesare pentru solutionarea aspectelor semnalate.
Va multumesc anticipat pentru timpul acordat si pentru implicare.
Cu stima,
${this.sender}`;

    const attachments = [
      {
        filename: fileName,
        content: buffer,
        contentType: "application/pdf",
      },
    ];

    if (formAttachments) {
      for (const key of formAttachments) {
        try {
          const s3Object = await this.s3Service.getObject(key);
          if (!s3Object.Body) continue;

          const fileBuffer = await streamToBuffer(s3Object.Body as Readable);
          const contentType = s3Object.ContentType ?? "application/octet-stream";

          attachments.push({
            filename: key.split("/").pop() ?? key,
            content: fileBuffer,
            contentType,
          });
        } catch (error) {
          console.error('Failed to fetch S3 object ' + key + ':', error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: 'Failed to fetch S3 object ' + key,
          });
        }
      }
    }

    try {
      await this.emailService.sendEmail({
        to: this.emailTo,
        cc: env.PETITION_CC,
        subject: `[${publicId ?? 'petitie'}] Petitie ${this.petitionName}`,
        text,
        attachments,
      });
      console.log('Email sent to ' + this.emailTo);
      return { success: true };
    } catch (err) {
      console.error('Failed to send email:', err);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to send email',
      });
    }
  }

  async saveComplaint(
    tx: DBTransaction,
    input: z.infer<typeof complaintSchema>,
    pdfFileName: string,
    ids: {
      publicId: string;
      internalId: string;
      objNo: number;
      genNo: number;
      totalNo: number;
      docTypeId: number;
      categoryId: number;
      primaryInstitutionId: number | null;
    },
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const existingPersonalData = await tx
        .select()
        .from(complaintReportPersonalData)
        .where(
          and(
            eq(complaintReportPersonalData.email, input.email),
            eq(complaintReportPersonalData.phoneNumber, input.phoneNumber),
          ),
        )
        .limit(1);

      let personalDataId: number | undefined;

      if (existingPersonalData.length > 0) {
        personalDataId = existingPersonalData[0]!.id;
      } else {
        const personalDataInsertResult = await tx
          .insert(complaintReportPersonalData)
          .values({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
            country: input.country,
            county: input.county,
            city: input.city,
            street: input.street,
            houseNumber: input.houseNumber,
            building: input.building ?? null,
            staircase: input.staircase ?? null,
            apartment: input.apartment ?? null,
            phoneNumber: input.phoneNumber,
          })
          .returning({ id: complaintReportPersonalData.id });

        if (personalDataInsertResult.length > 0) {
          personalDataId = personalDataInsertResult[0]!.id;
        }
      }

      const incidentDateValue = input.incidentDate
        ? new Date(input.incidentDate).toISOString()
        : new Date().toISOString();

      if (personalDataId) {
        await tx.insert(complaintReportContent).values({
          personalDataId,
          incidentTypeId: input.incidentType,
          categoryId: ids.categoryId,
          docTypeId: ids.docTypeId,
          primaryInstitutionId: ids.primaryInstitutionId,
          isPublic: true,
          objNo: ids.objNo,
          genNo: ids.genNo,
          totalNo: ids.totalNo,
          fullPublicRepNo: ids.publicId,
          fullInternalRepNo: ids.internalId,
          isValidated: false,
          incidentDate: incidentDateValue,
          incidentCounty: input.incidentCounty,
          incidentCity: input.incidentCity ?? null,
          incidentAddress: input.incidentAddress ?? null,
          destinationInstitute: input.destinationInstitute,
          incidentDescription: input.incidentDescription,
          s3Key: pdfFileName,
          attachmentsS3: input.attachments,
        });

        return {
          success: true,
          message: "Complaint saved for validation.",
        };
      } else {
        throw new Error("Failed to insert personal data");
      }
    } catch (err) {
      console.error("Failed to save complaint:", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error saving complaint to the database",
      });
    }
  }

  private async getDocType(tx: DBTransaction, code: string) {
    const [existing] = await tx
      .select()
      .from(docTypes)
      .where(eq(docTypes.code, code))
      .limit(1);

    if (existing) return existing;

    const [created] = await tx
      .insert(docTypes)
      .values({
        code,
        name: code,
        description: "Document type",
      })
      .onConflictDoUpdate({
        target: docTypes.code,
        set: { name: code, description: "Document type" },
      })
      .returning();

    return created;
  }

  private async getInstitutionsForCategory(tx: DBTransaction, categoryId: number) {
    const rows = await tx
      .select({
        id: institutions.id,
        code: institutions.code,
        name: institutions.name,
      })
      .from(complaintCategoryInstitutions)
      .innerJoin(
        institutions,
        eq(institutions.id, complaintCategoryInstitutions.institutionId),
      )
      .where(eq(complaintCategoryInstitutions.categoryId, categoryId));

    return rows;
  }

  private async reserveNumbers(tx: DBTransaction, categoryId: number) {
    const objNo = await this.incrementCounter(tx, "category", categoryId);
    const totalNo = await this.incrementCounter(tx, "global");
    const genNo = this.generateGenNo();

    return { objNo, genNo, totalNo };
  }

  private async incrementCounter(
    tx: DBTransaction,
    scope: "global" | "category",
    categoryId?: number,
  ) {
    if (scope === "category" && !categoryId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Category id missing for counter increment.",
      });
    }

    const whereClause =
      scope === "category"
        ? and(
            eq(complaintNumberingCounters.scope, scope),
            eq(complaintNumberingCounters.categoryId, categoryId ?? null),
          )
        : and(
            eq(complaintNumberingCounters.scope, scope),
            isNull(complaintNumberingCounters.categoryId),
          );

    const [updated] = await tx
      .update(complaintNumberingCounters)
      .set({
        nextValue: sql`${complaintNumberingCounters.nextValue} + 1`,
        updatedAt: sql`now()`,
      })
      .where(whereClause)
      .returning({ nextValue: complaintNumberingCounters.nextValue });

    if (updated) {
      return updated.nextValue;
    }

    const [inserted] = await tx
      .insert(complaintNumberingCounters)
      .values({
        scope,
        categoryId: scope === "category" ? categoryId ?? null : null,
        nextValue: 1,
      })
      .returning({ nextValue: complaintNumberingCounters.nextValue });

    return inserted?.nextValue ?? 1;
  }

  private generateGenNo() {
    return Math.floor(100 + Math.random() * 900);
  }

  private buildPublicId(prefixNumeric: string, objNo: number, genNo: number) {
    return `${prefixNumeric.padStart(2, "0")}-${this.formatThreeDigits(objNo)}-${this.formatThreeDigits(genNo)}`;
  }

  private buildInternalId(params: {
    docTypeCode: string;
    institutionCode: string;
    categoryCodeAlpha: string;
    objNo: number;
    genNo: number;
    totalNo: number;
    title: string;
  }) {
    const date = this.formatRoDate(new Date());
    const obj = this.formatThreeDigits(params.objNo);
    const gen = this.formatThreeDigits(params.genNo);

    return `${params.docTypeCode}-${params.institutionCode || "NA"} [${params.categoryCodeAlpha}-${obj}-${gen}]/${params.totalNo}/${date} -- "${params.title}"`;
  }

  private formatThreeDigits(value: number) {
    return String(value).padStart(3, "0");
  }

  private formatRoDate(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  private injectPublicId(html: string, publicId: string) {
    const badge = `<div style="text-align:right;font-size:12px;font-weight:700;">ID public: ${publicId}</div>`;
    const lower = html.toLowerCase();
    const bodyIndex = lower.indexOf("<body");
    if (bodyIndex === -1) {
      return `${badge}${html}`;
    }
    const closeIndex = html.indexOf(">", bodyIndex);
    if (closeIndex === -1) {
      return `${badge}${html}`;
    }
    return `${html.slice(0, closeIndex + 1)}${badge}${html.slice(closeIndex + 1)}`;
  }

  private async fillPDFTemplate(
    input: z.infer<typeof complaintSchema>,
    templateHtml: string,
    publicId?: string,
  ) {
    const filledTemplate = fillTemplate(
      templateHtml,
      input,
      petitionPlaceholderMap,
    );
    const htmlWithId = publicId
      ? this.injectPublicId(filledTemplate, publicId)
      : filledTemplate;
    console.log("Template filled successfully for: ", this.petitionName);
    return htmlWithId;
  }

  async generatePdfFromTemplate(data: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    console.log("Starting pdf generation for: ", this.petitionName);
    try {
      await page.setContent(data, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });
      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }
}
