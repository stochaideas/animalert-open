import { sql } from "drizzle-orm";
import { pgTable, index } from "drizzle-orm/pg-core";

import { users } from "../user/user.schema";
import { z } from "zod";
import { phoneNumberRefine } from "~/lib/phone";

export const incidents = pgTable(
  "incidents",
  (d) => ({
    id: d
      .uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    incidentReportNumber: d.serial("incident_report_number").unique(),
    userId: d
      .uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    receiveIncidentUpdates: d
      .boolean("receive_incident_updates")
      .default(false),
    latitude: d.doublePrecision("latitude"),
    longitude: d.doublePrecision("longitude"),
    imageKeys: d.text("image_keys").array(),
    conversation: d.text("conversation"),
    createdAt: d.timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: d
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("incidents_user_idx").on(t.userId),
    index("incidents_incident_report_number_idx").on(t.incidentReportNumber),
    index("incidents_created_at_idx").on(t.createdAt),
    index("incidents_updated_at_idx").on(t.updatedAt),
  ],
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
    imageKeys: z.string().array(),
    conversation: z.string().optional(),
  }),
});

// Types for TypeScript
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = typeof incidents.$inferInsert;
