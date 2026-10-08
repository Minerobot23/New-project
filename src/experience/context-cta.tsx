"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * The scene's call to action, styled as a plate of light rather than a web button:
 * a solid bone block with a slow arrow. Variants follow the scene (on photo vs on the stage colour).
 */
export function ContextCTA({
  children,
  tone = "solid",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: "solid" | "outline";
}) {
  return (
    <button
      type="button"
      {...props}
      className={`label group inline-flex min-h-12 items-center justify-center gap-4 px-6 transition-colors duration-300 disabled:opacity-50 ${
        tone === "solid"
          ? "bg-bone text-stage hover:bg-white"
          : "text-bone shadow-[inset_0_0_0_1px_rgba(239,234,226,0.55)] hover:bg-bone hover:text-stage"
      } ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="inline-block transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-1"
      >
        →
      </span>
    </button>
  );
}

/**
 * Explains a simulated action inside a concept ("On a real site, this calls the restaurant.").
 * Concepts never pretend to dial, book, or send anything.
 */
export function ConceptNote({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  return (
    <div aria-live="polite" className="pointer-events-none absolute inset-x-0 top-20 z-40 flex justify-center px-5">
      {message && (
        <div className="pointer-events-auto flex max-w-md items-start gap-4 bg-stage/90 px-5 py-4 text-sm leading-relaxed text-bone backdrop-blur-md">
          <p>
            <span className="label mr-2 text-bone/60">Concept</span>
            {message}
          </p>
          <button type="button" onClick={onDismiss} aria-label="Dismiss" className="-mr-1 text-bone/60 hover:text-bone">
            ×
          </button>
        </div>
      )}
    </div>
  );
}
