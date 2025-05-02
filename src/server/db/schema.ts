import { sql, relations } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `animalert_${name}`);

// src/server/db/schema.ts
export const users = createTable(
  "users",
  (d) => ({
    id: d
      .uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    firstName: d.varchar({ length: 255 }).notNull(),
    lastName: d.varchar({ length: 255 }).notNull(),
    phone: d.varchar({ length: 20 }).notNull().unique(),
    email: d.varchar({ length: 255 }).unique(),
    createdAt: d.timestamp({ withTimezone: true }).defaultNow(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("phone_idx").on(t.phone), index("email_idx").on(t.email)],
);

export const incidents = createTable(
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

// User has many incidents
export const usersRelations = relations(users, ({ many }) => ({
  incidents: many(incidents),
}));

// Incident belongs to user
export const incidentsRelations = relations(incidents, ({ one }) => ({
  user: one(users, {
    fields: [incidents.userId],
    references: [users.id],
  }),
}));
