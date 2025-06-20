CREATE TYPE "public"."rating_type" AS ENUM('VERY_BAD', 'BAD', 'NEUTRAL', 'GOOD', 'VERY_GOOD');--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rating" "rating_type" NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "feedback_created_at_idx" ON "feedback" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "feedback_updated_at_idx" ON "feedback" USING btree ("updated_at");