CREATE TYPE "public"."victim_status_internal" AS ENUM('SAFE', 'INJURED', 'MISSING', 'DECEASED', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."victim_status_public" AS ENUM('SALVAT', 'TRATAT', 'DISPARUT', 'DECEDAT', 'IN_CURS_DE_INVESTIGARE', 'NECUNOSCUT');--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "victim_status_internal" "victim_status_internal" DEFAULT 'UNKNOWN' NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "victim_status_public" "victim_status_public" DEFAULT 'NECUNOSCUT' NOT NULL;