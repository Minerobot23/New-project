import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, beforeEach, describe, test } from "node:test";
import Stripe from "stripe";
import { POST } from "@/app/api/stripe/webhook/route";
import { SERVICE_AGREEMENT } from "@/content/agreements";
import { setStripeForTests } from "@/lib/billing/config";
import { startDepositCheckout } from "@/lib/billing/checkout";
import { setDbForTests, type Db } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { closeDbs, depositSession, makeDb, makeStripe } from "./helpers";

const SECRET = "whsec_unit_test_secret";
const signer = new Stripe("sk_test_unit");
let db: Db;

after(async () => {
  setDbForTests(null);
  setStripeForTests(null);
  await closeDbs();
});
beforeEach(async () => {
  db = await makeDb();
  setDbForTests(db);
  process.env.STRIPE_WEBHOOK_SECRET = SECRET;
});

function request(payload: string, signature: string | null) {
  return new Request("https://fluxline.test/api/stripe/webhook", {
    method: "POST",
    body: payload,
    headers: signature ? { "stripe-signature": signature } : {},
  });
}
const sign = (payload: string, secret = SECRET) => signer.webhooks.generateTestHeaderString({ payload, secret });

describe("POST /api/stripe/webhook", () => {
  test("verifies the signature, processes once, and treats redelivery as a duplicate", async () => {
    const stub = makeStripe();
    setStripeForTests(stub.stripe);
    const intentId = randomUUID();
    await startDepositCheckout(
      db,
      stub.stripe,
      { intentId, plan: "essential", contactName: "Sam Ortiz", businessName: "Ortiz HVAC", email: "sam@example.com", phone: "631-555-0100", acceptAgreement: true, acknowledgeCare: true, agreementVersion: SERVICE_AGREEMENT.version },
      { ip: "203.0.113.9", userAgent: null },
    );
    const [intent] = await db.select().from(t.checkoutIntents);
    const payload = JSON.stringify({ id: "evt_route_1", type: "checkout.session.completed", livemode: false, data: { object: depositSession(intentId, { id: intent.stripeSessionId, amount_total: 35_000 }) } });

    const first = await POST(request(payload, sign(payload)));
    assert.equal(first.status, 200);
    assert.deepEqual(await first.json(), { received: true, outcome: "processed" });
    const second = await POST(request(payload, sign(payload)));
    assert.deepEqual(await second.json(), { received: true, outcome: "duplicate" });
    assert.equal((await db.select().from(t.projects)).length, 1);
  });

  test("a signed event that doesn't match the order is quarantined and acknowledged (200), so Stripe stops retrying", async () => {
    const stub = makeStripe();
    setStripeForTests(stub.stripe);
    const payload = JSON.stringify({ id: "evt_route_unknown", type: "checkout.session.completed", livemode: false, data: { object: depositSession(randomUUID()) } });
    const response = await POST(request(payload, sign(payload)));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { received: true, outcome: "rejected" });
    assert.equal((await db.select().from(t.projects)).length, 0);
    assert.equal((await db.select().from(t.billingQuarantine)).length, 1);
  });

  test("rejects missing, forged, and tampered signatures without changing anything", async () => {
    setStripeForTests(makeStripe().stripe);
    const payload = JSON.stringify({ id: "evt_forged", type: "checkout.session.completed", livemode: false, data: { object: depositSession(randomUUID()) } });
    assert.equal((await POST(request(payload, null))).status, 400);
    assert.equal((await POST(request(payload, sign(payload, "whsec_wrong")))).status, 400);
    assert.equal((await POST(request(payload.replace("35000", "1"), sign(payload.replace("evt_forged", "evt_other"))))).status, 400);
    assert.equal((await db.select().from(t.webhookEvents)).length, 0);
  });

  test("returns 503 when billing isn't configured, so Stripe retries later", async () => {
    setStripeForTests(null);
    const saved = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;
    const payload = "{}";
    assert.equal((await POST(request(payload, sign(payload)))).status, 503);
    if (saved) process.env.STRIPE_SECRET_KEY = saved;
  });
});
