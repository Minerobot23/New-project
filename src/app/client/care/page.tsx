import Link from "next/link";
import { AgreementView } from "@/components/billing/agreement";
import { Notice, Panel, Shell } from "@/components/billing/ui";
import { WEBSITE_CARE_TERMS } from "@/content/agreements";
import { projectsForUser } from "@/lib/auth/core";
import { requireClient } from "@/lib/auth/session";
import { billingStatus } from "@/lib/billing/config";
import { CARE_MINIMUM_MONTHS, PLANS, formatCents } from "@/lib/billing/plans";
import { careState } from "@/lib/billing/service";
import { getDb } from "@/lib/db";
import { CareAuthorizeForm } from "./care-form";

/*
 * Website Care authorization. Shown only when Fluxline has offered Care (site approved and ready for launch).
 * The customer reads the recurring terms, ticks an explicit authorization, and then sets up the payment method
 * on Stripe's hosted page. Nothing recurs until Stripe confirms the subscription.
 */
export default async function CarePage({ searchParams }: PageProps<"/client/care">) {
  const { project: requested, cancelled } = await searchParams;
  const user = await requireClient(`/client/care${typeof requested === "string" ? `?project=${requested}` : ""}`);
  const db = await getDb();
  const owned = await projectsForUser(db, user.id);
  const match = owned.find((row) => row.project.id === requested);

  const back = (
    <Link href="/client/dashboard" className="text-sm text-white/55 hover:text-white">
      ← Dashboard
    </Link>
  );
  if (!match) {
    return (
      <Shell className="py-10 sm:py-14">
        {back}
        <div className="mt-6">
          <Notice tone="warning">We couldn&apos;t find that project in your account.</Notice>
        </div>
      </Shell>
    );
  }

  const { project } = match;
  const { activation, subscription } = await careState(db, project.id);
  const status = billingStatus();
  const offered = activation && ["invited", "consented"].includes(activation.status);
  const active = subscription && !["canceled", "incomplete_expired"].includes(subscription.status);
  const monthly = formatCents(project.monthlyCents);

  return (
    <Shell className="py-10 sm:py-14">
      {back}
      <h1 className="display-tight mt-4 text-[2rem] sm:text-[2.75rem]">Website Care</h1>
      <p className="mt-3 max-w-[62ch] text-white/65">
        Hosting, security, updates, and support for your {PLANS[project.plan].name} website: {monthly}/month, {CARE_MINIMUM_MONTHS}-month minimum, then month to
        month. Cancel online at any time.
      </p>

      <div className="mt-8 space-y-3">
        {cancelled === "1" && <Notice tone="info">You left the payment page, so Website Care wasn&apos;t set up and nothing was charged.</Notice>}
        {active && <Notice tone="success">Website Care is already active for this project.</Notice>}
        {!active && !offered && (
          <Notice tone="info">Website Care becomes available once your site is approved and ready for launch. We&apos;ll email you when it&apos;s time.</Notice>
        )}
        {!status.enabled && offered && <Notice tone="warning">Online billing is temporarily unavailable. Please try again shortly.</Notice>}
      </div>

      {offered && !active && (
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <AgreementView doc={WEBSITE_CARE_TERMS} id="care-terms" height="h-96" />
          </div>
          <div className="lg:col-span-5">
            <Panel title="Authorize Website Care">
              <dl className="mb-5 space-y-2 text-[15px]">
                {[
                  ["Monthly charge", `${monthly}/month`],
                  ["Billing", "Monthly, starting today"],
                  ["Minimum term", `${CARE_MINIMUM_MONTHS} months`],
                  ["Cancel", "Online, any time"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-white/60">{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <CareAuthorizeForm projectId={project.id} termsVersion={WEBSITE_CARE_TERMS.version} monthly={monthly} disabled={!status.enabled} />
            </Panel>
          </div>
        </div>
      )}
    </Shell>
  );
}
