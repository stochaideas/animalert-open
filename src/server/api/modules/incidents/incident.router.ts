import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { IncidentController } from "./incident.controller";
import {
  insertIncidentSchema,
  upsertIncidentWithUserSchema,
} from "./incident.schema";

const incidentController = new IncidentController();

export const incidentRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return incidentController.getAllIncidents();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return incidentController.getIncidentById(input.id);
    }),

  create: publicProcedure
    .input(upsertIncidentWithUserSchema)
    .mutation(({ input }) => {
      return incidentController.upsertIncidentWithUser(input);
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        data: insertIncidentSchema.partial(),
      }),
    )
    .mutation(({ input }) => {
      return incidentController.updateIncident(input.id, input.data);
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return incidentController.deleteIncident(input.id);
    }),
});
