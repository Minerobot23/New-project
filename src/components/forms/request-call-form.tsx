"use client";

import Link from "next/link";
import { buttonClasses } from "@/components/ui/button-link";
import { LIMITS } from "@/lib/leads/fields";
import {
  BUSINESS_TYPE_LABELS,
  PREFERRED_TIME_LABELS,
  PROJECT_TYPE_LABELS,
  requestCallSchema,
} from "@/lib/leads/schemas";
import { ChoiceGroup, FieldError, FormAlert, Honeypot, PrivacyNote, SelectField, SubmitButton, SuccessPanel, TextField, inputClasses } from "./fields";
import { useLeadForm } from "./use-lead-form";

const FIELD_ORDER = [
  "firstName",
  "lastName",
  "businessName",
  "website",
  "email",
  "phone",
  "businessType",
  "projectType",
  "preferredTime",
  "message",
];

export function RequestCallForm() {
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
        body="Thanks for reaching out. We'll review your business and contact you shortly to coordinate a time."
      >
        <Link href="/" className={buttonClasses("secondary", "md", "mt-8")}>
          Back to homepage
        </Link>
      </SuccessPanel>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onInput={onFirstInput}
      noValidate
      aria-describedby="call-form-note"
      className="space-y-5"
    >
      {status === "error" && <FormAlert message={formError} />}
      <p id="call-form-note" className="text-sm text-muted">
        All fields are required unless marked optional.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="firstName" label="First name" autoComplete="given-name" maxLength={LIMITS.name} error={errors.firstName} onInput={revalidate} />
        <TextField name="lastName" label="Last name" autoComplete="family-name" maxLength={LIMITS.name} error={errors.lastName} onInput={revalidate} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="businessName" label="Business name" autoComplete="organization" maxLength={LIMITS.business} error={errors.businessName} onInput={revalidate} />
        <TextField
          name="website"
          label="Business website"
          optional
          inputMode="url"
          autoComplete="url"
          placeholder="yourbusiness.com"
          maxLength={LIMITS.url}
          error={errors.website}
          onInput={revalidate}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="email" label="Business email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} error={errors.email} onInput={revalidate} />
        <TextField name="phone" label="Phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} error={errors.phone} onInput={revalidate} />
      </div>

      <SelectField name="businessType" label="Type of business" options={BUSINESS_TYPE_LABELS} error={errors.businessType} onInput={revalidate} />
      <ChoiceGroup name="projectType" legend="What are you looking for?" options={PROJECT_TYPE_LABELS} error={errors.projectType} onInput={revalidate} />
      <ChoiceGroup name="preferredTime" legend="Preferred contact time" optional options={PREFERRED_TIME_LABELS} error={errors.preferredTime} onInput={revalidate} />

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

      <Honeypot />
      <SubmitButton submitting={status === "submitting"}>Request My Call</SubmitButton>
      <PrivacyNote />
    </form>
  );
}
