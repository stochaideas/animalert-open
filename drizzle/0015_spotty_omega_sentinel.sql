CREATE TABLE "complaint_report_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"personal_data_id" integer NOT NULL,
	"incident_type_id" integer,
	"incident_date" date,
	"incident_county" varchar(50),
	"incident_city" varchar(255),
	"incident_address" varchar(255),
	"destination_institute" varchar(255),
	"incident_description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "complaint_report_personal_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"email" varchar(255),
	"country" varchar(50) DEFAULT 'Romania',
	"county" varchar(50),
	"city" varchar(255),
	"street" varchar(255),
	"house_number" varchar(50),
	"building" varchar(50),
	"staircase" varchar(50),
	"apartment" varchar(50),
	"phone_number" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD CONSTRAINT "complaint_report_content_personal_data_id_complaint_report_personal_data_id_fk" FOREIGN KEY ("personal_data_id") REFERENCES "public"."complaint_report_personal_data"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD CONSTRAINT "complaint_report_content_incident_type_id_complaint_templates_id_fk" FOREIGN KEY ("incident_type_id") REFERENCES "public"."complaint_templates"("id") ON DELETE no action ON UPDATE no action;