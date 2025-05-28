import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { PresenceController } from "./presence.controller";
import { upsertReportWithUserSchema } from "../report.schema";

const presenceController = new PresenceController();

export const presenceRouter = createTRPCRouter({
  create: publicProcedure
    .input(upsertReportWithUserSchema)
    .mutation(({ input }) => {
      return presenceController.upsertReportWithUser(input);
    }),
});
