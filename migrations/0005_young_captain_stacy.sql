ALTER TABLE "users" ADD COLUMN "is_archive" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "history" ADD COLUMN "is_archive" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "trashbins" ADD COLUMN "is_archive" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "collections" ADD COLUMN "is_archive" boolean DEFAULT false NOT NULL;