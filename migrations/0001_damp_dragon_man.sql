ALTER TYPE "public"."status" ADD VALUE 'archived';--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "identifier" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."identifier";--> statement-breakpoint
CREATE TYPE "public"."identifier" AS ENUM('email-verification', 'forgot-password', 'request-access');--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "identifier" SET DATA TYPE "public"."identifier" USING "identifier"::"public"."identifier";