import type { ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { buttonClasses } from "@/components/ui/button-link";
import { HONEYPOT_FIELD } from "@/lib/leads/schemas";
import { site } from "@/lib/site";

export function inputClasses(invalid: boolean, extra = "") {
  return `mt-1.5 block w-full  border bg-surface px-3.5 text-[16px] text-ink shadow-[inset_0_1px_1px_rgba(15,26,36,0.03)] transition-colors placeholder:text-muted/70 focus:outline-2 focus:outline-offset-0 sm:text-[15px] ${
    invalid ? "border-danger focus:outline-danger" : "border-line-strong hover:border-ink/30 focus:border-accent focus:outline-accent"
  } ${extra}`;
}

function Label({ htmlFor, children, optional }: { htmlFor?: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
      {children}
      {optional && <span className="font-normal text-muted"> (optional)</span>}
    </label>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm text-danger">
      <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}

type TextFieldProps = {
  name: string;
  label: string;
  error?: string;
  type?: string;
  inputMode?: "text" | "email" | "tel" | "url";
  autoComplete?: string;
  maxLength: number;
  optional?: boolean;
  placeholder?: string;
  hint?: string;
  onInput: () => void;
};

export function TextField({ name, label, error, type = "text", inputMode, autoComplete, maxLength, optional, placeholder, hint, onInput }: TextFieldProps) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <Label htmlFor={name} optional={optional}>
        {label}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        required={!optional}
        aria-required={!optional || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onInput={onInput}
        className={inputClasses(Boolean(error), "h-11")}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

export function SelectField({
  name,
  label,
  options,
  error,
  optional,
  defaultValue = "",
  hint,
  onInput,
}: {
  name: string;
  label: string;
  options: Record<string, string>;
  error?: string;
  optional?: boolean;
  /** Pre-selected option; the visitor can change it. */
  defaultValue?: string;
  hint?: string;
  onInput: () => void;
}) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  return (
    <div>
      <Label htmlFor={name} optional={optional}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={name}
          name={name}
          required={!optional}
          defaultValue={defaultValue}
          aria-invalid={error ? true : undefined}
          aria-describedby={[hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined}
          onChange={onInput}
          className={inputClasses(Boolean(error), "h-11 appearance-none pr-10")}
        >
          <option value="" disabled={!optional}>
            {optional ? "Not sure / prefer not to say" : "Select one"}
          </option>
          {Object.entries(options).map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 mt-[3px] size-4 -translate-y-1/2 text-muted" />
      </div>
      {hint && (
        <p id={hintId} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

export function ChoiceGroup({
  name,
  legend,
  options,
  error,
  optional,
  columns = 3,
  onInput,
}: {
  name: string;
  legend: string;
  options: Record<string, string>;
  error?: string;
  optional?: boolean;
  columns?: 2 | 3;
  onInput: () => void;
}) {
  const errorId = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="text-sm font-medium text-ink">
        {legend}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </legend>
      <div className={`mt-2 grid gap-2 ${columns === 3 ? "grid-cols-1 min-[420px]:grid-cols-3" : "grid-cols-2"}`}>
        {Object.entries(options).map(([value, text]) => (
          <label key={value} className="relative">
            <input type="radio" name={name} value={value} className="peer sr-only" onChange={onInput} />
            <span
              className={`flex min-h-11 cursor-pointer items-center justify-center border bg-surface px-3 py-2 text-center text-sm font-medium text-ink-soft transition-colors hover:border-ink/30 peer-checked:border-accent peer-checked:bg-accent-soft peer-checked:text-accent-strong peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
                error ? "border-danger" : "border-line-strong"
              }`}
            >
              {text}
            </span>
          </label>
        ))}
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </fieldset>
  );
}

/** Hidden from people and assistive tech; bots tend to fill every field. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={HONEYPOT_FIELD}>Company URL</label>
      <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}

export function FormAlert({ message }: { message: string | null }) {
  return (
    <div role="alert" className="flex gap-3 border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger">
      <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>
        {message ?? (
          <>
            Something went wrong sending your request. Please try again, or email{" "}
            <a href={`mailto:${site.contact.email}`} className="font-medium underline underline-offset-2">
              {site.contact.email}
            </a>
            .
          </>
        )}
      </p>
    </div>
  );
}

export function SubmitButton({ submitting, children }: { submitting: boolean; children: ReactNode }) {
  return (
    <button type="submit" disabled={submitting} className={buttonClasses("primary", "lg", "w-full disabled:cursor-wait disabled:opacity-80")}>
      {submitting ? (
        <>
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          Sending…
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function PrivacyNote() {
  return (
    <p className="text-center text-xs leading-relaxed text-muted">
      We&apos;ll only use your details to respond to this request. See our{" "}
      <Link href="/privacy" className="underline underline-offset-2 hover:text-ink">
        Privacy Policy
      </Link>
      .
    </p>
  );
}

export function SuccessPanel({
  headingRef,
  title,
  body,
  children,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-start" role="status">
      <span className="flex size-11 items-center justify-center rounded-full bg-accent-soft text-accent">
        <CheckCircle2 aria-hidden="true" className="size-6" />
      </span>
      <h2 ref={headingRef} tabIndex={-1} className="mt-5 text-2xl font-semibold tracking-tight text-ink focus:outline-none">
        {title}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{body}</p>
      {children}
    </div>
  );
}
