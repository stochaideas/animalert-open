import type { z } from "zod";
import type { feedbackSchema } from "./feedback.schema";
import { FeedbackService } from "./feedback.service";

export class FeedbackController {
  private feedbackService: FeedbackService;

  constructor() {
    this.feedbackService = new FeedbackService();
  }

  async insertFeedback(data: z.infer<typeof feedbackSchema>) {
    return await this.feedbackService.insertFeedback(data);
  }
}
