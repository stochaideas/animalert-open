import { feedbackSchema } from "./feedback.schema";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { FeedbackController } from "./feedback.controller";

const feedbackController = new FeedbackController();

export const feedbackRouter = createTRPCRouter({
  create: publicProcedure.input(feedbackSchema).mutation(({ input }) => {
    return feedbackController.insertFeedback(input);
  }),
});
