import { sql } from "drizzle-orm";
import { pgTable, index, pgEnum } from "drizzle-orm/pg-core";

import { users } from "../user/user.schema";
import { z } from "zod";
import { phoneNumberRefine } from "~/lib/phone";
import { REPORT_TYPES, VICTIM_STATUS_INTERNAL, VICTIM_STATUS_PUBLIC } from "~/constants/report-types";

const reportTypesArray = Object.values(REPORT_TYPES);

export const reportTypeEnum = pgEnum(
  "report_type",
  reportTypesArray as [string, ...string[]],
);

const victimStatusInternalArray = Object.values(VICTIM_STATUS_INTERNAL);

export const victimStatusInternalEnum = pgEnum(
  "victim_status_internal",
  victimStatusInternalArray as [string, ...string[]],
);

const victimStatusPublicArray = Object.values(VICTIM_STATUS_PUBLIC);

export const victimStatusPublicEnum = pgEnum(
  "victim_status_public",
  victimStatusPublicArray as [string, ...string[]],
);

export const reports = pgTable(
  "reports",
  (d) => ({
    id: d
      .uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    reportNumber: d.serial("report_number").unique(),
    reportType: reportTypeEnum("report_type").notNull().default("INCIDENT"),
    victimStatusInternal: victimStatusInternalEnum("victim_status_internal").notNull().default("UNKNOWN"),
    victimStatusPublic: victimStatusPublicEnum("victim_status_public").notNull().default("NECUNOSCUT"),
    userId: d
      .uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    receiveUpdates: d.boolean("receive_updates").default(false),
    latitude: d.doublePrecision("latitude"),
    longitude: d.doublePrecision("longitude"),
    imageKeys: d.text("image_keys").array(),
    conversation: d.text("conversation"),
    address: d.text("address"),
    createdAt: d.timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: d
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("reports_user_idx").on(t.userId),
    index("reports_number_idx").on(t.reportNumber),
    index("reports_type_idx").on(t.reportType),
    index("reports_created_at_idx").on(t.createdAt),
    index("reports_updated_at_idx").on(t.updatedAt),
  ],
);

export const upsertReportWithUserSchema = z.object({
  user: z.object({
    id: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().refine(phoneNumberRefine),
    email: z.string().optional(),
    receiveOtherReportUpdates: z.boolean().default(false),
  }),
  report: z.object({
    id: z.string().optional(),
    reportType: z.nativeEnum(REPORT_TYPES),
    victimStatusInternal: z.nativeEnum(VICTIM_STATUS_INTERNAL),
    victimStatusPublic: z.nativeEnum(VICTIM_STATUS_PUBLIC),
    receiveUpdates: z.boolean().default(false),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    imageKeys: z.string().array(),
    conversation: z.string().optional(),
    address: z.string().optional(),
  }),
});

// Types for TypeScript
export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;
