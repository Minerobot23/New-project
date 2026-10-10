import { after } from "next/server";
import type Stripe from "stripe";
import { BillingDisabledError, getStripe } from "@/lib/billing/config";
import { processStripeEvent } from "@/lib/billing/webhook";
import { getDb } from "@/lib/db";
import { deliverDue } from "@/lib/notify/send";

/*
 * Stripe webhook endpoint. The raw body is verified against STRIPE_WEBHOOK_SECRET before anything is read from it;
 * unsigned or tampered requests get a 400 and change nothing. A processing error returns 500 so Stripe retries,
 * and the event-id ledger makes the retry safe. A rejected (quarantined) event still returns 200: it was recorded
 * and the admin alerted, and retrying it would not change the outcome.
 *
 * After responding, any due outbox emails (new, or failed ones past their backoff) are retried. Webhooks are the
 * most frequent server traffic, so this is the outbox's main retry loop alongside the daily cron.
 */

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return new Response("Webhook not configured or signature missing.", { status: 400 });

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (error) {
    if (error instanceof BillingDisabledError) return new Response("Billing is disabled.", { status: 503 });
    throw error;
  }

  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return new Response("Invalid signature.", { status: 400 });
  }

  const db = await getDb();
  drainOutboxAfterResponse(db);

  try {
    const outcome = await processStripeEvent(db, stripe, event);
    return Response.json({ received: true, outcome });
  } catch (error) {
    // Log the event id and type only, never payloads (they contain customer details).
    console.error(`[stripe:webhook] ${event.type} ${event.id} failed: ${error instanceof Error ? error.message : "unknown error"}`);
    return new Response("Processing failed; Stripe will retry.", { status: 500 });
  }
}

function drainOutboxAfterResponse(db: Awaited<ReturnType<typeof getDb>>) {
  const drain = async () => {
    try {
      await deliverDue(db, { limit: 20 });
    } catch (error) {
      console.error(`[email] outbox drain failed: ${error instanceof Error ? error.message : "unknown error"}`);
    }
  };
  try {
    after(drain);
  } catch {
    // Outside a Next.js request (unit tests): nothing to defer to. The cron and admin retry still drain the queue.
  }
}
