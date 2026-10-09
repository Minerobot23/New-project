import { checkoutStatus } from "@/lib/billing/checkout";
import { getDb } from "@/lib/db";

/** Reports whether Stripe's webhook has confirmed a checkout. It reveals nothing but the status. */
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  const status = await checkoutStatus(await getDb(), sessionId);
  return Response.json({ status }, { headers: { "Cache-Control": "no-store" } });
}
