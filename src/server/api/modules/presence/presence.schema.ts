import { sql } from "drizzle-orm";
import { pgTable, index } from "drizzle-orm/pg-core";
import { IS_ANIMAL_INJURED_OPTIONS } from "~/app/raporteaza-prezenta/_constants/is-animal-injured-options";
import { IS_IN_DANGEROUS_ENVIRONMENT_OPTIONS } from "~/app/raporteaza-prezenta/_constants/is-in-dangerous-environment";
import { LOCATION_FOUND_OPTIONS } from "~/app/raporteaza-prezenta/_constants/location-found-options";
import { OBSERVED_SIGNS_OPTIONS } from "~/app/raporteaza-prezenta/_constants/observed-signs-options";
import { WANTS_UPDATES_OPTIONS } from "~/app/raporteaza-prezenta/_constants/wants-updates-options";

// Enums for DB (should match your frontend enums)
export const LOCATION_FOUND_OPTIONS_DB = Object.keys(
  LOCATION_FOUND_OPTIONS,
) as [keyof typeof LOCATION_FOUND_OPTIONS];

export const IS_ANIMAL_INJURED_OPTIONS_DB = Object.keys(
  IS_ANIMAL_INJURED_OPTIONS,
) as [keyof typeof IS_ANIMAL_INJURED_OPTIONS];

export const OBSERVED_SIGNS_OPTIONS_DB = Object.keys(
  OBSERVED_SIGNS_OPTIONS,
) as [keyof typeof OBSERVED_SIGNS_OPTIONS];

export const IS_IN_DANGEROUS_ENVIRONMENT_OPTIONS_DB = Object.keys(
  IS_IN_DANGEROUS_ENVIRONMENT_OPTIONS,
) as [keyof typeof IS_IN_DANGEROUS_ENVIRONMENT_OPTIONS];

export const WANTS_UPDATES_OPTIONS_DB = Object.keys(WANTS_UPDATES_OPTIONS) as [
  keyof typeof WANTS_UPDATES_OPTIONS,
];

// Drizzle schema
export const presenceReports = pgTable(
  "presence_reports",
  (d) => ({
    id: d
      .uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    presenceReportNumber: d.serial().unique(),
    observedAnimalType: d.text().notNull(),
    locationFound: d
      .text()
      .notNull()
      .$type<(typeof LOCATION_FOUND_OPTIONS_DB)[number]>(),
    locationDetails: d.text(),
    isAnimalInjured: d
      .text()
      .notNull()
      .$type<(typeof IS_ANIMAL_INJURED_OPTIONS_DB)[number]>(),
    observedSigns: d.text().array().notNull(), // Array of enum strings
    observedSignsDetails: d.text(),
    isInDangerousEnvironment: d
      .text()
      .notNull()
      .$type<(typeof IS_IN_DANGEROUS_ENVIRONMENT_OPTIONS_DB)[number]>(),
    observationDatetime: d.text().notNull(),
    hasMedia: d.boolean().notNull(),
    wantsUpdates: d.text().array().notNull(),
    contactDetails: d.text(),
    createdAt: d.timestamp({ withTimezone: true }).defaultNow(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("presence_reports_presence_report_number_idx").on(
      t.presenceReportNumber,
    ),
    index("created_at_idx").on(t.createdAt),
    index("updated_at_idx").on(t.updatedAt),
  ],
);

// TypeScript types
export type PresenceReport = typeof presenceReports.$inferSelect;
export type InsertPresenceReport = typeof presenceReports.$inferInsert;
