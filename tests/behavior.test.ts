import assert from "node:assert/strict";
import { test } from "node:test";
import { canRecordBehavior } from "../src/lib/behavior";

test("behavior recordings exclude payment capabilities and private routes", () => {
  for (const path of ["/checkout/essential", "/checkout/success?session_id=cs_live_secret", "/checkout/quote/secret", "/auth/callback?token=secret", "/admin", "/client", "/login", "/website-check?email=private@example.com", "/pricing#private"]) {
    assert.equal(canRecordBehavior(new URL(path, "https://fluxlinesolutions.com")), false, path);
  }
  assert.equal(canRecordBehavior(new URL("https://fluxlinesolutions.com/start/contractors?utm_source=google&utm_medium=cpc&utm_campaign=nassau_purchase_test")), true);
  assert.equal(canRecordBehavior(new URL("https://fluxlinesolutions.com/start/restaurants")), true);
  assert.equal(canRecordBehavior(new URL("https://fluxlinesolutions.com/start/restaurants?fbclid=opaque_ad_click_123")), true);
});
