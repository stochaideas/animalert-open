ALTER TABLE "incidents" DROP CONSTRAINT "incidents_incidentReportNumber_unique";--> statement-breakpoint
ALTER TABLE "presence_reports" DROP CONSTRAINT "presence_reports_presenceReportNumber_unique";--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_incident_report_number_unique" UNIQUE("incident_report_number");--> statement-breakpoint
ALTER TABLE "presence_reports" ADD CONSTRAINT "presence_reports_presence_report_number_unique" UNIQUE("presence_report_number");