import { type ReportService } from "./report.service";
import { type upsertReportWithUserSchema } from "./report.schema";
import { type z } from "zod";
import type { User } from "@clerk/nextjs/server";

export class ReportController {
  protected reportService: ReportService;

  constructor(service: ReportService) {
    this.reportService = service;
  }

  async getReport(user: User | null, id: string) {
    return await this.reportService.getReport(user, id);
  }

  async getReportsByUser(user: User | null) {
    return await this.reportService.getReportsByUser(user);
  }

  async upsertReportWithUser(data: z.infer<typeof upsertReportWithUserSchema>) {
    return await this.reportService.upsertReportWithUser(data);
  }

  async getReportFiles(user: User | null, id: string) {
    return await this.reportService.getReportFiles(user, id);
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

  async getReportsForMap() {
    return await this.reportService.getReportsForMap();
  }
}
