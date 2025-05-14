ALTER TABLE "incidents" RENAME COLUMN "image_urls" TO "image_keys";--> statement-breakpoint
ALTER TABLE "incidents" ADD COLUMN "conversation" text;