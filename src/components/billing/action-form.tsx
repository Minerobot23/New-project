"use client";

import { useActionState, type ReactNode } from "react";
import { SubmitButton } from "./submit-button";
import { useKeepValuesSubmit } from "./use-submit";
import type { darkButton } from "./styles";

export type ActionState = { ok?: boolean; error?: string; message?: string } | null;

/** A form bound to a server action, with pending state, an optional confirmation, and its result shown inline. */
export function ActionForm({
  action,
  hidden = {},
  children,
  submitLabel,
  pendingLabel,
  variant = "primary",
  confirm,
  className = "",
  inline = false,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  hidden?: Record<string, string>;
  children?: ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  variant?: keyof typeof darkButton;
  confirm?: string;
  className?: string;
  inline?: boolean;
}) {
  const [state, formAction] = useActionState(action, null);
  const { onSubmit, pending } = useKeepValuesSubmit(formAction);
  return (
    <form onSubmit={onSubmit} className={className}>
      {Object.entries(hidden).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <div className={inline ? "flex flex-wrap items-end gap-3" : "space-y-4"}>
        {children}
        <SubmitButton pending={pending} variant={variant} pendingLabel={pendingLabel} confirm={confirm}>
          {submitLabel}
        </SubmitButton>
      </div>
      {state && (state.error || state.message) && (
        <p role={state.error ? "alert" : "status"} className={`mt-2 text-sm ${state.error ? "text-red-300" : "text-emerald-200"}`}>
          {state.error ?? state.message}
        </p>
      )}
    </form>
  );
}
