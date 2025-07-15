import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { EmailService } from "../email/email.service";
import { S3Service } from "../s3/s3.service";
import { SmsService } from "../sms/sms.service";
import { upsertReportWithUserSchema } from "./report.schema";

const emailService = new EmailService();
const s3Service = new S3Service();
const smsService = new SmsService();

const reportService = new ReportService(emailService, s3Service, smsService);
const reportController = new ReportController(reportService);

export const reportRouter = createTRPCRouter({
  getReportFiles: publicProcedure
    .input(z.object({ reportNumber: z.number() }))
    .query(({ input }) => {
      return reportController.getReportFiles(input);
    }),

  // Admin: list all reports with user data
  listReportsWithUser: adminProcedure.query(() => {
    return reportController.listReportsWithUser();
  }),

  // Admin: get a single report (with user) by report ID
  getReportWithUser: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return reportController.getReportWithUser(input.id);
    }),

  // Admin: update report and user data
  updateReportWithUser: adminProcedure
    .input(upsertReportWithUserSchema)
    .mutation(({ input }) => {
      return reportController.updateReportWithUser(input);
    }),
});
