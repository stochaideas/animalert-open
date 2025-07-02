import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import type { z } from "zod";
import { complaintSchema } from "./complaint.schema";

export class ComplaintService {
  constructor() {}

  async getTemplate(fileName: string) {
    const templatePath = path.join(
      process.cwd(),
      "petition-templates",
      fileName,
    );

    const template = await fs.readFile(templatePath, "utf-8");
    return template;
  }

  async generatePdfFromTemplate(data: z.infer<typeof complaintSchema>) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    console.log("Starting pdf generation");
    try {
      await page.setContent(data.template, { waitUntil: "networkidle0" });

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
    } finally {
      await browser.close();
    }
  }
}
