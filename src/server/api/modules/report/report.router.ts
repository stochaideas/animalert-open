import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { EmailService } from "../email/email.service";
import { S3Service } from "../s3/s3.service";
import { SmsService } from "../sms/sms.service";

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
});
