import type { Metadata } from "next";
import { connection } from "next/server";
import { DarkPage, Notice, Shell } from "@/components/billing/ui";
import { ButtonLink } from "@/components/ui/button-link";
import { findValidQuote } from "@/lib/billing/checkout";
import { getDb } from "@/lib/db";
import { CALL_PATH } from "@/lib/site";
import { CheckoutView } from "../../checkout-view";

export const metadata: Metadata = { title: "Your quote", robots: { index: false, follow: false } };

export default async function QuoteCheckoutPage({ params, searchParams }: PageProps<"/checkout/quote/[token]">) {
  await connection();
  const { token } = await params;
  const { cancelled } = await searchParams;
  const quote = token.length <= 200 ? await findValidQuote(await getDb(), token) : null;

  if (!quote) {
    return (
      <DarkPage>
        <Shell className="py-16 sm:py-24">
          <Notice tone="warning" title="This quote link isn't valid">
            It may have expired, been replaced, or already been paid. Request a call and we&apos;ll send you an updated quote.
          </Notice>
          <div className="mt-8">
            <ButtonLink href={CALL_PATH} variant="inverse" withArrow>
              Request a call
            </ButtonLink>
          </div>
        </Shell>
      </DarkPage>
    );
  }

  return (
    <CheckoutView
      plan="premium"
      amounts={quote}
      cancelled={cancelled === "1"}
      quote={{ token, email: quote.email, contactName: quote.contactName, businessName: quote.businessName, scope: quote.scope, expiresAt: quote.expiresAt }}
    />
  );
}
