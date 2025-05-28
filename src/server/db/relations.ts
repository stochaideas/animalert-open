import { relations } from "drizzle-orm";

import { users } from "~/server/api/modules/user/user.schema";
import { reports } from "~/server/api/modules/report/report.schema";

// User has many reports
export const usersRelations = relations(users, ({ many }) => ({
  reports: many(reports),
}));

// Incident belongs to user
export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));
