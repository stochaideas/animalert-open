import { createTRPCRouter, publicProcedure } from "../../trpc";
import { ComplaintController } from "./complaint.controller";
import { complaintSchema } from "./complaint.schema";

const complaintController = new ComplaintController();
export const complaintRouter = createTRPCRouter({
  generatePDF: publicProcedure.input(complaintSchema).mutation(({ input }) => {
    return complaintController.generatePDF(input);
  }),
});
