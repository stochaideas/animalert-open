CREATE TYPE "public"."is_animal_injured" AS ENUM('YES', 'NO', 'NOT_SURE');--> statement-breakpoint
CREATE TYPE "public"."is_in_dangerous_environment" AS ENUM('YES', 'NO', 'NOT_SURE');--> statement-breakpoint
CREATE TYPE "public"."location_found" AS ENUM('ROADSIDE', 'FOREST_OR_PARK', 'NEAR_HOUSING', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."observed_signs" AS ENUM('BLEEDING', 'FRACTURES', 'MOVEMENT_PROBLEMS', 'DISORIENTED_BEHAVIOR', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."wants_updates" AS ENUM('EMAIL', 'PHONE', 'NONE');--> statement-breakpoint
CREATE TABLE "presence_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"presenceReportNumber" serial NOT NULL,
	"observedAnimalType" text NOT NULL,
	"location_found" "location_found" NOT NULL,
	"locationDetails" text,
	"is_animal_injured" "is_animal_injured" NOT NULL,
	"observed_signs" "observed_signs"[] NOT NULL,
	"observedSignsDetails" text,
	"is_in_dangerous_environment" "is_in_dangerous_environment" NOT NULL,
	"observationDatetime" text NOT NULL,
	"hasMedia" boolean NOT NULL,
	"wants_updates" "wants_updates"[] NOT NULL,
	"contactDetails" text,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone,
	CONSTRAINT "presence_reports_presenceReportNumber_unique" UNIQUE("presenceReportNumber")
);
--> statement-breakpoint
CREATE INDEX "presence_presence_reports_presence_report_number_idx" ON "presence_reports" USING btree ("presenceReportNumber");--> statement-breakpoint
CREATE INDEX "presence_created_at_idx" ON "presence_reports" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "presence_updated_at_idx" ON "presence_reports" USING btree ("updatedAt");