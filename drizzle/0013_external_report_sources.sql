ALTER TABLE "reports" ADD COLUMN "is_external" boolean DEFAULT false NOT NULL;
ALTER TABLE "reports" ADD COLUMN "data_provider" text DEFAULT 'AnimAlert' NOT NULL;
