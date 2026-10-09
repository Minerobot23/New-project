import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ActionForm } from "@/components/billing/action-form";
import { EmptyState, Notice, Panel, Pill, Shell, StatusBadge, darkInput, formatDateTime, formatDay } from "@/components/billing/ui";
import { ONBOARDING_SECTIONS } from "@/content/onboarding";
import { adminProjectDetail } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/auth/session";
import { stripeDashboardUrl } from "@/lib/billing/config";
import { PLANS, formatCents } from "@/lib/billing/plans";
import { careCancellationDate } from "@/lib/billing/service";
import { getDb } from "@/lib/db";
import { PROJECT_STATUSES } from "@/lib/db/schema";
import { statusLabel } from "@/lib/notify/templates";
import { listUploads } from "@/lib/portal/uploads";
import { cancelCareAdminAction, finalInvoiceAction, inviteCareAction, refundAction, setStatusAction, syncAction } from "../../actions";

const PAYMENT_LABELS = { deposit: "Deposit", final: "Final balance", subscription: "Website Care" } as const;

function StripeLink({ path, livemode, children }: { path: string; livemode: boolean; children: React.ReactNode }) {
  return (
    <a href={stripeDashboardUrl(path, livemode)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent-on-night underline underline-offset-4">
      {children}
      <ExternalLink aria-hidden="true" className="size-3" />
    </a>
  );
}

export default async function AdminProjectPage({ params }: PageProps<"/admin/projects/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const db = await getDb();
  const detail = await adminProjectDetail(db, id);
  if (!detail) notFound();
  const files = await listUploads(db, id);
  const { project, customer, user, subscription, care } = detail;
  const live = project.livemode;
  const balance = project.devPriceCents - project.depositCents;
  const finalInvoices = detail.invoices.filter((invoice) => invoice.kind === "final");
  const finalPaid = detail.payments.some((payment) => payment.kind === "final");
  const openFinal = finalInvoices.find((invoice) => invoice.status === "open");
  const careLive = subscription && !["canceled", "incomplete_expired"].includes(subscription.status);
  const pid = { projectId: project.id };

  return (
    <Shell className="py-10 sm:py-12">
      <Link href="/admin" className="text-sm text-white/55 hover:text-white">
        ← Overview
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="display-tight text-[2rem] sm:text-[2.5rem]">{customer.businessName}</h1>
          <p className="mt-1 text-sm text-white/60">
            {PLANS[project.plan].name} · {customer.contactName} · {user.email}
            {customer.phone && ` · ${customer.phone}`} · {live ? "Live" : "Test mode"}
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Panel title="Project status" className="lg:col-span-1">
          <ActionForm action={setStatusAction} hidden={pid} submitLabel="Update status" pendingLabel="Updating…">
            <div>
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <select id="status" name="status" defaultValue={project.status} className={darkInput(false, "h-11")}>
                {PROJECT_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {statusLabel(status)}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs leading-relaxed text-white/50">
                The customer is emailed for client-facing stages. Payment-dependent stages (Ready for Launch, Live, Maintenance Active) need Stripe confirmation first.
              </p>
            </div>
          </ActionForm>
        </Panel>

        <Panel title="Amounts" className="lg:col-span-1">
          <dl className="space-y-2 text-[15px]">
            {[
              ["Development fee", formatCents(project.devPriceCents)],
              ["Deposit", formatCents(project.depositCents)],
              ["Balance", `${formatCents(balance)}${finalPaid ? " (paid)" : ""}`],
              ["Website Care", `${formatCents(project.monthlyCents)}/mo`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-white/60">{label}</dt>
                <dd className="tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          {detail.quote && <p className="mt-4 whitespace-pre-line border-t border-night-line pt-4 text-sm text-white/65">Quote scope: {detail.quote.scope}</p>}
        </Panel>

        <Panel title="Stripe" className="lg:col-span-1">
          <div className="space-y-3 text-sm">
            {customer.stripeCustomerId ? (
              <p>
                <StripeLink path={`customers/${customer.stripeCustomerId}`} livemode={live}>
                  Open customer in Stripe
                </StripeLink>
              </p>
            ) : (
              <p className="text-white/60">No Stripe customer linked.</p>
            )}
            <p className="text-white/55">Missed a webhook? Sync re-reads this customer&apos;s invoices, subscription, and refunds from Stripe.</p>
            <ActionForm action={syncAction} hidden={pid} submitLabel="Sync with Stripe" pendingLabel="Syncing…" variant="small" />
          </div>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Final balance invoice">
          {finalPaid ? (
            <Notice tone="success">Final balance paid (confirmed by Stripe).</Notice>
          ) : openFinal ? (
            <div className="space-y-2 text-sm">
              <p>
                Sent {formatDay(openFinal.createdAt)} for {formatCents(openFinal.amountDueCents)}
                {openFinal.dueAt && `, due ${formatDay(openFinal.dueAt)}`}. <Pill value={openFinal.status} />
              </p>
              {openFinal.lastFailureAt && <p className="text-red-300">Last payment attempt failed {formatDateTime(openFinal.lastFailureAt)}.</p>}
              <p className="flex flex-wrap gap-4">
                {openFinal.hostedInvoiceUrl && (
                  <a href={openFinal.hostedInvoiceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    Customer payment page
                  </a>
                )}
                <StripeLink path={`invoices/${openFinal.stripeInvoiceId}`} livemode={live}>
                  Invoice in Stripe
                </StripeLink>
              </p>
              <p className="text-xs text-white/50">Marked paid only when Stripe confirms payment. To change it, void it in Stripe, then sync and send a new one.</p>
            </div>
          ) : (
            <ActionForm
              action={finalInvoiceAction}
              hidden={pid}
              submitLabel={`Create and send invoice for ${formatCents(balance)}`}
              pendingLabel="Creating invoice…"
              confirm={`Send ${customer.businessName} a final invoice for ${formatCents(balance)}?`}
            >
              <div>
                <label htmlFor="days" className="text-sm font-medium">
                  Days until due
                </label>
                <input id="days" name="days" type="number" min={1} max={60} defaultValue={7} className={darkInput(false, "h-11 max-w-[8rem]")} />
                <p className="mt-2 text-xs text-white/50">Available once the project is In Development or Client Review. The status moves to Final Payment Pending.</p>
              </div>
            </ActionForm>
          )}
        </Panel>

        <Panel title="Website Care">
          {careLive && subscription ? (
            <div className="space-y-3 text-sm">
              <p className="flex flex-wrap items-center gap-3">
                <Pill value={subscription.status} /> {formatCents(subscription.monthlyCents)}/month ·{" "}
                <StripeLink path={`subscriptions/${subscription.stripeSubscriptionId}`} livemode={live}>
                  Subscription in Stripe
                </StripeLink>
              </p>
              <p className="text-white/65">
                Current period ends {formatDay(subscription.currentPeriodEnd)} · minimum term ends {formatDay(subscription.minimumTermEnd)}
              </p>
              {subscription.cancelAt ? (
                <Notice tone="info">Cancellation scheduled: ends {formatDay(subscription.cancelAt)}.</Notice>
              ) : (
                <ActionForm
                  action={cancelCareAdminAction}
                  hidden={pid}
                  submitLabel="Cancel Website Care"
                  variant="danger"
                  pendingLabel="Cancelling…"
                  confirm={`Cancel Website Care for ${customer.businessName}? It ends ${formatDay(careCancellationDate(subscription))} and the customer is emailed.`}
                />
              )}
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              {care && ["invited", "consented"].includes(care.status) ? (
                <p>
                  Offered {formatDay(care.createdAt)}. <Pill value={care.status} label={care.status === "consented" ? "terms accepted, awaiting Stripe" : "awaiting customer"} />
                </p>
              ) : (
                <p className="text-white/65">
                  Not active. Offer it once the site is approved and Ready for Launch; the customer then reviews the recurring terms and authorizes their payment method.
                  Nothing is charged until they do.
                </p>
              )}
              {subscription?.status === "canceled" && <p className="text-white/55">Previous subscription ended {formatDay(subscription.canceledAt)}.</p>}
              <ActionForm
                action={inviteCareAction}
                hidden={pid}
                submitLabel={care && ["invited", "consented"].includes(care.status) ? "Resend Website Care invitation" : "Offer Website Care"}
                pendingLabel="Sending…"
                variant="secondary"
              />
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Payments and refunds">
          {detail.payments.length === 0 ? (
            <EmptyState>No payments recorded.</EmptyState>
          ) : (
            <ul className="divide-y divide-night-line">
              {detail.payments.map((payment) => {
                const refundable = payment.amountCents - payment.refundedCents;
                return (
                  <li key={payment.id} className="grid gap-4 py-4 text-sm lg:grid-cols-[1fr_auto]">
                    <div>
                      <p className="flex flex-wrap items-center gap-3">
                        <span className="font-medium">{PAYMENT_LABELS[payment.kind]}</span>
                        <span className="tabular-nums">{formatCents(payment.amountCents)}</span>
                        <Pill value={payment.status} label={payment.status === "succeeded" ? "paid" : undefined} />
                        {payment.refundedCents > 0 && <span className="text-white/55">{formatCents(payment.refundedCents)} refunded</span>}
                      </p>
                      <p className="mt-1 text-xs text-white/50">
                        {formatDateTime(payment.createdAt)}
                        {payment.stripePaymentIntentId && (
                          <>
                            {" · "}
                            <StripeLink path={`payments/${payment.stripePaymentIntentId}`} livemode={live}>
                              Payment in Stripe
                            </StripeLink>
                          </>
                        )}
                      </p>
                    </div>
                    {refundable > 0 && payment.stripePaymentIntentId && (
                      <details className="border border-night-line bg-night px-4 py-3 lg:w-[22rem]">
                        <summary className="cursor-pointer text-sm font-medium">Issue an approved refund</summary>
                        <ActionForm
                          action={refundAction}
                          hidden={{ paymentId: payment.id }}
                          submitLabel="Refund through Stripe"
                          pendingLabel="Submitting…"
                          variant="danger"
                          confirm="Send this refund to Stripe? It can't be undone."
                          className="mt-3"
                        >
                          <div>
                            <label htmlFor={`amount-${payment.id}`} className="text-xs font-medium text-white/70">
                              Amount (USD, up to {formatCents(refundable)})
                            </label>
                            <input
                              id={`amount-${payment.id}`}
                              name="amount"
                              type="number"
                              step="0.01"
                              min="0.01"
                              max={(refundable / 100).toFixed(2)}
                              defaultValue={(refundable / 100).toFixed(2)}
                              required
                              className={darkInput(false, "h-10")}
                            />
                          </div>
                          <div>
                            <label htmlFor={`reason-${payment.id}`} className="text-xs font-medium text-white/70">
                              Reason (kept in the audit log)
                            </label>
                            <input id={`reason-${payment.id}`} name="reason" required maxLength={300} className={darkInput(false, "h-10")} />
                          </div>
                          <label className="flex gap-2 text-xs text-white/75">
                            <input type="checkbox" name="approved" required className="mt-0.5" /> This refund is approved under the agreement&apos;s refund terms.
                          </label>
                        </ActionForm>
                      </details>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          {detail.invoices.length > 0 && (
            <div className="mt-6 border-t border-night-line pt-4">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/50">Invoices</p>
              <ul className="mt-2 space-y-2 text-sm">
                {detail.invoices.map((invoice) => (
                  <li key={invoice.id} className="flex flex-wrap items-center gap-3">
                    <span>{invoice.kind === "final" ? "Final balance" : "Website Care"}</span>
                    <span className="tabular-nums">{formatCents(invoice.amountDueCents)}</span>
                    <Pill value={invoice.status} />
                    <span className="text-white/50">{formatDay(invoice.createdAt)}</span>
                    <StripeLink path={`invoices/${invoice.stripeInvoiceId}`} livemode={live}>
                      Stripe
                    </StripeLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title={`Onboarding${detail.onboarding?.submittedAt ? ` · submitted ${formatDay(detail.onboarding.submittedAt)}` : ""}`}>
          {!detail.onboarding ? (
            <EmptyState>The customer hasn&apos;t started onboarding.</EmptyState>
          ) : (
            <dl className="space-y-4 text-sm">
              {ONBOARDING_SECTIONS.flatMap((section) => section.fields).map((field) =>
                detail.onboarding?.data[field.name] ? (
                  <div key={field.name}>
                    <dt className="text-xs font-medium uppercase tracking-[0.12em] text-white/50">{field.label}</dt>
                    <dd className="mt-1 whitespace-pre-line break-words text-white/85">{detail.onboarding.data[field.name]}</dd>
                  </div>
                ) : null,
              )}
            </dl>
          )}
        </Panel>
        <div className="space-y-6">
          <Panel title={`Files (${files.length})`}>
            {files.length === 0 ? (
              <EmptyState>No files uploaded.</EmptyState>
            ) : (
              <ul className="space-y-2 text-sm">
                {files.map((file) => (
                  <li key={file.id} className="flex justify-between gap-3">
                    <a href={`/api/uploads/${file.id}`} className="truncate underline underline-offset-4">
                      {file.filename}
                    </a>
                    <span className="shrink-0 text-white/50">{formatDay(file.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title="Agreements accepted">
            {detail.agreements.length === 0 ? (
              <EmptyState>None recorded.</EmptyState>
            ) : (
              <ul className="space-y-3 text-sm">
                {detail.agreements.map((agreement) => (
                  <li key={agreement.id}>
                    <p className="font-medium">{agreement.kind === "service" ? "Service agreement" : "Website Care terms"} · version {agreement.version}</p>
                    <p className="text-xs text-white/50">
                      {formatDateTime(agreement.acceptedAt)} · {agreement.email} · text hash {agreement.textHash.slice(0, 12)}…
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      <div className="mt-6">
        <Panel title="Activity">
          {detail.events.length === 0 ? (
            <EmptyState>No activity yet.</EmptyState>
          ) : (
            <ol className="space-y-3 text-sm">
              {detail.events.map(({ event, actor }) => (
                <li key={event.id} className="grid gap-1 sm:grid-cols-[11rem_1fr]">
                  <span className="text-white/50">{formatDateTime(event.createdAt)}</span>
                  <span>
                    {event.detail ?? event.kind} <span className="text-white/45">· {actor ?? "Stripe/system"}</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </Shell>
  );
}
