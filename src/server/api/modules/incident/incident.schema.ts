import { sql } from "drizzle-orm";
import { pgTable, index } from "drizzle-orm/pg-core";

import { users } from "../user/user.schema";
import { z } from "zod";
import { phoneNumberRefine } from "~/lib/phone";

export const incidents = pgTable(
  "incidents",
  (d) => ({
    id: d
      .uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: d
      .uuid()
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    receiveIncidentUpdates: d.boolean().default(false),
    latitude: d.doublePrecision(),
    longitude: d.doublePrecision(),
    imageUrls: d.text().array(),
    createdAt: d.timestamp({ withTimezone: true }).defaultNow(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("user_idx").on(t.userId)],
);

export const upsertIncidentWithUserSchema = z.object({
  user: z.object({
    id: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().refine(phoneNumberRefine),
    email: z.string().optional(),
    receiveOtherIncidentUpdates: z.boolean().default(false),
  }),
  incident: z.object({
    id: z.string().optional(),
    receiveIncidentUpdates: z.boolean().default(false),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    imageUrls: z.string().array(),
  }),
});

// Types for TypeScript
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = typeof incidents.$inferInsert;
