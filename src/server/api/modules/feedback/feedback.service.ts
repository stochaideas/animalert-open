import { feedback, type InsertFeedback } from "./feedback.schema";
import { db } from "~/server/db";

export class FeedbackService {
  async insertFeedback(data: InsertFeedback) {
    return await db.insert(feedback).values(data);
  }
}
