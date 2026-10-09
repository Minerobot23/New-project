"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/billing/submit-button";
import { useKeepValuesSubmit } from "@/components/billing/use-submit";
import { startCareAction, type FormState } from "../actions";

export function CareAuthorizeForm({ projectId, termsVersion, monthly, disabled }: { projectId: string; termsVersion: string; monthly: string; disabled: boolean }) {
  const [state, action] = useActionState<FormState, FormData>(startCareAction, null);
  const { onSubmit, pending } = useKeepValuesSubmit(action);
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="termsVersion" value={termsVersion} />
      <label className="flex gap-3 text-[15px] leading-relaxed text-white/85">
        <input type="checkbox" name="authorize" required aria-describedby="care-terms" className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]" />
        <span>
          I have read the Website Care terms (version {termsVersion}) and authorize Fluxline Solutions to charge {monthly} to my payment method every month until I
          cancel, with a three-month minimum.
        </span>
      </label>
      {state?.error && (
        <p role="alert" className="text-sm text-red-300">
          {state.error}
        </p>
      )}
      <SubmitButton pending={pending} pendingLabel="Opening secure checkout…" disabled={disabled} className="w-full">
        Continue to add payment method
      </SubmitButton>
      <p className="text-xs leading-relaxed text-white/50">You&apos;ll confirm your card on Stripe&apos;s secure page. Fluxline never sees your card number.</p>
    </form>
  );
}
