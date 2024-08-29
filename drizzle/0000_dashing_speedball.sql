DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('email', 'google', 'github');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chad-next_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chad-next_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"account_type" "type" NOT NULL,
	"github_id" text,
	"google_id" text,
	"password" text,
	"salt" text,
	CONSTRAINT "chad-next_user_email_unique" UNIQUE("email"),
	CONSTRAINT "chad-next_user_github_id_unique" UNIQUE("github_id"),
	CONSTRAINT "chad-next_user_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chad-next_session" ADD CONSTRAINT "chad-next_session_user_id_chad-next_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."chad-next_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
