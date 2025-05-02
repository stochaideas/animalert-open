import { sql } from "drizzle-orm";
import { pgTable, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { users } from "../users/user.schema";

export const incidents = pgTable(
  "incidents",
  (d) => ({
    id: d
      .uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    userId: d
      .uuid()
      .notNull() // Explicit NOT NULL constraint
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "restrict",
      }),
    confidentiality: d.boolean().default(false),
    latitude: d.numeric({ precision: 12, scale: 8 }),
    longitude: d.numeric({ precision: 12, scale: 8 }),
    createdAt: d.timestamp({ withTimezone: true }).defaultNow(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("user_idx").on(t.userId)],
);

// Create Zod schemas for type validation
export const insertIncidentSchema = createInsertSchema(incidents);
export const selectIncidentSchema = createSelectSchema(incidents);

// Types for TypeScript
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = typeof incidents.$inferInsert;
