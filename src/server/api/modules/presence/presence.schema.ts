import { sql } from "drizzle-orm";
import { pgTable, index, pgEnum } from "drizzle-orm/pg-core";

import { IS_ANIMAL_INJURED_OPTIONS } from "~/app/_raporteaza-prezenta/_constants/is-animal-injured-options";
import { IS_IN_DANGEROUS_ENVIRONMENT_OPTIONS } from "~/app/_raporteaza-prezenta/_constants/is-in-dangerous-environment";
import { LOCATION_FOUND_OPTIONS } from "~/app/_raporteaza-prezenta/_constants/location-found-options";
import { OBSERVED_SIGNS_OPTIONS } from "~/app/_raporteaza-prezenta/_constants/observed-signs-options";
import { WANTS_UPDATES_OPTIONS } from "~/app/_raporteaza-prezenta/_constants/wants-updates-options";

export const locationFoundEnum = pgEnum(
  "location_found",
  Object.keys(LOCATION_FOUND_OPTIONS) as [string, ...string[]],
);

export const isAnimalInjuredEnum = pgEnum(
  "is_animal_injured",
  Object.keys(IS_ANIMAL_INJURED_OPTIONS) as [string, ...string[]],
);

export const observedSignsEnum = pgEnum(
  "observed_signs",
  Object.keys(OBSERVED_SIGNS_OPTIONS) as [string, ...string[]],
);

export const isInDangerousEnvironmentEnum = pgEnum(
  "is_in_dangerous_environment",
  Object.keys(IS_IN_DANGEROUS_ENVIRONMENT_OPTIONS) as [string, ...string[]],
);

export const wantsUpdatesEnum = pgEnum(
  "wants_updates",
  Object.keys(WANTS_UPDATES_OPTIONS) as [string, ...string[]],
);

// Drizzle schema
export const presenceReports = pgTable(
  "presence_reports",
  (d) => ({
    id: d
      .uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    presenceReportNumber: d.serial("presence_report_number").unique(),
    observedAnimalType: d.text("observed_animal_type").notNull(),
    locationFound: locationFoundEnum("location_found").notNull(),
    locationDetails: d.text("location_details"),
    isAnimalInjured: isAnimalInjuredEnum("is_animal_injured").notNull(),
    observedSigns: observedSignsEnum("observed_signs").array().notNull(),
    observedSignsDetails: d.text("observed_signs_details"),
    isInDangerousEnvironment: isInDangerousEnvironmentEnum(
      "is_in_dangerous_environment",
    ).notNull(),
    observationDatetime: d.text("observation_datetime").notNull(),
    hasMedia: d.boolean("has_media").notNull(),
    wantsUpdates: wantsUpdatesEnum("wants_updates").array().notNull(),
    contactDetails: d.text("contact_details"),
    createdAt: d.timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: d
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("presence_presence_reports_presence_report_number_idx").on(
      t.presenceReportNumber,
    ),
    index("presence_created_at_idx").on(t.createdAt),
    index("presence_updated_at_idx").on(t.updatedAt),
  ],
);

// TypeScript types
export type PresenceReport = typeof presenceReports.$inferSelect;
export type InsertPresenceReport = typeof presenceReports.$inferInsert;
