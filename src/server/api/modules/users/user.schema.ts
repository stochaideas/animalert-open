import { sql } from "drizzle-orm";
import { pgTable, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable(
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

// Create Zod schemas for type validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

// Types for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
