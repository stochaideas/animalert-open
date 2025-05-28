import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { IncidentController } from "./incident.controller";
import { upsertReportWithUserSchema } from "../report.schema";

const incidentController = new IncidentController();

export const incidentRouter = createTRPCRouter({
  create: publicProcedure
    .input(upsertReportWithUserSchema)
    .mutation(({ input }) => {
      return incidentController.upsertReportWithUser(input);
    }),
});
