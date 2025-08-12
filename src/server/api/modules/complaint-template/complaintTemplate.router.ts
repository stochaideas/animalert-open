import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { ComplaintTemplateController } from "./complaintTemplate.controller";

const complainteTemplateController = new ComplaintTemplateController();

export const complaintTemplateRouter = createTRPCRouter({
  getTemplate: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await complainteTemplateController.getTemplate(input.id);
    }),
  getTemplateTypes: publicProcedure.query(async () => {
    return await complainteTemplateController.getTemplateTypes();
  }),
});
