ALTER TABLE "activity" ADD COLUMN "reference_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "activity" ADD COLUMN "changes" jsonb;--> statement-breakpoint
ALTER TABLE "history" DROP COLUMN "reference_id";--> statement-breakpoint
ALTER TABLE "history" DROP COLUMN "changes";