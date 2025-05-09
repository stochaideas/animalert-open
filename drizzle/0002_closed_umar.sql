ALTER TABLE "incidents" DROP CONSTRAINT "incidents_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "incidents" ALTER COLUMN "latitude" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "incidents" ALTER COLUMN "longitude" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;