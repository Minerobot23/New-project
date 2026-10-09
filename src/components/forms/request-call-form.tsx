"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { buttonClasses } from "@/components/ui/button-link";
import { LIMITS } from "@/lib/leads/fields";
import {
  BUSINESS_TYPE_LABELS,
  DEMO_BUSINESS_TYPE,
  PREFERRED_TIME_LABELS,
  PROJECT_TYPE_LABELS,
  requestCallSchema,
} from "@/lib/leads/schemas";
import { ChoiceGroup, FieldError, FormAlert, Honeypot, PrivacyNote, SelectField, SubmitButton, SuccessPanel, TextField, inputClasses } from "./fields";
import { useLeadForm } from "./use-lead-form";

const FIELD_ORDER = ["name", "businessName", "phone", "businessType", "email", "website", "projectType", "preferredTime", "message"];

const DEMO_NAMES: Record<string, string> = {
  restaurant: "the Maison Arden restaurant demo",
  home: "the Saltbox Home Co. demo",
  automotive: "the Halden Motor Works demo",
};

const subscribeNoop = () => () => {};
/** `?from=restaurant|home|automotive`, set by the "Want this for your business?" links in the demos. */
const readFrom = () => new URLSearchParams(window.location.search).get("from") ?? "";

export function RequestCallForm() {
  const from = useSyncExternalStore(subscribeNoop, readFrom, () => "");
  const inferredType = DEMO_BUSINESS_TYPE[from] ?? "";
  const { status, errors, formError, formRef, successRef, onSubmit, revalidate, onFirstInput } = useLeadForm({
    endpoint: "/api/leads/request-call",
    schema: requestCallSchema,
    fieldOrder: FIELD_ORDER,
    startedEvent: "call_form_started",
    submittedEvent: "call_form_submitted",
  });

  if (status === "success") {
    return (
      <SuccessPanel
        headingRef={successRef}
        title="Request received."
        body="Thanks for reaching out. We'll call the number you gave us to find a time to talk."
      >
        <Link href="/" className={buttonClasses("secondary", "md", "mt-8")}>
          Back to homepage
        </Link>
      </SuccessPanel>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} onInput={onFirstInput} noValidate aria-describedby="call-form-note" className="space-y-5">
      {status === "error" && <FormAlert message={formError} />}
      <p id="call-form-note" className="text-sm text-muted">
        Three details are all we need to call you back. Everything else is optional.
      </p>

      <TextField name="name" label="Your name" autoComplete="name" maxLength={LIMITS.name} error={errors.name} onInput={revalidate} />
      <TextField name="businessName" label="Business name" autoComplete="organization" maxLength={LIMITS.business} error={errors.businessName} onInput={revalidate} />
      <TextField name="phone" label="Phone number to call" type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} error={errors.phone} onInput={revalidate} />

      <SelectField
        // Remount when the inferred value arrives, so it becomes the select's starting value.
        key={inferredType}
        name="businessType"
        label="Type of business"
        optional
        defaultValue={inferredType}
        hint={inferredType ? `Pre-selected because you came from ${DEMO_NAMES[from]}. Change it if that's not right.` : undefined}
        options={BUSINESS_TYPE_LABELS}
        error={errors.businessType}
        onInput={revalidate}
      />

      <details className="border-t border-line pt-4">
        <summary className="cursor-pointer text-sm font-medium text-ink">Add more detail (optional)</summary>
        <div className="mt-5 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField name="email" label="Email" optional type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} error={errors.email} onInput={revalidate} />
            <TextField
              name="website"
              label="Current website"
              optional
              inputMode="url"
              autoComplete="url"
              placeholder="yourbusiness.com"
              maxLength={LIMITS.url}
              error={errors.website}
              onInput={revalidate}
            />
          </div>
          <ChoiceGroup name="projectType" legend="What are you looking for?" optional options={PROJECT_TYPE_LABELS} error={errors.projectType} onInput={revalidate} />
          <ChoiceGroup name="preferredTime" legend="Best time to call" optional options={PREFERRED_TIME_LABELS} error={errors.preferredTime} onInput={revalidate} />
          <div>
            <label htmlFor="message" className="text-sm font-medium text-ink">
              Anything you&apos;d like us to know? <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              maxLength={LIMITS.message}
              onInput={revalidate}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={inputClasses(Boolean(errors.message), "min-h-28 resize-y py-2.5")}
            />
            {errors.message && <FieldError id="message-error">{errors.message}</FieldError>}
          </div>
        </div>
      </details>

      <Honeypot />
      <SubmitButton submitting={status === "submitting"}>Request my call</SubmitButton>
      <PrivacyNote />
    </form>
  );
}
