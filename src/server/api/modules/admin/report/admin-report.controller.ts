import type { z } from "zod";
import type { AdminReportService } from "./admin-report.service";
import type { adminUpdateReportSchema } from "./admin-report.schema";

export class AdminReportController {
  protected adminReportService: AdminReportService;

  constructor(service: AdminReportService) {
    this.adminReportService = service;
  }

  async updateReport(data: z.infer<typeof adminUpdateReportSchema>) {
    return await this.adminReportService.updateReport(data);
  }
}
