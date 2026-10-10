import { sql } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/*
 * Billing and client-portal data. Stripe is the source of truth for money; these tables mirror what
 * verified webhooks report, so pages can render without calling Stripe and admins can see history.
 * Unique constraints on Stripe IDs are what make webhook handling idempotent at the database level.
 */

const bytea = customType<{ data: Buffer; driverData: Buffer | Uint8Array }>({
  dataType: () => "bytea",
  fromDriver: (value) => (Buffer.isBuffer(value) ? value : Buffer.from(value)),
});

const created = () => timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updated = () => timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();

export const roleEnum = pgEnum("role", ["admin", "client"]);
export const planEnum = pgEnum("plan", ["essential", "business", "premium"]);
export const projectStatusEnum = pgEnum("project_status", [
  "deposit_pending",
  "deposit_paid",
  "onboarding",
  "in_development",
  "client_review",
  "final_payment_pending",
  "ready_for_launch",
  "live",
  "maintenance_active",
]);
export const paymentKindEnum = pgEnum("payment_kind", ["deposit", "final", "subscription"]);
export const agreementKindEnum = pgEnum("agreement_kind", ["service", "website_care"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Always stored lowercased and trimmed. */
  email: text("email").notNull().unique(),
  name: text("name"),
  role: roleEnum("role").notNull().default("client"),
  createdAt: created(),
});

/** Session cookies hold a random token; only its SHA-256 hash is stored. */
export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    /** Set by a fresh step-up verification; financial admin actions require it to be in the future. */
    elevatedUntil: timestamp("elevated_until", { withTimezone: true }),
    createdAt: created(),
  },
  (table) => [index("sessions_user_idx").on(table.userId)],
);

/** Single-use sign-in links. Only the hash is stored; consumed links keep used_at. */
export const loginTokens = pgTable("login_tokens", {
  tokenHash: text("token_hash").primaryKey(),
  email: text("email").notNull(),
  next: text("next"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: created(),
});

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "restrict" }),
  contactName: text("contact_name").notNull(),
  businessName: text("business_name").notNull(),
  phone: text("phone"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  createdAt: created(),
});

/** Premium quotes: agreed scope and price before any payment is taken. */
export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  tokenHash: text("token_hash").notNull().unique(),
  email: text("email").notNull(),
  contactName: text("contact_name").notNull(),
  businessName: text("business_name").notNull(),
  scope: text("scope").notNull(),
  devPriceCents: integer("dev_price_cents").notNull(),
  depositCents: integer("deposit_cents").notNull(),
  monthlyCents: integer("monthly_cents").notNull(),
  status: text("status", { enum: ["sent", "paid", "void"] }).notNull().default("sent"),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: created(),
});

/**
 * A customer's intent to pay a deposit, recorded (with their agreement acceptance) before redirecting to Stripe.
 * Its id doubles as the Stripe idempotency key, so a double-submitted form creates one Checkout Session.
 */
export const checkoutIntents = pgTable("checkout_intents", {
  id: uuid("id").primaryKey(),
  plan: planEnum("plan").notNull(),
  quoteId: uuid("quote_id").references(() => quotes.id),
  email: text("email").notNull(),
  contactName: text("contact_name").notNull(),
  businessName: text("business_name").notNull(),
  phone: text("phone"),
  devPriceCents: integer("dev_price_cents").notNull(),
  depositCents: integer("deposit_cents").notNull(),
  monthlyCents: integer("monthly_cents").notNull(),
  stripeSessionId: text("stripe_session_id").unique(),
  stripeSessionUrl: text("stripe_session_url"),
  /** quarantined: Stripe reported a payment that didn't match this intent; nothing was fulfilled. */
  status: text("status", { enum: ["open", "completed", "expired", "quarantined"] }).notNull().default("open"),
  livemode: boolean("livemode").notNull().default(false),
  createdAt: created(),
});

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    plan: planEnum("plan").notNull(),
    status: projectStatusEnum("status").notNull().default("deposit_paid"),
    devPriceCents: integer("dev_price_cents").notNull(),
    depositCents: integer("deposit_cents").notNull(),
    monthlyCents: integer("monthly_cents").notNull(),
    /** One project per paid checkout: the database rejects a second one for the same intent. */
    checkoutIntentId: uuid("checkout_intent_id")
      .unique()
      .references(() => checkoutIntents.id),
    quoteId: uuid("quote_id").references(() => quotes.id),
    livemode: boolean("livemode").notNull().default(false),
    /** Maintained with a conditional update so concurrent uploads can't exceed the quota. */
    uploadCount: integer("upload_count").notNull().default(0),
    createdAt: created(),
    updatedAt: updated(),
  },
  (table) => [index("projects_customer_idx").on(table.customerId), index("projects_status_idx").on(table.status)],
);

/** Recorded acceptance of a specific agreement version (service agreement or Website Care terms). */
export const agreementAcceptances = pgTable(
  "agreement_acceptances",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: agreementKindEnum("kind").notNull(),
    version: text("version").notNull(),
    textHash: text("text_hash").notNull(),
    email: text("email").notNull(),
    checkoutIntentId: uuid("checkout_intent_id").references(() => checkoutIntents.id),
    projectId: uuid("project_id").references(() => projects.id),
    userId: uuid("user_id").references(() => users.id),
    /** SHA-256 of the client IP with a server secret: provable consent without storing raw IPs. */
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("agreements_project_idx").on(table.projectId)],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    kind: paymentKindEnum("kind").notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id").unique(),
    stripeInvoiceId: text("stripe_invoice_id").unique(),
    stripeChargeId: text("stripe_charge_id"),
    amountCents: integer("amount_cents").notNull(),
    refundedCents: integer("refunded_cents").notNull().default(0),
    currency: text("currency").notNull().default("usd"),
    status: text("status", { enum: ["succeeded", "refunded", "partially_refunded"] }).notNull().default("succeeded"),
    createdAt: created(),
  },
  (table) => [index("payments_project_idx").on(table.projectId)],
);

/** Final-balance and Website Care invoices, mirrored from Stripe. */
export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    stripeInvoiceId: text("stripe_invoice_id").notNull().unique(),
    kind: text("kind", { enum: ["final", "subscription"] }).notNull(),
    amountDueCents: integer("amount_due_cents").notNull(),
    amountPaidCents: integer("amount_paid_cents").notNull().default(0),
    status: text("status").notNull(),
    hostedInvoiceUrl: text("hosted_invoice_url"),
    attemptCount: integer("attempt_count").notNull().default(0),
    lastFailureAt: timestamp("last_failure_at", { withTimezone: true }),
    dueAt: timestamp("due_at", { withTimezone: true }),
    createdAt: created(),
    updatedAt: updated(),
  },
  (table) => [index("invoices_project_idx").on(table.projectId)],
);

/** Admin-initiated Website Care activation: the customer must consent and authorize before anything recurs. */
export const careActivations = pgTable("care_activations", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .unique()
    .references(() => projects.id),
  status: text("status", { enum: ["invited", "consented", "active", "void"] }).notNull().default("invited"),
  invitedBy: uuid("invited_by").references(() => users.id),
  agreementId: uuid("agreement_id").references(() => agreementAcceptances.id),
  /** One checkout attempt at a time: its id is the Stripe idempotency key, so retries reuse one session. */
  attemptId: uuid("attempt_id"),
  stripeSessionId: text("stripe_session_id").unique(),
  stripeSessionUrl: text("stripe_session_url"),
  sessionExpiresAt: timestamp("session_expires_at", { withTimezone: true }),
  createdAt: created(),
  updatedAt: updated(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .unique()
    .references(() => projects.id),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  status: text("status").notNull(),
  monthlyCents: integer("monthly_cents").notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  /** Three months after activation: cancellation takes effect no earlier than this. */
  minimumTermEnd: timestamp("minimum_term_end", { withTimezone: true }).notNull(),
  cancelAt: timestamp("cancel_at", { withTimezone: true }),
  canceledAt: timestamp("canceled_at", { withTimezone: true }),
  createdAt: created(),
  updatedAt: updated(),
});

export const onboarding = pgTable("onboarding", {
  projectId: uuid("project_id")
    .primaryKey()
    .references(() => projects.id),
  data: jsonb("data").$type<Record<string, string>>().notNull().default(sql`'{}'::jsonb`),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  updatedAt: updated(),
});

/** Client uploads (logos, photos, documents). Stored in Postgres so access control lives in one place. */
export const uploads = pgTable(
  "uploads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    uploadedBy: uuid("uploaded_by")
      .notNull()
      .references(() => users.id),
    filename: text("filename").notNull(),
    mime: text("mime").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    data: bytea("data").notNull(),
    createdAt: created(),
  },
  (table) => [index("uploads_project_idx").on(table.projectId)],
);

export const supportRequests = pgTable("support_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id),
  projectId: uuid("project_id").references(() => projects.id),
  kind: text("kind", { enum: ["support", "additional_service", "cancellation"] }).notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["open", "closed"] }).notNull().default("open"),
  createdAt: created(),
});

/** Audit trail: status changes and billing actions, with who did them. */
export const projectEvents = pgTable(
  "project_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    actorUserId: uuid("actor_user_id").references(() => users.id),
    kind: text("kind").notNull(),
    detail: text("detail"),
    createdAt: created(),
  },
  (table) => [index("project_events_project_idx").on(table.projectId)],
);

/** Every processed Stripe event id. Inserted in the same transaction as its effects. */
export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  livemode: boolean("livemode").notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Transactional email outbox. Rows are written in the same transaction as the business change that causes them,
 * then delivered (and retried) separately. The dedupe key stops webhook retries from emailing twice.
 * `data` holds template input only; sign-in links are minted at send time, so no usable token is stored here.
 */
export const EMAIL_STATUSES = ["queued", "sending", "sent", "failed", "dead", "suppressed"] as const;
export const emailLog = pgTable(
  "email_log",
  {
    dedupeKey: text("dedupe_key").primaryKey(),
    template: text("template").notNull(),
    recipient: text("recipient").notNull(),
    delivery: text("delivery").notNull(),
    status: text("status", { enum: EMAIL_STATUSES }).notNull(),
    data: jsonb("data").$type<Record<string, unknown>>(),
    attempts: integer("attempts").notNull().default(0),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true }),
    lockedUntil: timestamp("locked_until", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    providerMessageId: text("provider_message_id"),
    error: text("error"),
    createdAt: created(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [index("email_log_due_idx").on(table.status, table.nextAttemptAt)],
);

/** Shared, expiring counters for rate limiting across all server instances. */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
});

/** Stripe events that were authentic but didn't match what we expected. Nothing is fulfilled for these. */
export const billingQuarantine = pgTable("billing_quarantine", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: text("event_id").notNull(),
  eventType: text("event_type").notNull(),
  stripeObjectId: text("stripe_object_id"),
  checkoutIntentId: uuid("checkout_intent_id"),
  reason: text("reason").notNull(),
  detail: jsonb("detail").$type<Record<string, unknown>>(),
  livemode: boolean("livemode").notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: created(),
});

/** Short-lived step-up codes emailed to an admin before financial actions. Only the hash is stored. */
export const stepUpCodes = pgTable("step_up_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  codeHash: text("code_hash").notNull(),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: created(),
});

export const PROJECT_STATUSES = projectStatusEnum.enumValues;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

