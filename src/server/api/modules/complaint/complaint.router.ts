import { complaintSchema } from "~/shared/sesizari/complaint.schema";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { ComplaintController } from "./complaint.controller";

const complaintController = new ComplaintController();
export const complaintRouter = createTRPCRouter({
  generateAndSendComplaint: publicProcedure
    .input(complaintSchema)
    .mutation(({ input }) => {
      return complaintController.generateAndSendComplaint(input);
    }),
});
