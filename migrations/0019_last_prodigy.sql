CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"fcm_token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
