import type { Metadata } from "next";
import Link from "next/link";
import { SubmitButton } from "@/components/billing/submit-button";
import { DarkPage, Shell } from "@/components/billing/ui";
import { billingStatus } from "@/lib/billing/config";
import { signOut } from "../auth/actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

/* Presentation only: every admin page and action calls requireAdmin itself. */
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  const status = billingStatus();
  return (
    <DarkPage>
      <div className="border-b border-night-line">
        <Shell className="flex min-h-14 flex-wrap items-center justify-between gap-3 py-2">
          <nav aria-label="Admin" className="flex flex-wrap items-center gap-5 text-sm">
            <span className="font-semibold">Fluxline admin</span>
            <Link href="/admin" className="text-white/70 hover:text-white">
              Overview
            </Link>
            <Link href="/admin/quotes" className="text-white/70 hover:text-white">
              Quotes
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-1 text-xs font-medium ${status.enabled ? (status.mode === "live" ? "bg-emerald-400/20 text-emerald-200" : "bg-amber-300/20 text-amber-200") : "bg-white/10 text-white/70"}`}
            >
              {status.enabled ? (status.mode === "live" ? "Stripe: live" : "Stripe: test mode") : "Stripe: not connected"}
            </span>
            <form action={signOut}>
              <SubmitButton variant="small" pendingLabel="Signing out…">
                Sign out
              </SubmitButton>
            </form>
          </div>
        </Shell>
      </div>
      {children}
    </DarkPage>
  );
}
