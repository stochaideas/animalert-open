ALTER TABLE "reports" ALTER COLUMN "user_id" DROP NOT NULL;
ALTER TABLE "reports" ADD COLUMN "external_id" text;
ALTER TABLE "reports" ADD COLUMN "external_updated_at" timestamp with time zone;
ALTER TABLE "reports" ADD COLUMN "species" text;
CREATE UNIQUE INDEX IF NOT EXISTS "reports_external_id_idx" ON "reports" ("external_id");
