import { type upsertReportWithUserSchema } from "../report.schema";
import { EmailService } from "../../email/email.service";
import { ReportService } from "../report.service";
import type { z } from "zod";
import { REPORT_TYPES } from "~/constants/report-types";
import { S3Service } from "../../s3/s3.service";

export class ConflictService extends ReportService {
  constructor() {
    super(new EmailService(), new S3Service(), new SmsService());
  }

  async upsertReportWithUser(data: z.infer<typeof upsertReportWithUserSchema>) {
    const result = await super.upsertReportWithUser({
      ...data,
      report: { ...data.report, reportType: REPORT_TYPES.CONFLICT },
    });

    return result;
  }
}
