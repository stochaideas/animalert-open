import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ContactController } from "./contact.controller";
import { contactSchema } from "./contact.schema";

const contactController = new ContactController();

export const contactRouter = createTRPCRouter({
  create: publicProcedure.input(contactSchema).mutation(({ input }) => {
    return contactController.upsertContactWithUser(input);
  }),
});
