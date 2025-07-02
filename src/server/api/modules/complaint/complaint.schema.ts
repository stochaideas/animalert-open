import {
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";
import { complaintTemplates } from "../complaint-template/complaint_template.schema";

export const complaintReportPersonalData = pgTable(
  "complaint_report_personal_data",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    email: varchar("email", { length: 255 }),
    country: varchar("country", { length: 50 }).default("Romania"),
    county: varchar("county", { length: 50 }),
    city: varchar("city", { length: 255 }),
    street: varchar("street", { length: 255 }),
    houseNumber: varchar("house_number", { length: 50 }),
    building: varchar("building", { length: 50 }),
    staircase: varchar("staircase", { length: 50 }),
    apartment: varchar("apartment", { length: 50 }),
    phoneNumber: varchar("phone_number", { length: 20 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
);

export const complaintReportContent = pgTable("complaint_report_content", {
  id: serial("id").primaryKey(),
  personalDataId: integer("personal_data_id")
    .notNull()
    .references(() => complaintReportPersonalData.id),

  incidentTypeId: integer("incident_type_id").references(
    () => complaintTemplates.id,
  ),
  incidentDate: date("incident_date"),
  incidentCounty: varchar("incident_county", { length: 50 }),
  incidentCity: varchar("incident_city", { length: 255 }),
  incidentAddress: varchar("incident_address", { length: 255 }),
  destinationInstitute: varchar("destination_institute", { length: 255 }),
  incidentDescription: text("incident_description"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
