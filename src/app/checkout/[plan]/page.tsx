import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { DarkPage, Shell } from "@/components/billing/ui";
import { ButtonLink } from "@/components/ui/button-link";
import { PLANS, formatCents, isPlanId } from "@/lib/billing/plans";
import { CALL_PATH } from "@/lib/site";
import { CheckoutView } from "../checkout-view";

export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: false } };

export default async function PlanCheckoutPage({ params, searchParams }: PageProps<"/checkout/[plan]">) {
  await connection();
  const { plan } = await params;
  const { cancelled } = await searchParams;
  if (!isPlanId(plan)) notFound();

  if (PLANS[plan].quoteRequired) {
    return (
      <DarkPage>
        <Shell className="py-16 sm:py-24">
          <p className="text-sm font-medium text-accent-on-night">Premium</p>
          <h1 className="display-tight mt-4 max-w-[20ch] text-balance text-[2.25rem] sm:text-5xl">Premium projects start with a quote.</h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-white/70">
            Premium websites are scoped to what you need, starting at {formatCents(PLANS.premium.devPriceCents, { whole: true })} with a 50% deposit. We&apos;ll
            agree on scope and price in writing first; your quote email includes a secure link to pay the deposit.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={`${CALL_PATH}?plan=premium`} variant="inverse" withArrow>
              Request a Premium quote
            </ButtonLink>
            <ButtonLink href="/pricing" variant="ghost-inverse">
              Back to pricing
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-white/50">
            Already have a quote? Use the link in your quote email, or <Link href="/login" className="underline underline-offset-4">sign in</Link>.
          </p>
        </Shell>
      </DarkPage>
    );
  }

  return <CheckoutView plan={plan} amounts={PLANS[plan]} cancelled={cancelled === "1"} />;
}
