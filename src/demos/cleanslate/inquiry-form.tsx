"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CircleCheck, CloudLightning, Droplets, Flame, Info, MapPin, Microscope, Phone, ShieldAlert } from "lucide-react";
import { business } from "./content";
import { zipArea } from "./guides";

/*
 * EMERGENCY REQUEST — DEMONSTRATION ONLY. It validates in the browser and then discards what was typed:
 * no request is made and nothing is stored. A launched version needs Clean Slate's approval, a backend
 * they control, and the consent line below wired to a real policy before it collects anything.
 *
 * Step 1 asks what happened and how urgent it is (two taps). Step 2 asks where and who.
 * Choosing "Happening now" surfaces the phone number immediately, because a call is faster than a callback.
 */

export const PREFILL_EVENT = "cs:prefill-damage";

const DAMAGE = [
  { value: "Water or flooding", label: "Water / flood", icon: Droplets },
  { value: "Fire or smoke", label: "Fire / smoke", icon: Flame },
  { value: "Mold", label: "Mold", icon: Microscope },
  { value: "Board-up needed", label: "Storm / board-up", icon: CloudLightning },
] as const;

const URGENCY = [
  { value: "now", label: "Happening now", hint: "Active water, fire just out, or open to weather" },
  { value: "soon", label: "Within 48 hours", hint: "Damage is contained for now" },
  { value: "planning", label: "Planning", hint: "Inspection, estimate, or insurance" },
] as const;

type Field = "damage" | "urgency" | "zip" | "name" | "phone" | "notes" | "consent";
type Errors = Partial<Record<Field, string>>;

const inputClass =
  "mt-2 block h-12 w-full border-0 bg-white px-4 text-[16px] text-cs-ink shadow-[inset_0_0_0_1px_rgba(27,28,28,0.2)] outline-none transition-shadow placeholder:text-cs-slate/60 focus:shadow-[inset_0_0_0_2px_var(--color-cs-blue)] aria-[invalid=true]:shadow-[inset_0_0_0_2px_var(--color-cs-alert)]";

function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-[#b42318]">
      {children}
    </p>
  );
}

function CallNow({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="cs-swap mt-5 flex flex-col gap-3 bg-cs-night p-4 text-white sm:flex-row sm:items-center sm:justify-between">
      <p className="flex items-start gap-2.5 text-[15px] leading-snug">
        <ShieldAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-cs-alert" />
        {children}
      </p>
      <a href={business.phoneHref} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 bg-cs-blue px-5 text-sm font-semibold hover:bg-cs-blue-deep">
        <Phone aria-hidden="true" className="size-4" />
        Call {business.phoneDisplay}
      </a>
    </div>
  );
}

export function InquiryForm({ compact = false, defaultDamage = "" }: { compact?: boolean; defaultDamage?: string }) {
  const uid = useId();
  const [step, setStep] = useState<1 | 2>(1);
  const [damage, setDamage] = useState(defaultDamage);
  const [urgency, setUrgency] = useState("");
  const [zip, setZip] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<{ urgency: string; damage: string } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const focusZipOnStep2 = useRef(false);
  const ids = (field: Field) => `${uid}-${field}`;

  // The triage panel (and links ending in ?damage=…) can preselect the damage type.
  useEffect(() => {
    if (compact) return;
    const fromUrl = new URLSearchParams(window.location.search).get("damage");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of the URL after hydration
    if (fromUrl && DAMAGE.some((item) => item.value === fromUrl)) setDamage(fromUrl);
    const onPrefill = (event: Event) => {
      const value = (event as CustomEvent<string>).detail;
      if (DAMAGE.some((item) => item.value === value)) {
        setDamage(value);
        setStep(1);
        setSent(null);
      }
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, [compact]);

  // Move focus to the ZIP field once step 2 has rendered (not on every render of step 2).
  useEffect(() => {
    if (step !== 2 || !focusZipOnStep2.current) return;
    focusZipOnStep2.current = false;
    rootRef.current?.querySelector<HTMLElement>('[data-field="zip"]')?.focus();
  }, [step]);

  const focusFirst = (found: Errors) => {
    const first = Object.keys(found)[0] as Field | undefined;
    if (!first) return;
    requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus());
  };

  const next = () => {
    const found: Errors = {};
    if (!damage) found.damage = "Choose what happened.";
    if (!urgency) found.urgency = "Choose how urgent it is.";
    setErrors(found);
    if (Object.keys(found).length) return focusFirst(found);
    focusZipOnStep2.current = true;
    setStep(2);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step === 1) return next();
    const data = new FormData(event.currentTarget);
    const text = (key: string) => String(data.get(key) ?? "").trim();
    const found: Errors = {};
    if (!/^\d{5}$/.test(zip)) found.zip = "Enter the property's 5-digit ZIP code.";
    if (text("name").length < 2) found.name = "Enter your name.";
    if (text("phone").replace(/\D/g, "").length !== 10) found.phone = "Enter a 10-digit phone number.";
    if (!data.get("consent")) found.consent = "Confirm we can contact you about this request.";
    setErrors(found);
    if (Object.keys(found).length) return focusFirst(found);
    // Nothing leaves the browser: clear everything and show what the confirmation would look like.
    setSent({ urgency, damage });
    formRef.current?.reset();
    setZip("");
    setUrgency("");
    setDamage(defaultDamage);
    setStep(1);
    requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>("[data-status]")?.focus());
  };

  const area = zipArea(zip);
  const describedBy = (field: Field) => (errors[field] ? `${ids(field)}-error` : undefined);

  if (sent) {
    return (
      <div ref={rootRef}>
        <div data-status tabIndex={-1} role="status" className="cs-swap border border-cs-ink/10 bg-white p-6 sm:p-10">
          <CircleCheck aria-hidden="true" className="size-10 text-cs-blue" strokeWidth={1.5} />
          <h3 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.02em]" style={{ fontStretch: "104%" }}>
            This is what the confirmation would look like.
          </h3>
          <p className="mt-4 max-w-[54ch] leading-relaxed text-cs-slate">
            In a launched site, the office would receive this {sent.damage.toLowerCase()} request with the ZIP code and urgency, ready to triage
            before calling back.
          </p>
          {sent.urgency === "now" && <CallNow>Because this is happening now, the customer is told to call right away instead of waiting.</CallNow>}
          <p className="mt-6 flex items-start gap-2 bg-cs-mist p-4 text-sm text-cs-ink">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-cs-blue" />
            Demonstration only: nothing you entered was sent or saved.
          </p>
          <button type="button" onClick={() => setSent(null)} className="mt-6 h-11 bg-cs-ink px-5 text-sm font-semibold text-white hover:bg-cs-blue">
            Start another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef}>
      <form
        ref={formRef}
        noValidate
        onSubmit={submit}
        aria-label={compact ? "Emergency request" : undefined}
        className={`border border-cs-ink/10 bg-white ${compact ? "p-5 sm:p-6" : "p-5 sm:p-8"}`}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-cs-blue">
            Step {step} of 2 · {step === 1 ? "What happened" : "Where and who"}
          </p>
          <div aria-hidden="true" className="flex w-20 gap-1">
            <span className="h-1 flex-1 bg-cs-blue" />
            <span className={`h-1 flex-1 transition-colors duration-500 ${step === 2 ? "bg-cs-blue" : "bg-cs-ink/10"}`} />
          </div>
        </div>

        {step === 1 ? (
          <div key="step1" className="cs-swap">
            <fieldset className="mt-5" aria-describedby={describedBy("damage")}>
              <legend className="text-sm font-semibold text-cs-ink">What happened?</legend>
              <div className={`mt-2 grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
                {DAMAGE.map((item, index) => (
                  <label
                    key={item.value}
                    className="flex cursor-pointer flex-col items-start gap-3 p-4 shadow-[inset_0_0_0_1px_rgba(27,28,28,0.2)] transition-shadow has-[:checked]:bg-cs-blue/[0.06] has-[:checked]:shadow-[inset_0_0_0_2px_var(--color-cs-blue)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cs-blue"
                  >
                    <input
                      type="radio"
                      name="damage"
                      value={item.value}
                      checked={damage === item.value}
                      onChange={() => setDamage(item.value)}
                      data-field={index === 0 ? "damage" : undefined}
                      className="sr-only"
                    />
                    <item.icon aria-hidden="true" className="size-6 text-cs-blue" strokeWidth={1.75} />
                    <span className="text-[15px] font-semibold text-cs-ink">{item.label}</span>
                  </label>
                ))}
              </div>
              <ErrorText id={`${ids("damage")}-error`}>{errors.damage}</ErrorText>
            </fieldset>

            <fieldset className="mt-6" aria-describedby={describedBy("urgency")}>
              <legend className="text-sm font-semibold text-cs-ink">How urgent is it?</legend>
              <div className={`mt-2 grid gap-2 ${compact ? "" : "sm:grid-cols-3"}`}>
                {URGENCY.map((option, index) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 p-4 shadow-[inset_0_0_0_1px_rgba(27,28,28,0.2)] transition-shadow has-[:checked]:bg-cs-blue/[0.06] has-[:checked]:shadow-[inset_0_0_0_2px_var(--color-cs-blue)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cs-blue"
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={option.value}
                      checked={urgency === option.value}
                      onChange={() => setUrgency(option.value)}
                      data-field={index === 0 ? "urgency" : undefined}
                      className="size-4 shrink-0 accent-[var(--color-cs-blue)]"
                    />
                    <span>
                      <span className="block text-[15px] font-semibold text-cs-ink">{option.label}</span>
                      <span className="block text-[13px] leading-snug text-cs-slate">{option.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
              <ErrorText id={`${ids("urgency")}-error`}>{errors.urgency}</ErrorText>
            </fieldset>

            {urgency === "now" && <CallNow>If water is still coming in or the property is open to weather, calling is the fastest way to get a crew moving.</CallNow>}

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" className="group inline-flex h-14 items-center justify-center gap-3 bg-cs-blue px-8 text-[15px] font-semibold text-white transition-colors hover:bg-cs-blue-deep active:translate-y-px">
                Continue
                <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <p className="text-sm text-cs-slate">Two steps. About 30 seconds.</p>
            </div>
          </div>
        ) : (
          <div key="step2" className="cs-swap">
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={ids("zip")} className="text-sm font-semibold text-cs-ink">
                  Property ZIP code
                </label>
                <input
                  id={ids("zip")}
                  name="zip"
                  data-field="zip"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  value={zip}
                  onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
                  className={`${inputClass} max-w-[12rem]`}
                  aria-invalid={!!errors.zip}
                  aria-describedby={[describedBy("zip"), `${ids("zip")}-hint`].filter(Boolean).join(" ")}
                />
                <p id={`${ids("zip")}-hint`} aria-live="polite" className="mt-1.5 flex min-h-5 items-center gap-1.5 text-sm text-cs-slate">
                  {zip.length === 5 && (
                    <>
                      <MapPin aria-hidden="true" className="size-3.5 text-cs-blue" />
                      {area ? `Looks like ${area}, one of the areas Clean Slate serves.` : "Outside the areas listed on this site. Call to confirm coverage."}
                    </>
                  )}
                </p>
                <ErrorText id={`${ids("zip")}-error`}>{errors.zip}</ErrorText>
              </div>
              <div>
                <label htmlFor={ids("name")} className="text-sm font-semibold text-cs-ink">
                  Name
                </label>
                <input id={ids("name")} name="name" data-field="name" autoComplete="name" className={inputClass} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} />
                <ErrorText id={`${ids("name")}-error`}>{errors.name}</ErrorText>
              </div>
              <div>
                <label htmlFor={ids("phone")} className="text-sm font-semibold text-cs-ink">
                  Phone
                </label>
                <input
                  id={ids("phone")}
                  name="phone"
                  data-field="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="(631) 555-0123"
                  className={inputClass}
                  aria-invalid={!!errors.phone}
                  aria-describedby={describedBy("phone")}
                />
                <ErrorText id={`${ids("phone")}-error`}>{errors.phone}</ErrorText>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={ids("notes")} className="text-sm font-semibold text-cs-ink">
                  Anything we should know? <span className="font-normal text-cs-slate">(optional)</span>
                </label>
                <textarea
                  id={ids("notes")}
                  name="notes"
                  rows={compact ? 2 : 3}
                  placeholder="For example: pipe burst in the basement this morning."
                  className={`${inputClass} h-auto py-3`}
                />
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-cs-slate">
              <input
                type="checkbox"
                name="consent"
                data-field="consent"
                className="mt-1 size-4 shrink-0 accent-[var(--color-cs-blue)]"
                aria-invalid={!!errors.consent}
                aria-describedby={describedBy("consent")}
              />
              <span>Clean Slate Services may call or text me about this request.</span>
            </label>
            <ErrorText id={`${ids("consent")}-error`}>{errors.consent}</ErrorText>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button type="button" onClick={() => setStep(1)} className="inline-flex h-12 items-center justify-center gap-2 px-2 text-sm font-semibold text-cs-slate hover:text-cs-ink">
                <ArrowLeft aria-hidden="true" className="size-4" />
                Back
              </button>
              <button type="submit" className="h-14 bg-cs-blue px-8 text-[15px] font-semibold text-white transition-colors hover:bg-cs-blue-deep active:translate-y-px">
                Send Emergency Request
              </button>
            </div>
          </div>
        )}

        <p className="mt-6 flex items-start gap-2 border-t border-cs-ink/10 pt-4 text-[12.5px] leading-relaxed text-cs-slate">
          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-cs-blue" />
          <span>
            Demonstration form: nothing is sent to Clean Slate Services or stored. For a real emergency, call{" "}
            <a href={business.phoneHref} className="font-semibold text-cs-ink underline underline-offset-2">
              {business.phoneDisplay}
            </a>
            .
          </span>
        </p>
      </form>
    </div>
  );
}
