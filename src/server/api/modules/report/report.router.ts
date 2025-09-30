import {
  createTRPCRouter,
  adminProcedure,
  authProcedure,
  publicProcedure,
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
  getReport: authProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return reportController.getReport(ctx.user, input.id);
    }),

  getReportsByUser: authProcedure.query(({ ctx }) => {
    return reportController.getReportsByUser(ctx.user);
  }),

  getReportFiles: authProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return reportController.getReportFiles(ctx.user, input.id);
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

  getMapData: publicProcedure.query(() => {
    return reportController.getReportsForMap();
  }),
});
