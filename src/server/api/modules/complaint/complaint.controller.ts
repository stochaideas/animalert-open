import type { z } from "zod";
import { ComplaintService } from "./complaint.service";
import type { complaintSchema } from "~/shared/sesizari/complaint.schema";

export class ComplaintController {
  private complaintService: ComplaintService;

  constructor() {
    this.complaintService = new ComplaintService();
  }

  async generateAndSendComplaint(input: z.infer<typeof complaintSchema>) {
    return this.complaintService.generateAndSendComplaint(input);
  }

  async generatePDF(input: string) {
    return this.complaintService.generatePdfFromTemplate(input);
  }
}
