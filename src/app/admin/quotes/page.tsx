import { ActionForm } from "@/components/billing/action-form";
import { EmptyState, Panel, Pill, Shell, darkInput, formatDay } from "@/components/billing/ui";
import { adminQuotes } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/auth/session";
import { PLANS, formatCents } from "@/lib/billing/plans";
import { QUOTE_VALID_DAYS } from "@/lib/billing/service";
import { getDb } from "@/lib/db";
import { createQuoteAction, voidQuoteAction } from "../actions";
import { StepUpPanel } from "../step-up-panel";

function Input({ name, label, type = "text", min, step, defaultValue }: { name: string; label: string; type?: string; min?: number; step?: string; defaultValue?: string }) {
  return (
    <div>
      <label htmlFor={`quote-${name}`} className="text-sm font-medium">
        {label}
      </label>
      <input id={`quote-${name}`} name={name} type={type} min={min} step={step} defaultValue={defaultValue} required className={darkInput(false, "h-11")} />
    </div>
  );
}

export default async function AdminQuotesPage() {
  await requireAdmin();
  const quotes = await adminQuotes(await getDb());
  const now = new Date();

  return (
    <Shell className="py-10 sm:py-12">
      <h1 className="display-tight text-[2rem] sm:text-[2.5rem]">Premium quotes</h1>
      <p className="mt-2 max-w-[64ch] text-sm text-white/60">
        A quote emails the customer a private link to review the agreed scope and pay the 50% deposit. It&apos;s valid for {QUOTE_VALID_DAYS} days and works once.
      </p>

      <div className="mt-6">
        <StepUpPanel />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <Panel title="New quote" className="lg:col-span-5">
          <ActionForm action={createQuoteAction} submitLabel="Send quote" pendingLabel="Sending…" confirm="Email this quote to the customer?">
            <Input name="contactName" label="Contact name" />
            <Input name="businessName" label="Business name" />
            <Input name="email" label="Email" type="email" />
            <div>
              <label htmlFor="quote-scope" className="text-sm font-medium">
                Scope
              </label>
              <textarea id="quote-scope" name="scope" required rows={6} maxLength={4000} className={darkInput(false, "py-2.5")} />
              <p className="mt-1.5 text-xs text-white/50">Shown to the customer exactly as written: pages, features, integrations, and anything excluded.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input name="devPrice" label="Development fee (USD)" type="number" min={PLANS.premium.devPriceCents / 100} step="1" defaultValue={String(PLANS.premium.devPriceCents / 100)} />
              <Input name="monthly" label="Website Care (USD/mo)" type="number" min={PLANS.premium.monthlyCents / 100} step="1" defaultValue={String(PLANS.premium.monthlyCents / 100)} />
            </div>
            <p className="text-xs text-white/50">The deposit is calculated as 50% of the development fee.</p>
          </ActionForm>
        </Panel>

        <Panel title="Sent quotes" className="lg:col-span-7">
          {quotes.length === 0 ? (
            <EmptyState>No quotes yet.</EmptyState>
          ) : (
            <ul className="divide-y divide-night-line text-sm">
              {quotes.map((quote) => {
                const expired = quote.status === "sent" && quote.expiresAt < now;
                return (
                  <li key={quote.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                    <div>
                      <p className="font-medium">{quote.businessName}</p>
                      <p className="text-white/60">
                        {quote.contactName} · {quote.email}
                      </p>
                      <p className="mt-1 text-white/60">
                        {formatCents(quote.devPriceCents)} + {formatCents(quote.monthlyCents)}/mo · sent {formatDay(quote.createdAt)} · expires {formatDay(quote.expiresAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Pill value={expired ? "void" : quote.status === "paid" ? "paid" : quote.status === "void" ? "void" : "open"} label={expired ? "expired" : quote.status} />
                      {quote.status === "sent" && !expired && (
                        <ActionForm action={voidQuoteAction} hidden={{ quoteId: quote.id }} submitLabel="Void" variant="small" confirm="Void this quote? Its link stops working." />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </Shell>
  );
}
