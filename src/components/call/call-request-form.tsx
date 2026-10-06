"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import {
  HONEYPOT_FIELD,
  LIMITS,
  PREFERRED_TIMES,
  PREFERRED_TIME_LABELS,
  STARTED_AT_FIELD,
  callRequestSchema,
  firstFieldErrors,
  type CallRequestField,
  type CallRequestInput,
  type CallRequestResponse,
} from "@/lib/call-request/schema";
import { buttonClasses } from "@/components/ui/button-link";
import { site } from "@/lib/site";

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<CallRequestField, string>>;

const FIELD_ORDER: CallRequestField[] = ["firstName", "lastName", "company", "email", "phone", "preferredTime", "message"];

function readForm(form: HTMLFormElement): CallRequestInput {
  const data = new FormData(form);
  const get = (key: string) => (data.get(key) as string | null) ?? "";
  return {
    firstName: get("firstName"),
    lastName: get("lastName"),
    company: get("company"),
    email: get("email"),
    phone: get("phone"),
    preferredTime: get("preferredTime") as CallRequestInput["preferredTime"],
    message: get("message"),
  };
}

export function CallRequestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status !== "success" || !successRef.current) return;
    successRef.current.focus({ preventScroll: true });
    successRef.current.scrollIntoView({ block: "center" });
  }, [status]);

  const focusFirstError = (fieldErrors: FieldErrors) => {
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);
    if (!first || !formRef.current) return;
    const target = formRef.current.querySelector<HTMLElement>(`[name="${first}"]`);
    target?.focus();
  };

  // After the first submit attempt, re-validate as the visitor types (not on blur, which would shift layout mid-click).
  const revalidate = () => {
    if (!attempted || !formRef.current) return;
    const result = callRequestSchema.safeParse(readForm(formRef.current));
    setErrors(result.success ? {} : firstFieldErrors(result.error));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const values = readForm(form);
    setAttempted(true);
    setFormError(null);

    const result = callRequestSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors = firstFieldErrors(result.error);
      setErrors(fieldErrors);
      focusFirstError(fieldErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/call-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          [HONEYPOT_FIELD]: (new FormData(form).get(HONEYPOT_FIELD) as string | null) ?? "",
          [STARTED_AT_FIELD]: startedAt.current,
        }),
      });
      const payload = (await response.json().catch(() => null)) as CallRequestResponse | null;

      if (response.ok && payload?.ok) {
        setStatus("success");
        return;
      }

      if (payload && !payload.ok && payload.fieldErrors) {
        setErrors(payload.fieldErrors);
        focusFirstError(payload.fieldErrors);
      }
      setFormError(payload && !payload.ok ? payload.error : null);
      setStatus("error");
    } catch {
      setFormError(null);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start" role="status">
        <span className="flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent">
          <CheckCircle2 aria-hidden="true" className="size-6" />
        </span>
        <h2 ref={successRef} tabIndex={-1} className="mt-5 text-2xl font-semibold tracking-tight text-ink focus:outline-none">
          Request received.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Thanks for reaching out. Someone from Fluxline will contact you shortly to coordinate a time.
        </p>
        <Link href="/" className={buttonClasses("secondary", "md", "mt-8")}>
          Back to homepage
        </Link>
      </div>
    );
  }

  const submitting = status === "submitting";
  const fallbackError = (
    <>
      Something went wrong sending your request. Please try again, or email{" "}
      <a href={`mailto:${site.contact.email}`} className="font-medium underline underline-offset-2">
        {site.contact.email}
      </a>
      .
    </>
  );

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-describedby="form-note" className="space-y-5">
      {status === "error" && (
        <div role="alert" className="flex gap-3 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{formError ?? fallbackError}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="firstName" label="First name" autoComplete="given-name" maxLength={LIMITS.name} error={errors.firstName} onInput={revalidate} />
        <TextField name="lastName" label="Last name" autoComplete="family-name" maxLength={LIMITS.name} error={errors.lastName} onInput={revalidate} />
      </div>
      <TextField name="company" label="Company" autoComplete="organization" maxLength={LIMITS.company} error={errors.company} onInput={revalidate} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          name="email"
          label="Business email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={LIMITS.email}
          error={errors.email}
          onInput={revalidate}
        />
        <TextField
          name="phone"
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          maxLength={LIMITS.phone}
          error={errors.phone}
          onInput={revalidate}
        />
      </div>

      <fieldset aria-describedby={errors.preferredTime ? "preferredTime-error" : undefined}>
        <legend className="text-sm font-medium text-ink">
          Preferred time to call <span className="font-normal text-muted">(optional)</span>
        </legend>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {PREFERRED_TIMES.map((time) => (
            <label key={time} className="relative">
              <input type="radio" name="preferredTime" value={time} className="peer sr-only" onChange={revalidate} />
              <span className="flex h-11 cursor-pointer items-center justify-center rounded-md border border-line-strong bg-surface text-sm font-medium text-ink-soft transition-colors hover:border-ink/30 peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-accent-strong peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                {PREFERRED_TIME_LABELS[time]}
              </span>
            </label>
          ))}
        </div>
        {errors.preferredTime && <FieldError id="preferredTime-error">{errors.preferredTime}</FieldError>}
      </fieldset>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="message" className="text-sm font-medium text-ink">
            Anything you&apos;d like us to know? <span className="font-normal text-muted">(optional)</span>
          </label>
        </div>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={LIMITS.message}
          onChange={(event) => {
            setMessageLength(event.target.value.length);
            revalidate();
          }}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={`message-count${errors.message ? " message-error" : ""}`}
          className={inputClasses(Boolean(errors.message), "min-h-28 resize-y py-2.5")}
        />
        <p id="message-count" className="mt-1.5 text-right text-xs text-muted">
          {messageLength}/{LIMITS.message}
        </p>
        {errors.message && <FieldError id="message-error">{errors.message}</FieldError>}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill every field. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Website</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <button type="submit" disabled={submitting} className={buttonClasses("primary", "lg", "w-full disabled:cursor-wait disabled:opacity-80")}>
        {submitting ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Request a 15-Minute Call"
        )}
      </button>
      <p id="form-note" className="text-center text-xs leading-relaxed text-muted">
        All fields are required unless marked optional. We&apos;ll only use your details to follow up on this
        request. See our{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}

function inputClasses(invalid: boolean, extra = "") {
  return `mt-1.5 block w-full rounded-md border bg-surface px-3.5 text-[16px] text-ink shadow-[inset_0_1px_1px_rgba(15,26,36,0.03)] transition-colors placeholder:text-muted/70 focus:outline-2 focus:outline-offset-0 sm:text-[15px] ${
    invalid ? "border-danger focus:outline-danger" : "border-line-strong hover:border-ink/30 focus:border-accent focus:outline-accent"
  } ${extra}`;
}

type TextFieldProps = {
  name: CallRequestField;
  label: string;
  error?: string;
  type?: string;
  inputMode?: "text" | "email" | "tel";
  autoComplete?: string;
  maxLength: number;
  onInput: () => void;
};

function TextField({ name, label, error, type = "text", inputMode, autoComplete, maxLength, onInput }: TextFieldProps) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        required
        aria-required="true"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onInput={onInput}
        className={inputClasses(Boolean(error), "h-11")}
      />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
      <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}
