import type { Metadata } from "next";
import { connection } from "next/server";
import { DarkPage, Shell } from "@/components/billing/ui";
import { checkoutStatus } from "@/lib/billing/checkout";
import { getDb } from "@/lib/db";
import { PaymentStatus } from "./payment-status";

export const metadata: Metadata = { title: "Payment status", robots: { index: false, follow: false } };

/*
 * Stripe sends the customer here after checkout. Arriving here proves nothing: the page shows "confirmed"
 * only once the signed webhook has recorded the payment, and polls until then.
 */
export default async function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  await connection();
  const { session_id } = await searchParams;
  const sessionId = typeof session_id === "string" ? session_id : "";
  const initial = await checkoutStatus(await getDb(), sessionId);
  return (
    <DarkPage>
      <Shell className="py-16 sm:py-24">
        <PaymentStatus sessionId={sessionId} initial={initial} />
      </Shell>
    </DarkPage>
  );
}
