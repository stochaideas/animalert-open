import { sql } from "drizzle-orm";
import { pgTable, index } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  (d) => ({
    id: d
      .uuid()
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    firstName: d.varchar({ length: 255 }).notNull(),
    lastName: d.varchar({ length: 255 }).notNull(),
    phone: d
      .varchar({ length: 16 }) // E.164 max length is 15 digits + '+' = 16 chars
      .notNull()
      .unique(),
    email: d.varchar({ length: 255 }).unique(),
    receiveOtherIncidentUpdates: d.boolean().default(false),
    createdAt: d.timestamp({ withTimezone: true }).defaultNow(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("phone_idx").on(t.phone),
    index("email_idx").on(t.email),
    index("created_at_idx").on(t.createdAt),
    index("updated_at_idx").on(t.updatedAt),
  ],
);
