import type { ReportMapPoint } from "~/server/api/modules/report/report.schema";

export type ExtendedReportMapPoint = ReportMapPoint & {
  source: "anim-alert" | "external" | "ro-bear";
  conflictTypology?: string | null;
  validationLayer?: string | null;
  accuracy?: string | null;
};

export type { ReportMapPoint };
