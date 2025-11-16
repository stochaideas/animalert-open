import cron, { type ScheduledTask } from "node-cron";

import { env } from "~/env";
import { ReportService } from "~/server/api/modules/report/report.service";
import { EmailService } from "~/server/api/modules/email/email.service";
import { S3Service } from "~/server/api/modules/s3/s3.service";
import { SmsService } from "~/server/api/modules/sms/sms.service";

const emailService = new EmailService();
const s3Service = new S3Service();
const smsService = new SmsService();

const reportService = new ReportService(emailService, s3Service, smsService);

let scheduledTask: ScheduledTask | null = null;
let isSyncing = false;

async function runExternalSync() {
  if (isSyncing) {
    return;
  }

  isSyncing = true;

  try {
    const result = await reportService.syncExternalReports();

    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[external-report-sync] job completed",
        JSON.stringify(result),
      );
    }
  } catch (error) {
    console.error("[external-report-sync] job failed", error);
  } finally {
    isSyncing = false;
  }
}

export function startExternalReportSyncJob() {
  if (scheduledTask || !env.EXTERNAL_REPORTS_API_URL) {
    return;
  }

  void runExternalSync();

  scheduledTask = cron.schedule("0 * * * *", () => {
    void runExternalSync();
  });
}
