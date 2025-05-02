import { sql } from "drizzle-orm";
import { pgTable, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users, selectUserSchema } from "../users/user.schema";
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
    confidentiality: d.boolean().default(false),
    latitude: d.doublePrecision(),
    longitude: d.doublePrecision(),
    createdAt: d.timestamp({ withTimezone: true }).defaultNow(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("user_idx").on(t.userId)],
);

export const insertIncidentWithUserSchema = z.object({
  user: selectUserSchema.pick({
    id: true,
    firstName: true,
    lastName: true,
    phone: true,
    email: true,
  }),
  incident: z.object({
    confidentiality: z.boolean(),
    latitude: z.number(),
    longitude: z.number(),
  }),
});
export const insertIncidentSchema = createInsertSchema(incidents);
export const selectIncidentSchema = createSelectSchema(incidents);

// Types for TypeScript
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = typeof incidents.$inferInsert;
