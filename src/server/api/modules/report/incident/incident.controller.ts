import { IncidentService } from "./incident.service";
import { ReportController } from "../report.controller";
import type { z } from "zod";
import type { upsertReportWithUserSchema } from "../report.schema";

export class IncidentController extends ReportController {
  constructor() {
    super(new IncidentService());
  }

  async upsertReportWithUser(data: z.infer<typeof upsertReportWithUserSchema>) {
    return this.reportService.upsertReportWithUser(data);
  }
}
