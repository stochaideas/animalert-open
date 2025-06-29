import { type ReportService } from "./report.service";
import { type upsertReportWithUserSchema } from "./report.schema";
import { type z } from "zod";

export class ReportController {
  protected reportService: ReportService;

  constructor(service: ReportService) {
    this.reportService = service;
  }

  async upsertReportWithUser(data: z.infer<typeof upsertReportWithUserSchema>) {
    return await this.reportService.upsertReportWithUser(data);
  }
}
