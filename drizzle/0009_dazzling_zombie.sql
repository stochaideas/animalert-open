CREATE TYPE "public"."report_type" AS ENUM('INCIDENT', 'PRESENCE', 'CONFLICT');--> statement-breakpoint
ALTER TABLE "incidents" RENAME TO "reports";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "receive_other_incident_updates" TO "receive_other_report_updates";--> statement-breakpoint
ALTER TABLE "reports" RENAME COLUMN "incident_report_number" TO "report_number";--> statement-breakpoint
ALTER TABLE "reports" RENAME COLUMN "receive_incident_updates" TO "receive_updates";--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "incidents_incident_report_number_unique";--> statement-breakpoint
ALTER TABLE "reports" DROP CONSTRAINT "incidents_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "incidents_user_idx";--> statement-breakpoint
DROP INDEX "incidents_incident_report_number_idx";--> statement-breakpoint
DROP INDEX "incidents_created_at_idx";--> statement-breakpoint
DROP INDEX "incidents_updated_at_idx";--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "report_type" "report_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reports_user_idx" ON "reports" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "reports_number_idx" ON "reports" USING btree ("report_number");--> statement-breakpoint
CREATE INDEX "reports_type_idx" ON "reports" USING btree ("report_type");--> statement-breakpoint
CREATE INDEX "reports_created_at_idx" ON "reports" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "reports_updated_at_idx" ON "reports" USING btree ("updated_at");--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_report_number_unique" UNIQUE("report_number");