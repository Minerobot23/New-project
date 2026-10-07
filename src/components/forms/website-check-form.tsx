"use client";

import Link from "next/link";
import { buttonClasses } from "@/components/ui/button-link";
import { LIMITS } from "@/lib/leads/fields";
import { BUSINESS_TYPE_LABELS, websiteCheckSchema } from "@/lib/leads/schemas";
import { CALL_PATH } from "@/lib/site";
import { FormAlert, Honeypot, PrivacyNote, SelectField, SubmitButton, SuccessPanel, TextField } from "./fields";
import { useLeadForm } from "./use-lead-form";

const FIELD_ORDER = ["website", "businessName", "businessType", "firstName", "email", "phone"];

export function WebsiteCheckForm() {
  const { status, errors, formError, formRef, successRef, onSubmit, revalidate, onFirstInput } = useLeadForm({
    endpoint: "/api/leads/website-check",
    schema: websiteCheckSchema,
    fieldOrder: FIELD_ORDER,
    startedEvent: "website_check_started",
    submittedEvent: "website_check_submitted",
  });

  if (status === "success") {
    return (
      <SuccessPanel
        headingRef={successRef}
        title="Request received."
        body="Thanks. We'll personally review your website and follow up with what we'd improve. If you'd rather talk it through, you can also request a call."
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={CALL_PATH} className={buttonClasses("primary", "md")}>
            Request a Call
          </Link>
          <Link href="/" className={buttonClasses("secondary", "md")}>
            Back to homepage
          </Link>
        </div>
      </SuccessPanel>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} onInput={onFirstInput} noValidate className="space-y-5">
      {status === "error" && <FormAlert message={formError} />}

      <TextField
        name="website"
        label="Website URL"
        inputMode="url"
        autoComplete="url"
        placeholder="yourbusiness.com"
        maxLength={LIMITS.url}
        error={errors.website}
        onInput={revalidate}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="businessName" label="Business name" autoComplete="organization" maxLength={LIMITS.business} error={errors.businessName} onInput={revalidate} />
        <SelectField name="businessType" label="Business type" options={BUSINESS_TYPE_LABELS} error={errors.businessType} onInput={revalidate} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="firstName" label="First name" autoComplete="given-name" maxLength={LIMITS.name} error={errors.firstName} onInput={revalidate} />
        <TextField name="email" label="Business email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} error={errors.email} onInput={revalidate} />
      </div>
      <TextField
        name="phone"
        label="Phone"
        optional
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        maxLength={LIMITS.phone}
        error={errors.phone}
        onInput={revalidate}
      />

      <Honeypot />
      <SubmitButton submitting={status === "submitting"}>Request My Website Check</SubmitButton>
      <PrivacyNote />
    </form>
  );
}
