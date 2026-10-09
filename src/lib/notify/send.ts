import "server-only";
import { sql } from "drizzle-orm";
import { getEmailProvider } from "@/lib/email";
import type { Db } from "@/lib/db";
import { emailLog } from "@/lib/db/schema";
import type { Rendered, TemplateName } from "./templates";

/*
 * Delivery for transactional email.
 *
 * EMAIL_DELIVERY controls where messages go:
 *   "log"     (default) nothing is sent; development prints the message to the server console,
 *             production records only that it was suppressed (never the body, which may contain a sign-in link).
 *   "sandbox" every message goes to EMAIL_SANDBOX_TO instead of the customer, subject prefixed. Use with Stripe test mode.
 *   "live"    messages go to customers. Set this only once live payments are approved.
 *
 * Every message has a dedupe key (for example "deposit-confirmation:<projectId>"). The key is claimed in email_log
 * before sending, so webhook retries and concurrent deliveries can't send the same notification twice.
 * A failed send releases the claim for a later retry.
 */

export type Delivery = "log" | "sandbox" | "live";

export function deliveryMode(): Delivery {
  const value = process.env.EMAIL_DELIVERY;
  return value === "live" || value === "sandbox" ? value : "log";
}

export type Outgoing = { template: TemplateName; to: string; dedupeKey: string; rendered: Rendered };

export async function sendNotification(db: Db, message: Outgoing): Promise<"sent" | "duplicate" | "failed"> {
  const mode = deliveryMode();
  // Claim the key; a failed earlier attempt can be reclaimed.
  const claimed = await db
    .insert(emailLog)
    .values({ dedupeKey: message.dedupeKey, template: message.template, recipient: message.to, delivery: mode, status: "sent" })
    .onConflictDoUpdate({
      target: emailLog.dedupeKey,
      set: { status: "sent", error: null, delivery: mode },
      setWhere: sql`${emailLog.status} = 'failed'`,
    })
    .returning({ key: emailLog.dedupeKey });
  if (claimed.length === 0) return "duplicate";

  try {
    if (mode === "log") {
      if (process.env.NODE_ENV === "production") {
        console.info(`[email:suppressed] ${message.template} (EMAIL_DELIVERY is not set)`);
      } else {
        console.info(`[email:log] To: ${message.to}\nSubject: ${message.rendered.subject}\n\n${message.rendered.text}\n`);
      }
    } else {
      const sandbox = process.env.EMAIL_SANDBOX_TO;
      if (mode === "sandbox" && !sandbox) throw new Error("EMAIL_DELIVERY=sandbox needs EMAIL_SANDBOX_TO.");
      const to = mode === "sandbox" ? sandbox! : message.to;
      const subject = mode === "sandbox" ? `[sandbox → ${message.to}] ${message.rendered.subject}` : message.rendered.subject;
      await getEmailProvider().send({ to: [to], subject, html: message.rendered.html, text: message.rendered.text });
    }
    return "sent";
  } catch (error) {
    const reason = error instanceof Error ? error.message.slice(0, 300) : "unknown error";
    console.error(`[email] ${message.template} failed: ${reason}`);
    await db
      .update(emailLog)
      .set({ status: "failed", error: reason })
      .where(sql`${emailLog.dedupeKey} = ${message.dedupeKey}`);
    return "failed";
  }
}

/** Sends several notifications; one failure doesn't stop the others. */
export async function sendAll(db: Db, messages: Outgoing[]) {
  for (const message of messages) await sendNotification(db, message);
}

/** Internal notifications go to the same inbox as website leads. */
export function adminRecipient() {
  return (process.env.LEAD_NOTIFICATION_EMAIL ?? "").split(",")[0]?.trim() || "dev-inbox@localhost";
}
