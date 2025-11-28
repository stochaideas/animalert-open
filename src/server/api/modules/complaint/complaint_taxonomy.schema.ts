import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const complaintCategories = pgTable("complaint_categories", {
  id: serial("id").primaryKey(),
  codeAlpha: varchar("code_alpha", { length: 3 }).notNull().unique(),
  codeNumeric: varchar("code_numeric", { length: 2 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull().unique(),
});

export const institutions = pgTable("institutions", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 5 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull().unique(),
});

export const docTypes = pgTable("doc_types", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 3 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
});

export const complaintCategoryInstitutions = pgTable(
  "complaint_category_institutions",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => complaintCategories.id),
    institutionId: integer("institution_id")
      .notNull()
      .references(() => institutions.id),
  },
  (table) => ({
    uniqueCategoryInstitution: uniqueIndex(
      "complaint_category_institutions_category_inst_uidx",
    ).on(table.categoryId, table.institutionId),
  }),
);

export const complaintNumberingCounters = pgTable(
  "complaint_numbering_counters",
  {
    id: serial("id").primaryKey(),
    scope: varchar("scope", { length: 20 }).notNull(), // "global" | "category"
    categoryId: integer("category_id").references(
      () => complaintCategories.id,
    ),
    nextValue: integer("next_value").notNull().default(1),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    uniqueScopeCategory: uniqueIndex(
      "complaint_numbering_counters_scope_category_uidx",
    ).on(table.scope, table.categoryId),
  }),
);
