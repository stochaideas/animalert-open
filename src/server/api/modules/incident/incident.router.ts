import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { IncidentController } from "./incident.controller";
import { upsertIncidentWithUserSchema } from "./incident.schema";

const incidentController = new IncidentController();

export const incidentRouter = createTRPCRouter({
  create: publicProcedure
    .input(upsertIncidentWithUserSchema)
    .mutation(({ input }) => {
      return incidentController.upsertIncidentWithUser(input);
    }),
});
