import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { complaintCategories } from "../complaint/complaint_taxonomy.schema";

export const complaintTemplates = pgTable("complaint_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull().unique(),
  html: text("html").notNull(),
  categoryId: integer("category_id").references(() => complaintCategories.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
