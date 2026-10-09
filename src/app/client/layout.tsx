import type { Metadata } from "next";
import Link from "next/link";
import { DarkPage, Shell } from "@/components/billing/ui";
import { SubmitButton } from "@/components/billing/submit-button";
import { signOut } from "../auth/actions";

export const metadata: Metadata = { title: "Client portal", robots: { index: false, follow: false } };

/* Each page checks the session itself (requireClient); this layout is presentation only. */
export default function ClientLayout({ children }: LayoutProps<"/client">) {
  return (
    <DarkPage>
      <div className="border-b border-night-line">
        <Shell className="flex h-14 items-center justify-between gap-4">
          <nav aria-label="Client portal" className="flex items-center gap-5 text-sm">
            <span className="font-semibold text-white">Client portal</span>
            <Link href="/client/dashboard" className="text-white/70 hover:text-white">
              Dashboard
            </Link>
          </nav>
          <form action={signOut}>
            <SubmitButton variant="small" pendingLabel="Signing out…">
              Sign out
            </SubmitButton>
          </form>
        </Shell>
      </div>
      {children}
    </DarkPage>
  );
}
