CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" varchar(255) NOT NULL,
	"lastName" varchar(255) NOT NULL,
	"phone" varchar(16) NOT NULL,
	"email" varchar(255),
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone,
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"confidentiality" boolean DEFAULT false,
	"latitude" double precision,
	"longitude" double precision,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "phone_idx" ON "users" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_idx" ON "incidents" USING btree ("userId");