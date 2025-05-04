import { sql } from "drizzle-orm";
import { pgTable, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from "../users/user.schema";
import { z } from "zod";

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
        onDelete: "set null",
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
    phone: z.string(),
    email: z.string().optional(),
    receiveOtherIncidentUpdates: z.boolean().default(false),
  }),
  incident: z.object({
    id: z.string().optional(),
    receiveIncidentUpdates: z.boolean().default(false),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    imageUrls: z.array(z.string().optional()),
  }),
});
export const insertIncidentSchema = createInsertSchema(incidents);
export const selectIncidentSchema = createSelectSchema(incidents);

// Types for TypeScript
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = typeof incidents.$inferInsert;
