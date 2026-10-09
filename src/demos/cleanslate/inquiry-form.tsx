"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { ChevronDown, CircleCheck, Info } from "lucide-react";
import { business } from "./content";

/*
 * DEMONSTRATION FORM. It validates in the browser and then discards what was typed:
 * no request is made and nothing is stored. A launched version needs Clean Slate's approval,
 * a backend they control, and a consent line before it collects anything.
 */

type Field = "name" | "phone" | "zip" | "damage" | "urgency" | "description";
type Errors = Partial<Record<Field, string>>;

const DAMAGE = ["Water or flooding", "Fire or smoke", "Mold", "Storm damage", "Board-up needed", "Something else"];
const URGENCY = [
  { value: "now", label: "Emergency", hint: "Happening now" },
  { value: "soon", label: "Within 48 hours", hint: "Damage is contained" },
  { value: "planning", label: "Planning", hint: "Estimate or inspection" },
];

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const text = (key: Field) => String(data.get(key) ?? "").trim();
  if (text("name").length < 2) errors.name = "Enter your name.";
  if (text("phone").replace(/\D/g, "").length !== 10) errors.phone = "Enter a 10-digit phone number.";
  if (!/^\d{5}$/.test(text("zip"))) errors.zip = "Enter a 5-digit ZIP code.";
  if (!text("damage")) errors.damage = "Choose the type of damage.";
  if (!text("urgency")) errors.urgency = "Choose how urgent this is.";
  if (text("description").length < 10) errors.description = "Add a sentence about what happened.";
  return errors;
}

const inputClass =
  "mt-2 block h-12 w-full border-0 bg-white px-4 text-[16px] text-cs-ink shadow-[inset_0_0_0_1px_rgba(27,28,28,0.2)] outline-none transition-shadow placeholder:text-cs-slate/60 focus:shadow-[inset_0_0_0_2px_var(--color-cs-blue)] aria-[invalid=true]:shadow-[inset_0_0_0_2px_var(--color-cs-alert)]";

function FieldShell({ id, label, error, children, className = "" }: { id: Field; label: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={`cs-${id}`} className="text-sm font-semibold text-cs-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`cs-${id}-error`} className="mt-1.5 text-sm font-medium text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  );
}

export function InquiryForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ urgency: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const found = validate(data);
    setErrors(found);
    const first = Object.keys(found)[0] as Field | undefined;
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // Nothing leaves the browser: clear the fields and show what the confirmation would look like.
    setSent({ urgency: String(data.get("urgency")) });
    event.currentTarget.reset();
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const describedBy = (field: Field) => (errors[field] ? `cs-${field}-error` : undefined);

  if (sent) {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="cs-swap border border-cs-ink/10 bg-white p-6 sm:p-10">
        <CircleCheck aria-hidden="true" className="size-10 text-cs-blue" strokeWidth={1.5} />
        <h3 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.02em]" style={{ fontStretch: "104%" }}>
          This is what the confirmation would look like.
        </h3>
        <p className="mt-4 max-w-[52ch] leading-relaxed text-cs-slate">
          In a launched site, the office would receive the request with the damage type, ZIP code, and urgency, and the customer would see
          this screen.{" "}
          {sent.urgency === "now" && (
            <>
              Because it was marked as an emergency, the page would tell them to call{" "}
              <a href={business.phoneHref} className="font-semibold text-cs-blue underline underline-offset-4">
                {business.phoneDisplay}
              </a>{" "}
              now rather than wait for a callback.
            </>
          )}
        </p>
        <p className="mt-6 flex items-start gap-2 bg-cs-mist p-4 text-sm text-cs-ink">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cs-blue" />
          Demonstration only: nothing you entered was sent or saved.
        </p>
        <button type="button" onClick={() => setSent(null)} className="mt-6 h-11 bg-cs-ink px-5 text-sm font-semibold text-white hover:bg-cs-blue">
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby="cs-form-note" className="border border-cs-ink/10 bg-white p-5 sm:p-8">
      <p id="cs-form-note" className="mb-6 flex items-start gap-2 bg-cs-mist p-3 text-[13px] leading-relaxed text-cs-ink">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cs-blue" />
        Demonstration form. Nothing is sent to Clean Slate Services or stored. For a real emergency, call {business.phoneDisplay}.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <FieldShell id="name" label="Name" error={errors.name}>
          <input id="cs-name" name="name" autoComplete="name" className={inputClass} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
        </FieldShell>
        <FieldShell id="phone" label="Phone" error={errors.phone}>
          <input
            id="cs-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="(631) 555-0123"
            className={inputClass}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
          />
        </FieldShell>
        <FieldShell id="zip" label="Property ZIP code" error={errors.zip}>
          <input
            id="cs-zip"
            name="zip"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            className={inputClass}
            aria-invalid={!!errors.zip}
            aria-describedby={describedBy("zip")}
          />
        </FieldShell>
        <FieldShell id="damage" label="Type of damage" error={errors.damage}>
          <div className="relative">
            <select
              id="cs-damage"
              name="damage"
              defaultValue=""
              className={`${inputClass} appearance-none pr-10`}
              aria-invalid={!!errors.damage}
              aria-describedby={describedBy("damage")}
            >
              <option value="" disabled>
                Choose one
              </option>
              {DAMAGE.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 mt-1 size-[18px] -translate-y-1/2 text-cs-ink" />
          </div>
        </FieldShell>
      </div>

      <fieldset className="mt-6" aria-describedby={describedBy("urgency")} aria-invalid={!!errors.urgency}>
        <legend className="text-sm font-semibold text-cs-ink">How urgent is it?</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {URGENCY.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 p-4 shadow-[inset_0_0_0_1px_rgba(27,28,28,0.2)] transition-shadow has-[:checked]:bg-cs-blue/[0.05] has-[:checked]:shadow-[inset_0_0_0_2px_var(--color-cs-blue)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cs-blue"
            >
              <input type="radio" name="urgency" value={option.value} className="size-4 accent-[var(--color-cs-blue)]" />
              <span>
                <span className="block text-[15px] font-semibold text-cs-ink">{option.label}</span>
                <span className="block text-[13px] text-cs-slate">{option.hint}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.urgency && (
          <p id="cs-urgency-error" className="mt-1.5 text-sm font-medium text-[#b42318]">
            {errors.urgency}
          </p>
        )}
      </fieldset>

      <FieldShell id="description" label="What happened?" error={errors.description} className="mt-6">
        <textarea
          id="cs-description"
          name="description"
          rows={4}
          placeholder="For example: pipe burst in the finished basement this morning, about two inches of water."
          className={`${inputClass} h-auto py-3`}
          aria-invalid={!!errors.description}
          aria-describedby={describedBy("description")}
        />
      </FieldShell>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="h-14 bg-cs-blue px-8 text-[15px] font-semibold text-white transition-colors hover:bg-cs-blue-deep active:translate-y-px">
          Request an Assessment
        </button>
        <p className="text-sm text-cs-slate">
          Faster in an emergency:{" "}
          <a href={business.phoneHref} className="font-semibold text-cs-ink underline decoration-cs-blue/40 underline-offset-4">
            {business.phoneDisplay}
          </a>
        </p>
      </div>
    </form>
  );
}
