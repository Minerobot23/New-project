"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { darkButton } from "./styles";

/** A submit button that shows progress and blocks double submission while its form's action runs. */
export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  className = "",
  disabled,
  confirm,
  name,
  value,
  pending: pendingProp,
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: keyof typeof darkButton;
  className?: string;
  disabled?: boolean;
  /** Asks before submitting, for actions that move money or end a service. */
  confirm?: string;
  name?: string;
  value?: string;
  /** For forms submitted through useKeepValuesSubmit, where useFormStatus can't see the action. */
  pending?: boolean;
}) {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending || disabled}
      aria-disabled={pending || disabled}
      onClick={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
      className={`${darkButton[variant]} ${className}`}
    >
      {pending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
      {pending ? (pendingLabel ?? "Working…") : children}
    </button>
  );
}
