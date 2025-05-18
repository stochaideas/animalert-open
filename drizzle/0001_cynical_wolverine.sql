ALTER TABLE "incidents" ALTER COLUMN "latitude" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "incidents" ALTER COLUMN "longitude" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "receiveOtherIncidentUpdates" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "incidents" ADD COLUMN "receiveIncidentUpdates" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "incidents" ADD COLUMN "imageUrls" text[];--> statement-breakpoint
ALTER TABLE "incidents" DROP COLUMN "confidentiality";