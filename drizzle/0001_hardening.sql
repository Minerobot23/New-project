CREATE TABLE "billing_quarantine" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" text NOT NULL,
	"event_type" text NOT NULL,
	"stripe_object_id" text,
	"checkout_intent_id" uuid,
	"reason" text NOT NULL,
	"detail" jsonb,
	"livemode" boolean NOT NULL,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"reset_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "step_up_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"code_hash" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "care_activations" ADD COLUMN "attempt_id" uuid;--> statement-breakpoint
ALTER TABLE "care_activations" ADD COLUMN "stripe_session_url" text;--> statement-breakpoint
ALTER TABLE "care_activations" ADD COLUMN "session_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "email_log" ADD COLUMN "data" jsonb;--> statement-breakpoint
ALTER TABLE "email_log" ADD COLUMN "attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "email_log" ADD COLUMN "next_attempt_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "email_log" ADD COLUMN "locked_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "email_log" ADD COLUMN "sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "email_log" ADD COLUMN "provider_message_id" text;--> statement-breakpoint
ALTER TABLE "email_log" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "upload_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "elevated_until" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "step_up_codes" ADD CONSTRAINT "step_up_codes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_log_due_idx" ON "email_log" USING btree ("status","next_attempt_at");--> statement-breakpoint
UPDATE "projects" SET "upload_count" = (SELECT count(*) FROM "uploads" WHERE "uploads"."project_id" = "projects"."id");--> statement-breakpoint
UPDATE "email_log" SET "sent_at" = "created_at", "updated_at" = "created_at" WHERE "status" = 'sent';--> statement-breakpoint
UPDATE "email_log" SET "status" = 'dead', "updated_at" = now() WHERE "status" = 'failed';--> statement-breakpoint
UPDATE "care_activations" SET "status" = 'invited', "stripe_session_id" = NULL WHERE "status" = 'consented';
