import Link from "next/link";
import { CALL_PATH, ORDER_PATH } from "@/lib/site";
import { PLAN_ORDER, PLANS, formatCents } from "@/lib/billing/plans";

/**
 * The three packages as a ruled list, each row going straight to its checkout (Premium to its quote request).
 * Prices come from the billing config, so they always match checkout.
 */
export function OrderPromo({ title = "Pick a package and start." }: { title?: string }) {
  return (
    <section aria-labelledby="order-promo-title" data-tone="dark" className="bg-stage text-bone" data-track-location="order-promo">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="label text-bone/60">Packages</p>
          <h2 id="order-promo-title" className="display mt-5 max-w-[14ch] text-balance text-[2.2rem] uppercase sm:text-[2.9rem]">
            {title}
          </h2>
          <p className="mt-5 max-w-[40ch] leading-relaxed text-bone/70">
            Pay a 50% deposit online to begin. The balance is due before launch, and Website Care starts only once the site is live.
          </p>
          <Link href={ORDER_PATH} className="label mt-8 inline-flex items-center gap-3 text-bone hover:text-bone/80">
            Compare everything included <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ul className="border-b border-bone/25 lg:col-span-7 lg:col-start-6">
          {PLAN_ORDER.map((id) => {
            const plan = PLANS[id];
            const href = plan.quoteRequired ? `${CALL_PATH}?plan=${id}` : `/checkout/${id}`;
            return (
              <li key={id} className="border-t border-bone/25">
                <Link href={href} className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 py-6 sm:py-7">
                  <span className="display text-[2rem] uppercase leading-none sm:text-[2.8rem]">{plan.name}</span>
                  <span className="text-right">
                    <span className="display-tight block text-2xl sm:text-3xl">
                      {plan.quoteRequired && <span className="mr-1.5 text-sm font-normal text-bone/60">from</span>}
                      {formatCents(plan.devPriceCents, { whole: true })}
                    </span>
                  </span>
                  <span className="text-[15px] text-bone/65">{plan.tagline}</span>
                  <span className="label inline-flex items-center justify-end gap-2 text-right text-bone/85 sm:whitespace-nowrap group-hover:text-bone">
                    {plan.quoteRequired ? "Request a quote" : `${formatCents(plan.depositCents, { whole: true })} deposit`}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
