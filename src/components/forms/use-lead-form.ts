"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import type { z } from "zod";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { HONEYPOT_FIELD, STARTED_AT_FIELD, firstFieldErrors, type LeadResponse } from "@/lib/leads/schemas";

type Status = "idle" | "submitting" | "success" | "error";

type Options = {
  endpoint: string;
  schema: z.ZodType;
  fieldOrder: string[];
  startedEvent: AnalyticsEvent;
  submittedEvent: AnalyticsEvent;
};

function readForm(form: HTMLFormElement, fields: string[]) {
  const data = new FormData(form);
  return Object.fromEntries(fields.map((field) => [field, (data.get(field) as string | null) ?? ""]));
}

/**
 * Shared behavior for lead forms: client validation (the server re-validates),
 * live re-validation after the first attempt, bot-trap fields, attribution,
 * analytics events, focus management, and submission state.
 */
export function useLeadForm({ endpoint, schema, fieldOrder, startedEvent, submittedEvent }: Options) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const startedAt = useRef(0);
  const startedTracked = useRef(false);
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

  const focusFirstError = useCallback(
    (fieldErrors: Record<string, string>) => {
      const first = fieldOrder.find((field) => fieldErrors[field]);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    },
    [fieldOrder],
  );

  /** Fires the "started" analytics event once, on first interaction. */
  const onFirstInput = useCallback(() => {
    if (startedTracked.current) return;
    startedTracked.current = true;
    track(startedEvent);
  }, [startedEvent]);

  // After the first submit attempt, re-validate as the visitor types (not on blur, which shifts layout mid-click).
  const revalidate = useCallback(() => {
    if (!attempted || !formRef.current) return;
    const result = schema.safeParse(readForm(formRef.current, fieldOrder));
    setErrors(result.success ? {} : firstFieldErrors(result.error));
  }, [attempted, schema, fieldOrder]);

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === "submitting") return;
      const form = event.currentTarget;
      const values = readForm(form, fieldOrder);
      setAttempted(true);
      setFormError(null);

      const result = schema.safeParse(values);
      if (!result.success) {
        const fieldErrors = firstFieldErrors(result.error);
        setErrors(fieldErrors);
        focusFirstError(fieldErrors);
        return;
      }
      setErrors({});
      setStatus("submitting");

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            attribution: getAttribution(),
            [HONEYPOT_FIELD]: (new FormData(form).get(HONEYPOT_FIELD) as string | null) ?? "",
            [STARTED_AT_FIELD]: startedAt.current,
          }),
        });
        const payload = (await response.json().catch(() => null)) as LeadResponse | null;

        if (response.ok && payload?.ok) {
          track(submittedEvent);
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
    },
    [status, fieldOrder, schema, focusFirstError, endpoint, submittedEvent],
  );

  return { status, errors, formError, formRef, successRef, onSubmit, revalidate, onFirstInput };
}
