import { relations } from "drizzle-orm";

import { users } from "~/server/api/modules/user/user.schema";
import { incidents } from "~/server/api/modules/incident/incident.schema";

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
