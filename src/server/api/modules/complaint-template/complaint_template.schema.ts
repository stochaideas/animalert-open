import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const complaintTemplates = pgTable("complaint_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull().unique(),
  html: text("html").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
