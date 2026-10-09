import Link from "next/link";
import { Check } from "lucide-react";
import { SubmitButton } from "@/components/billing/submit-button";
import { EmptyState, Notice, Panel, Pill, Shell, StatusBadge, darkButton, formatDay } from "@/components/billing/ui";
import { onboardingProgress } from "@/content/onboarding";
import { requireClient } from "@/lib/auth/session";
import { PLANS, formatCents } from "@/lib/billing/plans";
import { careCancellationDate } from "@/lib/billing/service";
import { getDb } from "@/lib/db";
import { PROJECT_STATUSES } from "@/lib/db/schema";
import { statusLabel } from "@/lib/notify/templates";
import { clientDashboardData } from "@/lib/portal/client-data";
import { site } from "@/lib/site";
import { openBillingPortal } from "../actions";
import { CancelCareForm, SupportForm } from "./forms";

const TIMELINE: string[] = PROJECT_STATUSES.filter((status) => status !== "deposit_pending");
const PAYMENT_LABELS = { deposit: "Deposit", final: "Final balance", subscription: "Website Care" } as const;

export default async function ClientDashboardPage({ searchParams }: PageProps<"/client/dashboard">) {
  const user = await requireClient("/client/dashboard");
  const { care, billing } = await searchParams;
  const data = await clientDashboardData(await getDb(), user.id);
  const firstName = data.customer?.contactName.split(" ")[0];

  return (
    <Shell className="py-10 sm:py-14">
      <h1 className="display-tight text-[2rem] sm:text-[2.75rem]">{firstName ? `Welcome back, ${firstName}.` : "Your dashboard"}</h1>
      {data.customer && <p className="mt-2 text-white/60">{data.customer.businessName}</p>}

      <div className="mt-6 space-y-3">
        {care === "started" && (
          <Notice tone="success" title="Thank you">
            Stripe is confirming your Website Care authorization. Its status updates here within a minute, and we&apos;ll email you once it&apos;s active.
          </Notice>
        )}
        {billing === "unavailable" && <Notice tone="warning">The billing portal isn&apos;t available right now. Please try again shortly or email us.</Notice>}
      </div>

      {data.projects.length === 0 ? (
        <div className="mt-10">
          <Panel>
            <EmptyState>
              No projects yet. If you just paid a deposit, it appears here as soon as Stripe confirms it.{" "}
              <Link href="/pricing" className="underline underline-offset-4">
                See packages
              </Link>
            </EmptyState>
          </Panel>
        </div>
      ) : (
        <div className="mt-10 space-y-10">
          {data.projects.map(({ project, payments, invoices, subscription, care: activation, onboarding }) => {
            const plan = PLANS[project.plan];
            const progress = onboardingProgress(onboarding?.data ?? {});
            const step = TIMELINE.indexOf(project.status);
            const openInvoices = invoices.filter((invoice) => invoice.status === "open");
            const careLive = subscription && !["canceled", "incomplete_expired"].includes(subscription.status);
            return (
              <article key={project.id} aria-labelledby={`project-${project.id}`} className="space-y-6">
                <header className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 id={`project-${project.id}`} className="text-xl font-semibold">
                      {plan.name} website
                    </h2>
                    <p className="mt-1 text-sm text-white/55">Started {formatDay(project.createdAt)}</p>
                  </div>
                  <StatusBadge status={project.status} />
                </header>

                {openInvoices.map((invoice) => (
                  <Notice key={invoice.id} tone={invoice.lastFailureAt ? "error" : "warning"} title={invoice.lastFailureAt ? "Payment failed" : "Invoice ready"}>
                    {invoice.kind === "final" ? "Your final balance" : "A Website Care payment"} of {formatCents(invoice.amountDueCents)} is due
                    {invoice.dueAt ? ` by ${formatDay(invoice.dueAt)}` : ""}.{" "}
                    {invoice.hostedInvoiceUrl && (
                      <a href={invoice.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
                        Pay invoice
                      </a>
                    )}
                  </Notice>
                ))}
                {activation && ["invited", "consented"].includes(activation.status) && !careLive && (
                  <Notice tone="info" title="Activate Website Care">
                    Your site is ready for launch. Review the Website Care terms and authorize the monthly plan to continue.{" "}
                    <Link href={`/client/care?project=${project.id}`} className="font-semibold underline underline-offset-4">
                      Review and activate
                    </Link>
                  </Notice>
                )}

                <Panel title="Progress">
                  <ol className="grid gap-px bg-night-line sm:grid-cols-4 lg:grid-cols-8">
                    {TIMELINE.map((status, index) => {
                      const done = index < step;
                      const current = index === step;
                      return (
                        <li
                          key={status}
                          aria-current={current ? "step" : undefined}
                          className={`flex items-center gap-2 px-3 py-3 text-[13px] ${current ? "bg-accent text-white" : done ? "bg-night-soft text-white/80" : "bg-night text-white/40"}`}
                        >
                          {done && <Check aria-hidden="true" className="size-3.5 shrink-0 text-emerald-300" />}
                          {statusLabel(status)}
                        </li>
                      );
                    })}
                  </ol>
                </Panel>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Panel title="Onboarding">
                    {onboarding?.submittedAt ? (
                      <p className="text-[15px] text-white/80">Submitted {formatDay(onboarding.submittedAt)}. You can still update your answers and files.</p>
                    ) : (
                      <p className="text-[15px] text-white/80">
                        {progress.done} of {progress.total} required answers complete. Your progress is saved as you go.
                      </p>
                    )}
                    <Link href={`/client/onboarding?project=${project.id}`} className={`${darkButton.primary} mt-4`}>
                      {onboarding?.submittedAt ? "Review onboarding" : progress.done > 0 ? "Continue onboarding" : "Start onboarding"}
                    </Link>
                  </Panel>

                  <Panel title="Package">
                    <dl className="space-y-2 text-[15px]">
                      {[
                        ["Development fee", formatCents(project.devPriceCents)],
                        ["Deposit", formatCents(project.depositCents)],
                        ["Balance before launch", formatCents(project.devPriceCents - project.depositCents)],
                        ["Website Care", `${formatCents(project.monthlyCents)}/month after launch`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between gap-4">
                          <dt className="text-white/60">{label}</dt>
                          <dd className="tabular-nums">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </Panel>
                </div>

                <Panel title="Payments and invoices">
                  {payments.length === 0 && invoices.length === 0 ? (
                    <EmptyState>No payments yet.</EmptyState>
                  ) : (
                    <div className="relative -mx-5 overflow-x-auto">
                      <table className="w-full min-w-[32rem] text-left text-sm">
                        <thead className="text-white/50">
                          <tr>
                            <th scope="col" className="px-5 py-2 font-medium">Date</th>
                            <th scope="col" className="px-5 py-2 font-medium">Item</th>
                            <th scope="col" className="px-5 py-2 text-right font-medium">Amount</th>
                            <th scope="col" className="px-5 py-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment) => (
                            <tr key={payment.id} className="border-t border-night-line">
                              <td className="px-5 py-3">{formatDay(payment.createdAt)}</td>
                              <td className="px-5 py-3">{PAYMENT_LABELS[payment.kind]}</td>
                              <td className="px-5 py-3 text-right tabular-nums">
                                {formatCents(payment.amountCents)}
                                {payment.refundedCents > 0 && <span className="block text-xs text-white/50">{formatCents(payment.refundedCents)} refunded</span>}
                              </td>
                              <td className="px-5 py-3">
                                <Pill value={payment.status} label={payment.status === "succeeded" ? "paid" : undefined} />
                              </td>
                            </tr>
                          ))}
                          {invoices
                            .filter((invoice) => invoice.status !== "paid")
                            .map((invoice) => (
                              <tr key={invoice.id} className="border-t border-night-line">
                                <td className="px-5 py-3">{formatDay(invoice.createdAt)}</td>
                                <td className="px-5 py-3">{invoice.kind === "final" ? "Final balance invoice" : "Website Care invoice"}</td>
                                <td className="px-5 py-3 text-right tabular-nums">{formatCents(invoice.amountDueCents)}</td>
                                <td className="px-5 py-3">
                                  {invoice.status === "open" && invoice.hostedInvoiceUrl ? (
                                    <a href={invoice.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-on-night underline underline-offset-4">
                                      Pay now
                                    </a>
                                  ) : (
                                    <Pill value={invoice.status} />
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Panel>

                <Panel title="Website Care">
                  {careLive && subscription ? (
                    <div className="space-y-4 text-[15px]">
                      <div className="flex flex-wrap items-center gap-3">
                        <Pill value={subscription.status} />
                        <span className="tabular-nums">{formatCents(subscription.monthlyCents)}/month</span>
                      </div>
                      <dl className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <dt className="text-white/55">Next billing date</dt>
                          <dd>{subscription.cancelAt ? "No further renewals" : formatDay(subscription.currentPeriodEnd)}</dd>
                        </div>
                        <div>
                          <dt className="text-white/55">Minimum term ends</dt>
                          <dd>{formatDay(subscription.minimumTermEnd)}</dd>
                        </div>
                      </dl>
                      {subscription.cancelAt ? (
                        <Notice tone="info">Cancelled. Website Care ends on {formatDay(subscription.cancelAt)}, with no charges after that date.</Notice>
                      ) : (
                        <CancelCareForm projectId={project.id} effectiveDate={formatDay(careCancellationDate(subscription))} />
                      )}
                    </div>
                  ) : (
                    <p className="text-[15px] text-white/70">
                      Website Care ({formatCents(project.monthlyCents)}/month) starts after your site is approved for launch, and only once you authorize it.
                      {subscription?.status === "canceled" && " Your previous plan has ended."}
                    </p>
                  )}
                </Panel>
              </article>
            );
          })}

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Billing">
              <p className="text-[15px] text-white/70">
                Update your card, download receipts and invoices, and see your billing history in Stripe&apos;s secure billing portal.
              </p>
              <form action={openBillingPortal} className="mt-4">
                <SubmitButton variant="secondary" pendingLabel="Opening portal…">
                  Manage billing
                </SubmitButton>
              </form>
            </Panel>
            <Panel title="Support and additional services">
              <SupportForm projects={data.projects.map(({ project }) => ({ id: project.id, label: `${PLANS[project.plan].name} website` }))} />
              <p className="mt-4 text-xs text-white/50">
                Or email{" "}
                <a href={`mailto:${site.contact.email}`} className="underline underline-offset-4">
                  {site.contact.email}
                </a>
                .
              </p>
            </Panel>
          </div>

          {data.requests && data.requests.length > 0 && (
            <Panel title="Your requests">
              <ul className="divide-y divide-night-line text-sm">
                {data.requests.map((request) => (
                  <li key={request.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <span>{request.subject}</span>
                    <span className="flex items-center gap-3 text-white/55">
                      {formatDay(request.createdAt)} <Pill value={request.status} />
                    </span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      )}
    </Shell>
  );
}
