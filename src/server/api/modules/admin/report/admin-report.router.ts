import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { adminUpdateReportSchema } from "./admin-report.schema";
import { AdminReportController } from "./admin-report.controller";
import { AdminReportService } from "./admin-report.service";

const adminReportService = new AdminReportService();
const adminReportController = new AdminReportController(adminReportService);

export const adminReportRouter = createTRPCRouter({
  updateReport: adminProcedure
    .input(adminUpdateReportSchema)
    .mutation(({ input }) => {
      return adminReportController.updateReport(input);
    }),
});
