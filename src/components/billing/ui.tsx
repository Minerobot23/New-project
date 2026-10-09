import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { statusLabel } from "@/lib/notify/templates";
export { darkButton, darkInput } from "./styles";

/*
 * Dark surfaces for pricing, checkout, the client portal, and admin. They reuse the site's night palette,
 * square corners, and type, so they read as Fluxline rather than a third-party dashboard.
 * Wrapping a page in <DarkPage> also turns the site header to its dark tone (data-tone="dark").
 */

export function DarkPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div data-tone="dark" className={`min-h-[70vh] bg-night text-white ${className}`}>
      {children}
    </div>
  );
}

export function Shell({ className = "", ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-8 ${className}`} {...props} />;
}

export function Panel({ title, action, children, className = "" }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`border border-night-line bg-night-soft ${className}`}>
      {(title || action) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-night-line px-5 py-4">
          {title && <h2 className="text-[15px] font-semibold text-white">{title}</h2>}
          {action}
        </header>
      )}
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-medium text-accent-on-night">{children}</p>;
}

export function Notice({ tone = "info", title, children }: { tone?: "info" | "success" | "warning" | "error"; title?: string; children?: ReactNode }) {
  const styles = {
    info: "border-accent-on-night/40 bg-accent-on-night/10 text-white",
    success: "border-emerald-400/40 bg-emerald-400/10 text-white",
    warning: "border-amber-300/50 bg-amber-300/10 text-white",
    error: "border-red-400/50 bg-red-400/10 text-white",
  }[tone];
  const Icon = tone === "success" ? CheckCircle2 : tone === "info" ? Info : AlertTriangle;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`flex gap-3 border px-4 py-3.5 text-sm leading-relaxed ${styles}`}>
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? "mt-1 text-white/80" : "text-white/85"}>{children}</div>}
      </div>
    </div>
  );
}

const STATUS_TONES: Record<string, string> = {
  deposit_pending: "bg-white/10 text-white/80",
  deposit_paid: "bg-accent-on-night/15 text-accent-on-night",
  onboarding: "bg-accent-on-night/15 text-accent-on-night",
  in_development: "bg-violet-400/15 text-violet-200",
  client_review: "bg-amber-300/15 text-amber-200",
  final_payment_pending: "bg-amber-300/15 text-amber-200",
  ready_for_launch: "bg-emerald-400/15 text-emerald-200",
  live: "bg-emerald-400/20 text-emerald-200",
  maintenance_active: "bg-emerald-400/20 text-emerald-200",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={`inline-flex items-center px-2 py-1 text-xs font-medium ${STATUS_TONES[status] ?? "bg-white/10 text-white/80"}`}>{statusLabel(status)}</span>;
}

const PILL_TONES: Record<string, string> = {
  paid: "bg-emerald-400/15 text-emerald-200",
  succeeded: "bg-emerald-400/15 text-emerald-200",
  active: "bg-emerald-400/15 text-emerald-200",
  open: "bg-amber-300/15 text-amber-200",
  invited: "bg-amber-300/15 text-amber-200",
  consented: "bg-amber-300/15 text-amber-200",
  past_due: "bg-red-400/15 text-red-200",
  unpaid: "bg-red-400/15 text-red-200",
  uncollectible: "bg-red-400/15 text-red-200",
  refunded: "bg-white/10 text-white/70",
  partially_refunded: "bg-white/10 text-white/70",
  void: "bg-white/10 text-white/60",
  canceled: "bg-white/10 text-white/60",
};

export function Pill({ value, label }: { value: string; label?: string }) {
  return <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${PILL_TONES[value] ?? "bg-white/10 text-white/75"}`}>{label ?? value.replace(/_/g, " ")}</span>;
}

export function FieldLabel({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-white">
      {children}
      {optional && <span className="font-normal text-white/50"> (optional)</span>}
    </label>
  );
}

export function FieldErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 text-sm text-red-300">
      {children}
    </p>
  );
}


export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="border border-night-line bg-night-soft px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/55">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-white/50">{hint}</p>}
    </div>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="py-6 text-center text-sm text-white/55">{children}</p>;
}

export const formatDateTime = (date: Date | null | undefined) =>
  date ? date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York" }) : "—";
export const formatDay = (date: Date | null | undefined) =>
  date ? date.toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "America/New_York" }) : "—";
