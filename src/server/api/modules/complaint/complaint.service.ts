import { and, eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import type { z } from "zod";
import { petitionPlaceholderMap } from "~/constants/petition-form-constants";
import { db } from "~/server/db";
import { complaintSchema } from "~/shared/sesizari/complaint.schema";
import { fillTemplate } from "~/utils/templates";
import { ComplaintTemplateService } from "../complaint-template/complaintTemplate.service";
import { EmailService } from "../email/email.service";
import {
  complaintReportContent,
  complaintReportPersonalData,
} from "./complaint.schema";
import { env } from "~/env";
import { S3Service } from "./../s3/s3.service";
import { streamToBuffer } from "~/lib/stream-to-buffer";
import type { Readable } from "stream";

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
    this.sender = input.firstName + " " + input.lastName;
    //TODO refactor this once we have the complete list of destination emails
    this.emailTo = input.destionationInstituteEmail;
    const filledTempalte = await this.fillPDFTemplate(input);

    const safePetitionName = this.petitionName.replace(/[^a-zA-Z0-9-_]/g, "_");
    const pdfFileName = `Petitie-${safePetitionName}-${Date.now()}`;
    await this.saveComplaint(input, pdfFileName);
    if (filledTempalte) {
      const buffer = await this.generatePdfFromTemplate(filledTempalte);
      const pdfBuffer = Buffer.from(buffer);

      this.sendEmail(pdfFileName, pdfBuffer, input.attachments);
      const result = await this.s3Service.uploadPdfBuffer(
        pdfBuffer,
        pdfFileName,
      );
      if (result) {
        console.log(`PDF ${pdfFileName} uploaded to S3 successfully`);
      }
    }
  }

  async sendEmail(
    fileName: string,
    buffer: Buffer,
    formAttachments?: string[],
  ) {
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
            filename: key.split("/").pop() || key,
            content: fileBuffer,
            contentType,
          });
        } catch (error) {
          console.error(`Failed to fetch S3 object ${key}:`, error);
        }
      }
    }

    await this.emailService.sendEmail({
      to: this.emailTo,
      cc: env.PETITION_CC,
      subject: `Petitie ${this.petitionName}`,
      text: text,
      attachments,
    });
    console.log("Email sent to " + this.emailTo);
  }

  async saveComplaint(
    input: z.infer<typeof complaintSchema>,
    pdfFileName: string,
  ) {
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
      } else {
        throw Error("Failed to insert personal data");
      }

      return { success: true, message: "Police report created successfully" };
    });
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
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    console.log("Starting pdf generation for: ", this.petitionName);
    try {
      await page.setContent(data, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });
      // for local development and testing purposes
      // const filename = "petitie-" + Date.now().toString();

      // const outputDir = path.resolve(process.cwd(), "generated-pdfs");

      // await fs.mkdir(outputDir, { recursive: true });

      // const filePath = path.join(outputDir, `${filename}.pdf`);
      // await fs.writeFile(filePath, pdfBuffer);
      // console.log("PDF generated at");
      // console.log(filePath);
      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }
}
