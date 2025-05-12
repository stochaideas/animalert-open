ALTER TABLE "users" RENAME COLUMN "firstName" TO "first_name";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "lastName" TO "last_name";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "receiveOtherIncidentUpdates" TO "receive_other_incident_updates";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "incidents" RENAME COLUMN "incidentReportNumber" TO "incident_report_number";--> statement-breakpoint
ALTER TABLE "incidents" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "incidents" RENAME COLUMN "receiveIncidentUpdates" TO "receive_incident_updates";--> statement-breakpoint
ALTER TABLE "incidents" RENAME COLUMN "imageUrls" TO "image_urls";--> statement-breakpoint
ALTER TABLE "incidents" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "incidents" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "presence_reports" RENAME COLUMN "presenceReportNumber" TO "presence_report_number";--> statement-breakpoint
ALTER TABLE "presence_reports" RENAME COLUMN "observedAnimalType" TO "observed_animal_type";--> statement-breakpoint
ALTER TABLE "presence_reports" RENAME COLUMN "locationDetails" TO "location_details";--> statement-breakpoint
ALTER TABLE "presence_reports" RENAME COLUMN "observedSignsDetails" TO "observed_signs_details";--> statement-breakpoint
ALTER TABLE "presence_reports" RENAME COLUMN "observationDatetime" TO "observation_datetime";--> statement-breakpoint
ALTER TABLE "presence_reports" RENAME COLUMN "hasMedia" TO "has_media";--> statement-breakpoint
ALTER TABLE "presence_reports" RENAME COLUMN "contactDetails" TO "contact_details";--> statement-breakpoint
ALTER TABLE "presence_reports" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "presence_reports" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "incidents" DROP CONSTRAINT "incidents_incidentReportNumber_unique";--> statement-breakpoint
ALTER TABLE "presence_reports" DROP CONSTRAINT "presence_reports_presenceReportNumber_unique";--> statement-breakpoint
ALTER TABLE "incidents" DROP CONSTRAINT "incidents_userId_users_id_fk";
--> statement-breakpoint
DROP INDEX "users_created_at_idx";--> statement-breakpoint
DROP INDEX "users_updated_at_idx";--> statement-breakpoint
DROP INDEX "incidents_user_idx";--> statement-breakpoint
DROP INDEX "incidents_incident_report_number_idx";--> statement-breakpoint
DROP INDEX "incidents_created_at_idx";--> statement-breakpoint
DROP INDEX "incidents_updated_at_idx";--> statement-breakpoint
DROP INDEX "presence_presence_reports_presence_report_number_idx";--> statement-breakpoint
DROP INDEX "presence_created_at_idx";--> statement-breakpoint
DROP INDEX "presence_updated_at_idx";--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "incidents_user_idx" ON "incidents" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "incidents_incident_report_number_idx" ON "incidents" USING btree ("incident_report_number");--> statement-breakpoint
CREATE INDEX "incidents_created_at_idx" ON "incidents" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "incidents_updated_at_idx" ON "incidents" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "presence_presence_reports_presence_report_number_idx" ON "presence_reports" USING btree ("presence_report_number");--> statement-breakpoint
CREATE INDEX "presence_created_at_idx" ON "presence_reports" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "presence_updated_at_idx" ON "presence_reports" USING btree ("updated_at");--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_incidentReportNumber_unique" UNIQUE("incident_report_number");--> statement-breakpoint
ALTER TABLE "presence_reports" ADD CONSTRAINT "presence_reports_presenceReportNumber_unique" UNIQUE("presence_report_number");