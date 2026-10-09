"use client";

import { useActionState } from "react";
import { MailCheck } from "lucide-react";
import { SubmitButton } from "@/components/billing/submit-button";
import { darkInput } from "@/components/billing/styles";
import { useKeepValuesSubmit } from "@/components/billing/use-submit";
import { requestLoginLink, type LoginState } from "../auth/actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<LoginState, FormData>(requestLoginLink, null);
  const { onSubmit, pending } = useKeepValuesSubmit(action);

  if (state?.sent) {
    return (
      <div role="status" className="border border-night-line bg-night-soft p-6">
        <MailCheck aria-hidden="true" className="size-7 text-accent-on-night" />
        <p className="mt-4 text-lg font-semibold">Check your email.</p>
        <p className="mt-2 text-[15px] leading-relaxed text-white/70">
          If that address belongs to a Fluxline client account, we&apos;ve sent a sign-in link. It works once and expires in 20 minutes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}
      <div>
        <label htmlFor="email" className="text-sm font-medium text-white">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          maxLength={200}
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? "email-error" : "email-hint"}
          className={darkInput(Boolean(state?.error), "h-12")}
        />
        {state?.error ? (
          <p id="email-error" className="mt-1.5 text-sm text-red-300">
            {state.error}
          </p>
        ) : (
          <p id="email-hint" className="mt-1.5 text-xs text-white/50">
            Use the email you used at checkout.
          </p>
        )}
      </div>
      <SubmitButton pending={pending} pendingLabel="Sending link…" className="h-12 w-full">
        Email me a sign-in link
      </SubmitButton>
    </form>
  );
}
