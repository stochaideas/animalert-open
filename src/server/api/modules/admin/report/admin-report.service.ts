import type { z } from "zod";
import type { adminUpdateReportSchema } from "./admin-report.schema";
import { db } from "~/server/db";
import { reports } from "../../report/report.schema";
import { eq } from "drizzle-orm";

export class AdminReportService {
  async updateReport(data: z.infer<typeof adminUpdateReportSchema>) {
    const result = db.transaction(async (tx) => {
      const [updatedReport] = await tx
        .update(reports)
        .set(data)
        .where(eq(reports.id, data.id))
        .returning();

      return updatedReport;
    });

    return result;
  }
}
