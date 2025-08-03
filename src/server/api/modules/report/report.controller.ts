import { type ReportService } from "./report.service";
import { type upsertReportWithUserSchema } from "./report.schema";
import { type z } from "zod";

export class ReportController {
  protected reportService: ReportService;

  constructor(service: ReportService) {
    this.reportService = service;
  }

  async getReport(id: string) {
    return await this.reportService.getReport(id);
  }

  async getReportsByUser(email: string) {
    return await this.reportService.getReportsByUser(email);
  }

  async upsertReportWithUser(data: z.infer<typeof upsertReportWithUserSchema>) {
    return await this.reportService.upsertReportWithUser(data);
  }

  async getReportFiles({ id }: { id: string }) {
    return await this.reportService.getReportFiles({ id });
  }

  async listReportsWithUser() {
    return await this.reportService.listReportsWithUser();
  }

  async getReportWithUser(id: string) {
    return await this.reportService.getReportWithUser(id);
  }

  async updateReportWithUser(data: z.infer<typeof upsertReportWithUserSchema>) {
    return await this.reportService.updateReportWithUser(data);
  }
}
