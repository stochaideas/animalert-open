import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ConflictController } from "./conflict.controller";
import { upsertReportWithUserSchema } from "../report.schema";

const conflictController = new ConflictController();

export const conflictRouter = createTRPCRouter({
  create: publicProcedure
    .input(upsertReportWithUserSchema)
    .mutation(({ input }) => {
      return conflictController.upsertReportWithUser(input);
    }),
});
