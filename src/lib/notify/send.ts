import "server-only";
import { and, asc, eq, inArray, lte, or, sql } from "drizzle-orm";
import { createLoginToken } from "@/lib/auth/core";
import { createStepUpCode } from "@/lib/auth/step-up-core";
import type { Db } from "@/lib/db";
import { emailLog } from "@/lib/db/schema";
import { getEmailProvider } from "@/lib/email";
import { appUrl } from "@/lib/security";
import { templates, type Rendered, type TemplateName } from "./templates";

/*
 * Transactional email outbox.
 *
 * 1. enqueue: a row (status "queued") is written with the template name and its data, in the same database
 *    transaction as the change that caused it. If that transaction rolls back, no email exists; if it commits,
 *    the email can't be lost even if the process dies right after.
 * 2. deliver: a row is claimed ("sending", with a short lease), rendered, and handed to the provider with an
 *    idempotency key. It becomes "sent" only after the provider accepts it. A failure becomes "failed" with a
 *    backoff time; after MAX_ATTEMPTS it becomes "dead" and shows in the admin dashboard.
 * 3. drain: anything due (queued, failed past its backoff, or stuck "sending" past its lease) is retried after
 *    every webhook, from the admin dashboard, and by the daily cron.
 *
 * Sign-in links are minted at send time, so the outbox never stores a usable token, and a retried email gets a
 * fresh link. EMAIL_DELIVERY decides where messages go:
 *   "log"     (default) nothing is sent ("suppressed"); development prints the message, production records only
 *             that it was suppressed (never the body, which may contain a sign-in link).
 *   "sandbox" every message goes to EMAIL_SANDBOX_TO instead of the customer, subject prefixed.
 *   "live"    messages go to customers.
 */

export type Delivery = "log" | "sandbox" | "live";

export function deliveryMode(): Delivery {
  const value = process.env.EMAIL_DELIVERY?.trim();
  return value === "live" || value === "sandbox" ? value : "log";
}

export const MAX_ATTEMPTS = 6;
const LEASE_MS = 2 * 60_000;
/** Backoff after each failed attempt: 1 min, 5 min, 30 min, 2 h, 12 h. */
const BACKOFF_MS = [60_000, 5 * 60_000, 30 * 60_000, 2 * 3_600_000, 12 * 3_600_000];

type LinkTemplate = "signInLink" | "onboardingInvitation" | "onboardingReminder";
type DataFor<K extends TemplateName> = Parameters<(typeof templates)[K]>[0];
type SignIn = { next: string; ttlMinutes: number };
type StepUp = { userId: string; ttlMinutes: number };

/**
 * A notification to queue. Templates that carry a secret take a description of it instead of the secret itself:
 * sign-in links (`signIn`) and step-up codes (`stepUp`) are generated only at send time.
 */
export type Outgoing = {
  [K in TemplateName]: { template: K; to: string; dedupeKey: string } & (K extends LinkTemplate
    ? { data: Omit<DataFor<K>, "link">; signIn: SignIn }
    : K extends "stepUpCode"
      ? { data: Omit<DataFor<K>, "code">; stepUp: StepUp }
      : { data: DataFor<K> });
}[TemplateName];

type DbOrTx = Pick<Db, "insert" | "update" | "select">;

/** Writes notifications to the outbox. Call inside the transaction that makes them true. Duplicate keys are ignored. */
export async function enqueueNotifications(db: DbOrTx, messages: Outgoing[]) {
  if (messages.length === 0) return;
  const now = new Date();
  await db
    .insert(emailLog)
    .values(
      messages.map((message) => ({
        dedupeKey: message.dedupeKey,
        template: message.template,
        recipient: message.to,
        delivery: deliveryMode(),
        status: "queued" as const,
        data: {
          ...(message.data as Record<string, unknown>),
          ...("signIn" in message ? { __signIn: message.signIn } : {}),
          ...("stepUp" in message ? { __stepUp: message.stepUp } : {}),
        },
        nextAttemptAt: now,
        updatedAt: now,
      })),
    )
    .onConflictDoNothing({ target: emailLog.dedupeKey });
}

type Row = typeof emailLog.$inferSelect;

async function render(db: Db, row: Row): Promise<Rendered> {
  const { __signIn, __stepUp, ...data } = (row.data ?? {}) as Record<string, unknown> & { __signIn?: SignIn; __stepUp?: StepUp };
  if (__signIn) {
    const token = await createLoginToken(db, row.recipient, { next: __signIn.next, ttlMinutes: __signIn.ttlMinutes });
    data.link = `${appUrl()}/auth/verify?token=${token}`;
  }
  if (__stepUp) data.code = await createStepUpCode(db, __stepUp.userId, __stepUp.ttlMinutes);
  const template = templates[row.template as TemplateName] as (input: never) => Rendered;
  return template(data as never);
}

/** Claims one row for sending if it's due. Returns null if it's sent, being sent, or not due yet. */
async function claim(db: Db, dedupeKey: string): Promise<Row | null> {
  const [row] = await db
    .update(emailLog)
    .set({
      status: "sending",
      lockedUntil: new Date(Date.now() + LEASE_MS),
      attempts: sql`${emailLog.attempts} + 1`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(emailLog.dedupeKey, dedupeKey),
        sql`${emailLog.data} is not null`,
        or(
          eq(emailLog.status, "queued"),
          and(eq(emailLog.status, "failed"), lte(emailLog.nextAttemptAt, new Date())),
          and(eq(emailLog.status, "sending"), lte(emailLog.lockedUntil, new Date())),
        ),
      ),
    )
    .returning();
  return row ?? null;
}

export type DeliveryOutcome = "sent" | "suppressed" | "failed" | "dead" | "skipped";

/** Sends one queued notification. Safe to call concurrently and repeatedly. */
export async function deliverNotification(db: Db, dedupeKey: string): Promise<DeliveryOutcome> {
  const row = await claim(db, dedupeKey);
  if (!row) return "skipped";
  const mode = deliveryMode();
  try {
    const rendered = await render(db, row);
    let providerMessageId: string | null = null;
    if (mode === "log") {
      if (process.env.NODE_ENV === "production") console.info(`[email:suppressed] ${row.template} (EMAIL_DELIVERY is not set)`);
      else console.info(`[email:log] To: ${row.recipient}\nSubject: ${rendered.subject}\n\n${rendered.text}\n`);
    } else {
      const sandbox = process.env.EMAIL_SANDBOX_TO?.trim();
      if (mode === "sandbox" && !sandbox) throw new Error("EMAIL_DELIVERY=sandbox needs EMAIL_SANDBOX_TO.");
      const to = mode === "sandbox" ? sandbox! : row.recipient;
      const subject = mode === "sandbox" ? `[sandbox → ${row.recipient}] ${rendered.subject}` : rendered.subject;
      const result = await getEmailProvider().send(
        { to: [to], subject, html: rendered.html, text: rendered.text },
        { idempotencyKey: `fluxline:${row.dedupeKey}` },
      );
      providerMessageId = result?.id ?? null;
    }
    const status = mode === "log" ? "suppressed" : "sent";
    await db
      .update(emailLog)
      .set({ status, delivery: mode, sentAt: new Date(), providerMessageId, lockedUntil: null, error: null, updatedAt: new Date() })
      .where(eq(emailLog.dedupeKey, row.dedupeKey));
    return status;
  } catch (error) {
    const reason = error instanceof Error ? error.message.slice(0, 300) : "unknown error";
    const dead = row.attempts >= MAX_ATTEMPTS;
    const backoff = BACKOFF_MS[Math.min(row.attempts - 1, BACKOFF_MS.length - 1)];
    console.error(`[email] ${row.template} attempt ${row.attempts} failed${dead ? " (giving up)" : ""}: ${reason}`);
    await db
      .update(emailLog)
      .set({
        status: dead ? "dead" : "failed",
        error: reason,
        lockedUntil: null,
        nextAttemptAt: dead ? null : new Date(Date.now() + backoff),
        updatedAt: new Date(),
      })
      .where(eq(emailLog.dedupeKey, row.dedupeKey));
    return dead ? "dead" : "failed";
  }
}

/** Delivers everything that's due: new, retryable, or stuck past its lease. Returns how many were attempted. */
export async function deliverDue(db: Db, { limit = 25 } = {}) {
  const now = new Date();
  const due = await db
    .select({ key: emailLog.dedupeKey })
    .from(emailLog)
    .where(
      and(
        sql`${emailLog.data} is not null`,
        or(
          eq(emailLog.status, "queued"),
          and(eq(emailLog.status, "failed"), lte(emailLog.nextAttemptAt, now)),
          and(eq(emailLog.status, "sending"), lte(emailLog.lockedUntil, now)),
        ),
      ),
    )
    .orderBy(asc(emailLog.createdAt))
    .limit(limit);
  const outcomes: DeliveryOutcome[] = [];
  for (const { key } of due) outcomes.push(await deliverNotification(db, key));
  return outcomes;
}

/** Puts dead notifications back in the queue (admin "retry"). A fresh sign-in link is minted when it sends. */
export async function requeueDead(db: Db, dedupeKeys?: string[]) {
  const where = dedupeKeys?.length
    ? and(eq(emailLog.status, "dead"), inArray(emailLog.dedupeKey, dedupeKeys), sql`${emailLog.data} is not null`)
    : and(eq(emailLog.status, "dead"), sql`${emailLog.data} is not null`);
  const rows = await db
    .update(emailLog)
    .set({ status: "queued", attempts: 0, nextAttemptAt: new Date(), error: null, updatedAt: new Date() })
    .where(where)
    .returning({ key: emailLog.dedupeKey });
  return rows.map((row) => row.key);
}

/** Queues and immediately tries to deliver, for callers outside a transaction. */
export async function sendNotification(db: Db, message: Outgoing): Promise<DeliveryOutcome> {
  await enqueueNotifications(db, [message]);
  return deliverNotification(db, message.dedupeKey);
}

/** Queues several and tries each; one failure doesn't stop the others (failures stay queued for retry). */
export async function sendAll(db: Db, messages: Outgoing[]) {
  await enqueueNotifications(db, messages);
  for (const message of messages) await deliverNotification(db, message.dedupeKey);
}

/** Internal notifications go to the same inbox as website leads. */
export function adminRecipient() {
  return (process.env.LEAD_NOTIFICATION_EMAIL ?? "").split(",")[0]?.trim() || "dev-inbox@localhost";
}
