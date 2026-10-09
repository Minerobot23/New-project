"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/billing/submit-button";
import { darkInput } from "@/components/billing/styles";
import { useKeepValuesSubmit } from "@/components/billing/use-submit";
import { startCheckoutAction, type CheckoutFormState } from "./actions";

type Props = {
  intentId: string;
  plan: string;
  agreementVersion: string;
  agreementId: string;
  depositLabel: string;
  monthlyLabel: string;
  quoteToken?: string;
  /** For quotes, the email is fixed to the address the quote was sent to. */
  fixedEmail?: string;
  defaults?: { contactName?: string; businessName?: string };
  disabledReason?: string;
};

function Field({
  name,
  label,
  error,
  type = "text",
  autoComplete,
  inputMode,
  defaultValue,
  readOnly,
  maxLength,
}: {
  name: string;
  label: string;
  error?: string;
  type?: string;
  autoComplete: string;
  inputMode?: "text" | "email" | "tel";
  defaultValue?: string;
  readOnly?: boolean;
  maxLength: number;
}) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-white">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        inputMode={inputMode}
        defaultValue={defaultValue}
        readOnly={readOnly}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={darkInput(Boolean(error), `h-11 ${readOnly ? "opacity-70" : ""}`)}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckoutForm(props: Props) {
  const [state, action] = useActionState<CheckoutFormState, FormData>(startCheckoutAction, null);
  const { onSubmit, pending } = useKeepValuesSubmit(action);
  const errors = state?.fieldErrors ?? {};
  const disabled = Boolean(props.disabledReason);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <input type="hidden" name="intentId" value={props.intentId} />
      <input type="hidden" name="plan" value={props.plan} />
      <input type="hidden" name="agreementVersion" value={props.agreementVersion} />
      {props.quoteToken && <input type="hidden" name="quoteToken" value={props.quoteToken} />}

      <fieldset disabled={disabled} className="space-y-5">
        <legend className="sr-only">Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="contactName" label="Your name" autoComplete="name" maxLength={120} error={errors.contactName} defaultValue={props.defaults?.contactName} />
          <Field name="businessName" label="Business name" autoComplete="organization" maxLength={160} error={errors.businessName} defaultValue={props.defaults?.businessName} />
          <Field
            name="email"
            label="Email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={200}
            error={errors.email}
            defaultValue={props.fixedEmail}
            readOnly={Boolean(props.fixedEmail)}
          />
          <Field name="phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={40} error={errors.phone} />
        </div>

        <div className="space-y-4 border-t border-night-line pt-5">
          <label className="flex gap-3 text-[15px] leading-relaxed text-white/85">
            <input
              type="checkbox"
              name="acceptAgreement"
              required
              aria-invalid={errors.acceptAgreement ? true : undefined}
              aria-describedby={errors.acceptAgreement ? "acceptAgreement-error" : props.agreementId}
              className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
            />
            <span>
              I have read and agree to the <a href={`#${props.agreementId}`} className="underline underline-offset-4">Website Development Service Agreement</a>{" "}
              (version {props.agreementVersion}), including the payment schedule and refund terms.
            </span>
          </label>
          {errors.acceptAgreement && (
            <p id="acceptAgreement-error" className="-mt-2 pl-7 text-sm text-red-300">
              {errors.acceptAgreement}
            </p>
          )}
          <label className="flex gap-3 text-[15px] leading-relaxed text-white/85">
            <input
              type="checkbox"
              name="acknowledgeCare"
              required
              aria-invalid={errors.acknowledgeCare ? true : undefined}
              aria-describedby={errors.acknowledgeCare ? "acknowledgeCare-error" : undefined}
              className="mt-1 size-4 shrink-0 accent-[var(--color-accent)]"
            />
            <span>
              I understand my website requires the Website Care plan at {props.monthlyLabel}/month after launch, with a three-month minimum. It is{" "}
              <strong className="font-semibold text-white">not</strong> charged today: I&apos;ll review and authorize it separately before launch.
            </span>
          </label>
          {errors.acknowledgeCare && (
            <p id="acknowledgeCare-error" className="-mt-2 pl-7 text-sm text-red-300">
              {errors.acknowledgeCare}
            </p>
          )}
        </div>
      </fieldset>

      {state?.error && (
        <p role="alert" className="border border-red-400/50 bg-red-400/10 px-4 py-3 text-sm text-white">
          {state.error}
        </p>
      )}

      <SubmitButton pending={pending} pendingLabel="Opening secure checkout…" disabled={disabled} className="h-14 w-full text-[15px]">
        Continue to secure payment · {props.depositLabel} deposit
      </SubmitButton>
      <p className="text-center text-xs leading-relaxed text-white/50">
        You&apos;ll pay on Stripe&apos;s secure checkout page. Fluxline never sees or stores your card number.
      </p>
    </form>
  );
}
