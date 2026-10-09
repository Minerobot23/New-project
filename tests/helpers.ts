/*
 * Test helpers: a fresh in-memory Postgres (PGlite) per test, migrated with the real migrations,
 * and a recording stand-in for the Stripe client. No network, no real Stripe account, no emails sent.
 */
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import Stripe from "stripe";
import type { Db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

process.env.EMAIL_DELIVERY = "log";
process.env.APP_URL = "https://fluxline.test";
// Keep the log-mode email output out of test results.
const originalInfo = console.info;
console.info = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].startsWith("[email:")) return;
  originalInfo(...args);
};

let template: Promise<PGlite> | null = null;
let previous: PGlite | null = null;

/** A fresh database per test: migrated once, then cloned (much faster than migrating each time). */
/** Closes the databases so the test process can exit. */
export async function closeDbs() {
  await previous?.close();
  previous = null;
  if (template) await (await template).close();
  template = null;
}

export async function makeDb(): Promise<Db> {
  template ??= (async () => {
    const client = new PGlite();
    await migrate(drizzle(client, { schema }), { migrationsFolder: "drizzle" });
    return client;
  })();
  await previous?.close();
  const client = (await (await template).clone()) as PGlite;
  previous = client;
  return drizzle(client, { schema }) as unknown as Db;
}

type Call = { method: string; args: unknown[] };

/** A minimal Stripe stand-in. Each method records its call; responses can be overridden per test. */
export function makeStripe(overrides: Record<string, (...args: never[]) => unknown> = {}) {
  const calls: Call[] = [];
  let counter = 0;
  const id = (prefix: string) => `${prefix}_test_${++counter}`;
  const idempotent = new Map<string, unknown>();
  const real = new Stripe("sk_test_unit");

  const record = (method: string, fallback: (...args: never[]) => unknown) =>
    async (...args: unknown[]) => {
      calls.push({ method, args });
      const options = args.find((arg) => typeof arg === "object" && arg !== null && "idempotencyKey" in (arg as object)) as { idempotencyKey?: string } | undefined;
      const cacheKey = options?.idempotencyKey ? `${method}:${options.idempotencyKey}` : null;
      if (cacheKey && idempotent.has(cacheKey)) return idempotent.get(cacheKey);
      const result = await (overrides[method] ?? fallback)(...(args as never[]));
      if (cacheKey) idempotent.set(cacheKey, result);
      return result;
    };

  const stub = {
    checkout: {
      sessions: {
        create: record("checkout.sessions.create", () => {
          const sessionId = id("cs");
          return { id: sessionId, url: `https://checkout.stripe.test/${sessionId}`, livemode: false };
        }),
        retrieve: record("checkout.sessions.retrieve", (sessionId: string) => ({ id: sessionId, status: "open", metadata: {} })),
      },
    },
    invoices: {
      create: record("invoices.create", (params: { metadata: Record<string, string> }) => ({ id: id("in"), status: "draft", metadata: params.metadata })),
      finalizeInvoice: record("invoices.finalizeInvoice", (invoiceId: string) => ({
        id: invoiceId,
        status: "open",
        amount_due: 65_000,
        amount_paid: 0,
        attempt_count: 0,
        hosted_invoice_url: `https://invoice.stripe.test/${invoiceId}`,
        due_date: Math.floor(Date.now() / 1000) + 7 * 86_400,
        currency: "usd",
        metadata: { kind: "final", projectId: lastProjectId },
        parent: null,
      })),
      list: record("invoices.list", () => listOf([])),
    },
    invoiceItems: { create: record("invoiceItems.create", () => ({ id: id("ii") })) },
    invoicePayments: { list: record("invoicePayments.list", () => ({ data: [{ payment: { payment_intent: id("pi") } }] })) },
    refunds: { create: record("refunds.create", () => ({ id: id("re"), status: "succeeded" })) },
    subscriptions: {
      retrieve: record("subscriptions.retrieve", (subscriptionId: string) => subscriptionFixture({ id: subscriptionId })),
      update: record("subscriptions.update", (subscriptionId: string, params: { cancel_at?: number; cancel_at_period_end?: boolean }) =>
        subscriptionFixture({ id: subscriptionId, cancel_at: params.cancel_at ?? (params.cancel_at_period_end ? periodEnd : null) }),
      ),
      list: record("subscriptions.list", () => listOf([])),
    },
    prices: { list: record("prices.list", () => ({ data: [] })) },
    charges: { list: record("charges.list", () => ({ data: [] })) },
    billingPortal: { sessions: { create: record("billingPortal.sessions.create", () => ({ url: "https://billing.stripe.test/session" })) } },
    webhooks: real.webhooks,
  };

  let lastProjectId = "";
  const periodEnd = Math.floor(Date.now() / 1000) + 30 * 86_400;
  return {
    stripe: stub as unknown as Stripe,
    calls,
    count: (method: string) => calls.filter((call) => call.method === method).length,
    setProject: (projectId: string) => {
      lastProjectId = projectId;
    },
  };
}

function listOf<T>(items: T[]) {
  return {
    data: items,
    async *[Symbol.asyncIterator]() {
      for (const item of items) yield item;
    },
  };
}

export function subscriptionFixture(over: Partial<Record<string, unknown>> & { projectId?: string } = {}) {
  const now = Math.floor(Date.now() / 1000);
  const { projectId, ...rest } = over;
  return {
    id: "sub_test_1",
    status: "active",
    start_date: now,
    cancel_at: null,
    canceled_at: null,
    metadata: { kind: "care", projectId: projectId ?? "" },
    items: { data: [{ current_period_end: now + 30 * 86_400, price: { unit_amount: 9_900 } }] },
    ...rest,
  };
}

let eventCounter = 0;
export function event(type: string, object: Record<string, unknown>, id = `evt_test_${++eventCounter}`) {
  return { id, type, livemode: false, data: { object } } as unknown as Stripe.Event;
}

export function depositSession(intentId: string, over: Record<string, unknown> = {}) {
  return {
    id: "cs_test_deposit",
    object: "checkout.session",
    status: "complete",
    payment_status: "paid",
    amount_total: 65_000,
    currency: "usd",
    customer: "cus_test_1",
    payment_intent: "pi_test_deposit",
    livemode: false,
    metadata: { kind: "deposit", intentId, plan: "business" },
    ...over,
  };
}

export const admin = { id: "", email: "owner@fluxline.test", name: "Owner", role: "admin" as const };
