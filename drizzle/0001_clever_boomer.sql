CREATE TABLE "animalert_incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"confidentiality" boolean DEFAULT false,
	"latitude" numeric(12, 8),
	"longitude" numeric(12, 8),
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "animalert_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255),
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone,
	CONSTRAINT "animalert_users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "animalert_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DROP TABLE "animalert_post" CASCADE;--> statement-breakpoint
ALTER TABLE "animalert_incidents" ADD CONSTRAINT "animalert_incidents_userId_animalert_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."animalert_users"("id") ON DELETE cascade ON UPDATE restrict;--> statement-breakpoint
CREATE INDEX "user_idx" ON "animalert_incidents" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "phone_idx" ON "animalert_users" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "email_idx" ON "animalert_users" USING btree ("email");