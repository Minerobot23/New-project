import { checkoutStatus } from "@/lib/billing/checkout";
import { getDb } from "@/lib/db";
import { confirmedPurchase } from "@/lib/billing/purchase";

/** Reports whether Stripe's webhook has confirmed a checkout. It reveals nothing but the status. */
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  const db = await getDb();
  const status = await checkoutStatus(db, sessionId);
  const purchase = status === "confirmed" ? await confirmedPurchase(db, sessionId) : null;
  return Response.json({ status, purchase }, { headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
}
