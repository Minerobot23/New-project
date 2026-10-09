"use client";

import { useActionState, useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { darkButton, darkInput } from "@/components/billing/styles";
import { ONBOARDING_SECTIONS, type OnboardingField } from "@/content/onboarding";
import type { SaveResult } from "@/lib/portal/onboarding";
import { saveOnboardingAction } from "../actions";

const AUTOSAVE_MS = 1500;

function Field({ field, defaultValue, error }: { field: OnboardingField; defaultValue?: string; error?: string }) {
  const id = `ob-${field.name}`;
  const describedBy = [field.hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name: field.name,
    defaultValue,
    maxLength: field.max,
    autoComplete: field.autoComplete ?? "off",
    "aria-invalid": error ? true : undefined,
    "aria-required": field.required || undefined,
    "aria-describedby": describedBy,
  };
  return (
    <div className={field.type === "textarea" ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className="text-sm font-medium text-white">
        {field.label}
        {field.required ? <span className="text-accent-on-night"> *</span> : <span className="font-normal text-white/45"> (optional)</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea {...common} rows={4} className={darkInput(Boolean(error), "py-2.5")} />
      ) : (
        <input {...common} type={field.type} inputMode={field.type === "tel" ? "tel" : field.type === "email" ? "email" : field.type === "url" ? "url" : undefined} className={darkInput(Boolean(error), "h-11")} />
      )}
      {field.hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-white/50">
          {field.hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function OnboardingForm({
  projectId,
  defaults,
  submitted,
  lastSaved,
}: {
  projectId: string;
  defaults: Record<string, string>;
  submitted: boolean;
  lastSaved: string | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [state, action, pending] = useActionState<SaveResult | null, FormData>(saveOnboardingAction, null);
  const [autosaving, startAutosave] = useTransition();
  const [dirty, setDirty] = useState(false);

  const savedAt = state?.ok ? state.savedAt : lastSaved;
  const isSubmitted = state?.ok ? state.submitted : submitted;
  const errors = state && !state.ok ? (state.fieldErrors ?? {}) : {};

  // Autosave a draft shortly after the customer stops typing.
  const scheduleSave = () => {
    setDirty(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!formRef.current) return;
      const data = new FormData(formRef.current);
      data.set("intent", "save");
      startAutosave(() => {
        action(data);
        setDirty(false);
      });
    }, AUTOSAVE_MS);
  };

  // Warn before leaving with unsaved typing.
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const busy = pending || autosaving;

  // Submitting through a handler (not <form action>) keeps what the customer typed on screen;
  // React resets uncontrolled fields after a form action, which would show stale defaults.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (timer.current) clearTimeout(timer.current);
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const data = new FormData(event.currentTarget);
    data.set("intent", submitter?.value === "submit" ? "submit" : "save");
    startAutosave(() => {
      action(data);
      setDirty(false);
    });
  };

  return (
    <form ref={formRef} onSubmit={onSubmit} onInput={scheduleSave} noValidate className="space-y-8">
      <input type="hidden" name="projectId" value={projectId} />
      {ONBOARDING_SECTIONS.map((section, index) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-24 border border-night-line bg-night-soft">
          <header className="border-b border-night-line px-5 py-4">
            <h2 id={`${section.id}-title`} className="text-[15px] font-semibold">
              {index + 1}. {section.title}
            </h2>
            {section.intro && <p className="mt-1 text-sm text-white/55">{section.intro}</p>}
          </header>
          <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
            {section.fields.map((field) => (
              <Field key={field.name} field={field} defaultValue={defaults[field.name]} error={errors[field.name]} />
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-night-line bg-night/95 px-4 py-4 backdrop-blur sm:mx-0 sm:border sm:px-5">
        <p aria-live="polite" className="flex items-center gap-2 text-sm text-white/60">
          {busy ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" /> Saving…
            </>
          ) : state && !state.ok ? (
            <span className="text-red-300">{state.error}</span>
          ) : savedAt ? (
            <>
              <Check aria-hidden="true" className="size-4 text-emerald-300" /> Saved {new Date(savedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
            </>
          ) : (
            "Not saved yet"
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="submit" name="intent" value="save" disabled={busy} className={darkButton.secondary}>
            Save progress
          </button>
          <button type="submit" name="intent" value="submit" disabled={busy} className={darkButton.primary}>
            {isSubmitted ? "Update submission" : "Submit questionnaire"}
          </button>
        </div>
      </div>
    </form>
  );
}
