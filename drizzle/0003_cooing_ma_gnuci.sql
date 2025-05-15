DROP INDEX "phone_idx";--> statement-breakpoint
DROP INDEX "email_idx";--> statement-breakpoint
DROP INDEX "user_idx";--> statement-breakpoint
ALTER TABLE "incidents" ADD COLUMN "incidentReportNumber" serial NOT NULL;--> statement-breakpoint
CREATE INDEX "users_phone_idx" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updatedAt");--> statement-breakpoint
CREATE INDEX "incidents_user_idx" ON "incidents" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "incidents_incident_report_number_idx" ON "incidents" USING btree ("incidentReportNumber");--> statement-breakpoint
CREATE INDEX "incidents_created_at_idx" ON "incidents" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "incidents_updated_at_idx" ON "incidents" USING btree ("updatedAt");--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_incidentReportNumber_unique" UNIQUE("incidentReportNumber");