import { sql } from "drizzle-orm";
import { pgTable, index, pgEnum } from "drizzle-orm/pg-core";
import { z } from "zod";

import { FEEDBACK_RATINGS } from "~/constants/feedback-ratings";

const ratingsArray = Object.values(FEEDBACK_RATINGS);

export const ratingEnum = pgEnum(
  "rating_type",
  ratingsArray as [string, ...string[]],
);

export const feedback = pgTable(
  "feedback",
  (d) => ({
    id: d
      .uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    rating: ratingEnum("rating").notNull(),
    text: d.text("text").notNull(),
    createdAt: d.timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: d
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("feedback_created_at_idx").on(t.createdAt),
    index("feedback_updated_at_idx").on(t.updatedAt),
  ],
);

export const feedbackSchema = z.object({
  id: z.string().optional(),
  rating: z.nativeEnum(FEEDBACK_RATINGS),
  text: z.string(),
});

// Types for TypeScript
export type Feedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;
