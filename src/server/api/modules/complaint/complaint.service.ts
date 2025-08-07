import { and, eq } from "drizzle-orm";
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
import { TRPCError } from "@trpc/server";

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

      const filledTemplate = await this.fillPDFTemplate(input);
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
      const pdfFileName = `Petitie-${safePetitionName}-${Date.now()}`;

      const pdfBuffer = Buffer.from(
        await this.generatePdfFromTemplate(filledTemplate),
      );

      const emailSent = await this.sendEmail(
        pdfFileName,
        pdfBuffer,
        input.attachments,
      );
      if (!emailSent.success) {
        return emailSent;
      }

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

      const saveResult = await this.saveComplaint(input, pdfFileName);
      return saveResult;
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
  ): Promise<{ success: boolean; error?: string }> {
    const text = `Stimate Doamnă/Domn!
Atașez în acest email o petiție legat de o activiatate de tip ${this.petitionName}.
Vă rog să analizați această petiție și să luați în considerare demersurile necesare pentru soluționarea aspectelor semnalate.
Vă mulțumesc anticipat pentru timpul acordat și pentru implicare.
Cu stimă,
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
          const contentType =
            s3Object.ContentType ?? "application/octet-stream";

          attachments.push({
            filename: key.split("/").pop() ?? key,
            content: fileBuffer,
            contentType,
          });
        } catch (error) {
          console.error(`Failed to fetch S3 object ${key}:`, error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to fetch S3 object ${key}`,
          });
        }
      }
    }

    try {
      await this.emailService.sendEmail({
        to: this.emailTo,
        cc: env.PETITION_CC,
        subject: `Petitie ${this.petitionName}`,
        text,
        attachments,
      });
      console.log("Email sent to " + this.emailTo);
      return { success: true };
    } catch (err) {
      console.error("Failed to send email:", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to send email",
      });
    }
  }

  async saveComplaint(
    input: z.infer<typeof complaintSchema>,
    pdfFileName: string,
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      return await db.transaction(async (tx) => {
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
            message: "Complaint saved successfully.",
          };
        } else {
          throw new Error("Failed to insert personal data");
        }
      });
    } catch (err) {
      console.error("Failed to save complaint:", err);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Error saving complaint to the database",
      });
    }
  }

  private async fillPDFTemplate(input: z.infer<typeof complaintSchema>) {
    const petitionTemplate = await this.complaintTemplateService.getTemplate(
      input.incidentType,
    );
    if (petitionTemplate) {
      this.petitionName = petitionTemplate.displayName;
      const filledTemplate = fillTemplate(
        petitionTemplate.html,
        input,
        petitionPlaceholderMap,
      );
      console.log("Tempalte filled successfully for: ", this.petitionName);
      return filledTemplate;
    }
    return null;
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
