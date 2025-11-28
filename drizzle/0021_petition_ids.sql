CREATE TABLE "complaint_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"code_alpha" varchar(3) NOT NULL,
	"code_numeric" varchar(2) NOT NULL,
	"name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "institutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(5) NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "doc_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(3) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE UNIQUE INDEX "complaint_categories_code_alpha_unique" ON "complaint_categories" USING btree ("code_alpha");
--> statement-breakpoint
CREATE UNIQUE INDEX "complaint_categories_code_numeric_unique" ON "complaint_categories" USING btree ("code_numeric");
--> statement-breakpoint
CREATE UNIQUE INDEX "complaint_categories_name_unique" ON "complaint_categories" USING btree ("name");
--> statement-breakpoint
CREATE UNIQUE INDEX "institutions_code_unique" ON "institutions" USING btree ("code");
--> statement-breakpoint
CREATE UNIQUE INDEX "institutions_name_unique" ON "institutions" USING btree ("name");
--> statement-breakpoint
CREATE UNIQUE INDEX "doc_types_code_unique" ON "doc_types" USING btree ("code");
--> statement-breakpoint
CREATE TABLE "complaint_category_institutions" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"institution_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "complaint_numbering_counters" (
	"id" serial PRIMARY KEY NOT NULL,
	"scope" varchar(20) NOT NULL,
	"category_id" integer,
	"next_value" integer DEFAULT 1 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX "complaint_category_institutions_category_inst_uidx" ON "complaint_category_institutions" USING btree ("category_id","institution_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "complaint_numbering_counters_scope_category_uidx" ON "complaint_numbering_counters" USING btree ("scope","category_id");
--> statement-breakpoint
ALTER TABLE "complaint_templates" ADD COLUMN "category_id" integer;
--> statement-breakpoint
ALTER TABLE "complaint_templates" ADD CONSTRAINT "complaint_templates_category_id_complaint_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."complaint_categories"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD COLUMN "category_id" integer;
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD COLUMN "doc_type_id" integer;
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD COLUMN "primary_institution_id" integer;
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD COLUMN "is_public" boolean DEFAULT true NOT NULL;
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD COLUMN "obj_no" integer;
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD COLUMN "gen_no" integer;
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD COLUMN "total_no" integer;
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD COLUMN "full_public_rep_no" varchar(64);
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD COLUMN "full_internal_rep_no" text;
--> statement-breakpoint
ALTER TABLE "complaint_category_institutions" ADD CONSTRAINT "complaint_category_institutions_category_id_complaint_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."complaint_categories"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "complaint_category_institutions" ADD CONSTRAINT "complaint_category_institutions_institution_id_institutions_id_fk" FOREIGN KEY ("institution_id") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "complaint_numbering_counters" ADD CONSTRAINT "complaint_numbering_counters_category_id_complaint_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."complaint_categories"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD CONSTRAINT "complaint_report_content_category_id_complaint_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."complaint_categories"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD CONSTRAINT "complaint_report_content_doc_type_id_doc_types_id_fk" FOREIGN KEY ("doc_type_id") REFERENCES "public"."doc_types"("id") ON DELETE no action ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "complaint_report_content" ADD CONSTRAINT "complaint_report_content_primary_institution_id_institutions_id_fk" FOREIGN KEY ("primary_institution_id") REFERENCES "public"."institutions"("id") ON DELETE no action ON UPDATE no action;
