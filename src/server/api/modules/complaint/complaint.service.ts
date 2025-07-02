import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import type { z } from "zod";
import { petitionPlaceholderMap } from "~/constants/petition-form-constants";
import { db } from "~/server/db";
import { complaintSchema } from "~/shared/sesizari/complaint.schema";
import { fillTemplate } from "~/utils/templates";
import { ComplaintTemplateService } from "../complaint-template/complaintTemplate.service";
import {
  complaintReportContent,
  complaintReportPersonalData,
} from "./complaint.schema";

export class ComplaintService {
  private complaintTemplateService: ComplaintTemplateService;
  constructor() {
    this.complaintTemplateService = new ComplaintTemplateService();
  }

  async generateAndSendComplaint(input: z.infer<typeof complaintSchema>) {
    const result = await this.saveComplaint(input);
    console.log("Saving result " + result.message);
    const filledTempalte = await this.fillPDFTemplate(input);
    if (filledTempalte) {
      const buffer = this.generatePdfFromTemplate(filledTempalte);
      //TODO: save to s3?
    }
  }

  async saveComplaint(input: z.infer<typeof complaintSchema>) {
    return await db.transaction(async (tx) => {
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

      const personalDataId = personalDataInsertResult[0]?.id;

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
      const filledTemplate = fillTemplate(
        petitionTemplate,
        input,
        petitionPlaceholderMap,
      );
      console.log("Tempalte filled successfully");
      return filledTemplate;
    }
    return null;
  }

  async generatePdfFromTemplate(data: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    console.log("Starting pdf generation");
    try {
      await page.setContent(data, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      const filename = "petitie-" + Date.now().toString();

      const outputDir = path.resolve(process.cwd(), "generated-pdfs");

      await fs.mkdir(outputDir, { recursive: true });

      const filePath = path.join(outputDir, `${filename}.pdf`);
      await fs.writeFile(filePath, pdfBuffer);
      console.log("PDF generated at");
      console.log(filePath);
      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }
}
