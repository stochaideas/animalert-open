import type { z } from "zod";
import { ComplaintService } from "./complaint.service";
import type { complaintSchema } from "./complaint.schema";

export class ComplaintController {
  private complaintService: ComplaintService;

  constructor() {
    this.complaintService = new ComplaintService();
  }

  async getTemplate(fileName: string) {
    return this.complaintService.getTemplate(fileName);
  }

  async generatePDF(input: z.infer<typeof complaintSchema>) {
    return this.complaintService.generatePdfFromTemplate(input);
  }
}
