import { sql } from "drizzle-orm";
import { pgTable, index } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  (d) => ({
    id: d
      .uuid("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    firstName: d.varchar("first_name", { length: 255 }).notNull(),
    lastName: d.varchar("last_name", { length: 255 }).notNull(),
    phone: d
      .varchar("phone", { length: 16 }) // E.164 max length is 15 digits + '+' = 16 chars
      .notNull()
      .unique(),
    email: d.varchar("email", { length: 255 }).unique(),
    receiveOtherIncidentUpdates: d
      .boolean("receive_other_incident_updates")
      .default(false),
    createdAt: d.timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: d
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => new Date()),
  }),
  (t) => [
    index("users_phone_idx").on(t.phone),
    index("users_email_idx").on(t.email),
    index("users_created_at_idx").on(t.createdAt),
    index("users_updated_at_idx").on(t.updatedAt),
  ],
);
