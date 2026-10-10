import { ActionForm } from "@/components/billing/action-form";
import { Notice, darkInput } from "@/components/billing/ui";
import { adminElevatedUntil } from "@/lib/auth/session";
import { requestStepUpAction, verifyStepUpAction } from "./actions";

/** Shown above financial controls: refunds, invoices, cancellations and quotes need a fresh emailed code. */
export async function StepUpPanel() {
  const until = await adminElevatedUntil();
  if (until) {
    return (
      <Notice tone="success" title="Billing actions unlocked">
        Verified until {until.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" })} (Eastern).
      </Notice>
    );
  }
  return (
    <div className="border border-amber-300/50 bg-amber-300/10 px-4 py-4">
      <p className="text-sm font-semibold text-white">Confirm it&apos;s you to make billing changes</p>
      <p className="mt-1 text-sm text-white/75">Refunds, final invoices, Website Care cancellations and quotes need a verification code sent to your email.</p>
      <div className="mt-4 flex flex-wrap items-start gap-6">
        <ActionForm action={requestStepUpAction} submitLabel="Email me a code" pendingLabel="Sending…" variant="small" />
        <ActionForm action={verifyStepUpAction} submitLabel="Verify" pendingLabel="Checking…" variant="small" inline>
          <div>
            <label htmlFor="step-up-code" className="sr-only">
              Verification code
            </label>
            <input
              id="step-up-code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={7}
              placeholder="6-digit code"
              className={darkInput(false, "h-9 w-36")}
            />
          </div>
        </ActionForm>
      </div>
    </div>
  );
}
