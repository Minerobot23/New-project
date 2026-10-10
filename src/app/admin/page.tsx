import Link from "next/link";
import { ActionForm } from "@/components/billing/action-form";
import { EmptyState, Notice, Panel, Pill, Shell, Stat, StatusBadge, darkInput, formatDay } from "@/components/billing/ui";
import { adminOverview, adminProjects, emailHealth, openQuarantine, openSupportRequests } from "@/lib/admin/data";
import { requireAdmin } from "@/lib/auth/session";
import { billingStatus, stripeDashboardUrl } from "@/lib/billing/config";
import { PLANS, formatCents } from "@/lib/billing/plans";
import { getDb } from "@/lib/db";
import { PROJECT_STATUSES, type ProjectStatus } from "@/lib/db/schema";
import { statusLabel } from "@/lib/notify/templates";
import { closeRequestAction, reconcileCheckoutsAction, resolveQuarantineAction, retryEmailsAction } from "./actions";

export default async function AdminOverviewPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const params = await searchParams;
  const status = billingStatus();
  const livemode = params.mode === "live" ? true : params.mode === "test" ? false : status.mode === "live";
  const filter = PROJECT_STATUSES.includes(params.status as ProjectStatus) ? (params.status as ProjectStatus) : undefined;
  const q = typeof params.q === "string" ? params.q.slice(0, 100) : undefined;

  const db = await getDb();
  const [overview, rows, requests, emails, quarantined] = await Promise.all([
    adminOverview(db, { livemode }),
    adminProjects(db, { livemode, status: filter, q }),
    openSupportRequests(db),
    emailHealth(db),
    openQuarantine(db),
  ]);
  const undelivered = (emails.counts.queued ?? 0) + (emails.counts.sending ?? 0) + (emails.counts.failed ?? 0) + (emails.counts.dead ?? 0);

  return (
    <Shell className="py-10 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="display-tight text-[2rem] sm:text-[2.5rem]">Overview</h1>
          <p className="mt-1 text-sm text-white/55">Showing {livemode ? "live" : "test-mode"} records. Figures reflect payments Stripe has confirmed.</p>
        </div>
        <div className="flex gap-2 text-sm">
          <Link href="/admin?mode=test" aria-current={!livemode ? "page" : undefined} className={`px-3 py-1.5 ${!livemode ? "bg-white text-ink" : "text-white/70 hover:text-white"}`}>
            Test
          </Link>
          <Link href="/admin?mode=live" aria-current={livemode ? "page" : undefined} className={`px-3 py-1.5 ${livemode ? "bg-white text-ink" : "text-white/70 hover:text-white"}`}>
            Live
          </Link>
        </div>
      </div>

      {!status.enabled && (
        <div className="mt-6">
          <Notice tone="warning" title="Payments are switched off">
            {status.reason} See docs/BILLING-SETUP.md.
          </Notice>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Customers" value={overview.customers} />
        <Stat label="Active projects" value={overview.activeProjects} hint="Deposit paid through ready for launch" />
        <Stat label="Deposits collected" value={formatCents(overview.depositsCents)} hint="Net of refunds" />
        <Stat label="Outstanding balances" value={formatCents(overview.outstandingCents)} hint="Final payments not yet received" />
        <Stat label="Active subscriptions" value={overview.activeSubscriptions} />
        <Stat label="MRR" value={formatCents(overview.mrrCents)} hint="Active Website Care, excluding scheduled cancellations" />
        <Stat label="Failed payments" value={overview.failedPayments.length} hint={overview.pastDueSubscriptions ? `${overview.pastDueSubscriptions} subscription(s) past due` : undefined} />
        <Stat label="Unconfirmed checkouts" value={overview.openCheckouts} hint="Started but not confirmed by Stripe" />
      </div>

      {quarantined.length > 0 && (
        <div className="mt-8">
          <Panel title={`Payments needing review (${quarantined.length})`}>
            <p className="mb-4 text-sm text-white/65">
              Stripe reported these, but they didn&apos;t match what we expected, so nothing was fulfilled. Check each in Stripe, refund or fulfil manually, then mark it reviewed.
            </p>
            <ul className="divide-y divide-night-line text-sm">
              {quarantined.map((item) => (
                <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium">{item.reason.replace(/_/g, " ")}</p>
                    <p className="text-xs text-white/55">
                      {item.eventType} · {item.stripeObjectId ?? "no object"} · {item.livemode ? "live" : "test"} · {formatDay(item.createdAt)}
                    </p>
                  </div>
                  <ActionForm action={resolveQuarantineAction} hidden={{ id: item.id }} submitLabel="Mark reviewed" variant="small" />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      {undelivered > 0 && (
        <div className="mt-8">
          <Panel
            title="Emails waiting to send"
            action={<ActionForm action={retryEmailsAction} submitLabel="Retry now" pendingLabel="Sending…" variant="small" inline />}
          >
            <p className="text-sm text-white/70">
              {emails.counts.queued ?? 0} queued · {emails.counts.failed ?? 0} retrying · {emails.counts.dead ?? 0} gave up. Failed emails retry automatically with
              increasing delays; &ldquo;Retry now&rdquo; also re-queues ones that gave up (sign-in links are re-issued fresh).
            </p>
            {emails.recentProblems.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs text-white/55">
                {emails.recentProblems.map((row) => (
                  <li key={row.key}>
                    {row.template} · {row.status} after {row.attempts} attempt(s) · {row.error ?? ""}
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}

      {overview.failedPayments.length > 0 && (
        <div className="mt-8">
          <Panel title="Failed payments">
            <ul className="divide-y divide-night-line text-sm">
              {overview.failedPayments.map(({ invoice, businessName }) => (
                <li key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <Link href={`/admin/projects/${invoice.projectId}`} className="font-medium hover:text-accent-on-night">
                    {businessName}
                  </Link>
                  <span className="flex flex-wrap items-center gap-3 text-white/65">
                    {formatCents(invoice.amountDueCents)} · attempt {invoice.attemptCount} · {formatDay(invoice.lastFailureAt)}
                    <a href={stripeDashboardUrl(`invoices/${invoice.stripeInvoiceId}`, livemode)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                      Stripe
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}

      <div className="mt-8">
        <Panel
          title="Projects"
          action={
            <ActionForm action={reconcileCheckoutsAction} submitLabel="Reconcile checkouts with Stripe" pendingLabel="Checking…" variant="small" inline />
          }
        >
          <form className="mb-5 flex flex-wrap items-end gap-3" role="search">
            <input type="hidden" name="mode" value={livemode ? "live" : "test"} />
            <div className="min-w-[12rem] flex-1">
              <label htmlFor="q" className="text-xs font-medium text-white/60">
                Search
              </label>
              <input id="q" name="q" defaultValue={q} placeholder="Business, name, or email" className={darkInput(false, "h-10")} />
            </div>
            <div>
              <label htmlFor="status" className="text-xs font-medium text-white/60">
                Status
              </label>
              <select id="status" name="status" defaultValue={filter ?? ""} className={darkInput(false, "h-10")}>
                <option value="">All statuses</option>
                {PROJECT_STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {statusLabel(value)}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="h-10 bg-white px-4 text-sm font-medium text-ink hover:bg-accent hover:text-white">
              Filter
            </button>
          </form>
          {rows.length === 0 ? (
            <EmptyState>No projects{filter || q ? " match this filter" : " yet"}. Projects appear when Stripe confirms a deposit.</EmptyState>
          ) : (
            <div className="relative -mx-5 overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="text-white/50">
                  <tr>
                    <th scope="col" className="px-5 py-2 font-medium">Customer</th>
                    <th scope="col" className="px-5 py-2 font-medium">Package</th>
                    <th scope="col" className="px-5 py-2 font-medium">Status</th>
                    <th scope="col" className="px-5 py-2 font-medium">Onboarding</th>
                    <th scope="col" className="px-5 py-2 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ project, customer, email, onboardingSubmitted }) => (
                    <tr key={project.id} className="border-t border-night-line">
                      <td className="px-5 py-3">
                        <Link href={`/admin/projects/${project.id}`} className="font-medium hover:text-accent-on-night">
                          {customer.businessName}
                        </Link>
                        <span className="block text-xs text-white/50">
                          {customer.contactName} · {email}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {PLANS[project.plan].name}
                        <span className="block text-xs text-white/50">{formatCents(project.devPriceCents)}</span>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-5 py-3">{onboardingSubmitted ? <Pill value="paid" label="submitted" /> : <Pill value="open" label="pending" />}</td>
                      <td className="px-5 py-3 text-white/65">{formatDay(project.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-8">
        <Panel title="Open requests">
          {requests.length === 0 ? (
            <EmptyState>No open support or service requests.</EmptyState>
          ) : (
            <ul className="divide-y divide-night-line text-sm">
              {requests.map(({ request, businessName }) => (
                <li key={request.id} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div>
                    <p className="font-medium">
                      {request.subject} <span className="font-normal text-white/50">· {businessName}</span>
                    </p>
                    <p className="mt-1 whitespace-pre-line text-white/70">{request.message}</p>
                    <p className="mt-1 text-xs text-white/45">
                      {request.kind === "additional_service" ? "Additional service" : "Support"} · {formatDay(request.createdAt)}
                      {request.projectId && (
                        <>
                          {" · "}
                          <Link href={`/admin/projects/${request.projectId}`} className="underline underline-offset-4">
                            Project
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                  <ActionForm action={closeRequestAction} hidden={{ requestId: request.id }} submitLabel="Mark handled" variant="small" />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </Shell>
  );
}
