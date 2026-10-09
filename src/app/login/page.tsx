import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DarkPage, Notice, Shell } from "@/components/billing/ui";
import { getCurrentUser } from "@/lib/auth/session";
import { safeNextPath } from "@/lib/security";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Client sign in", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next, signedOut } = await searchParams;
  const destination = typeof next === "string" ? safeNextPath(next, "") : "";
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : destination || "/client/dashboard");

  return (
    <DarkPage>
      <Shell className="grid gap-12 py-16 sm:py-24 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="text-sm font-medium text-accent-on-night">Client portal</p>
          <h1 className="display-tight mt-4 text-[2.25rem] sm:text-5xl">Sign in</h1>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-white/70">
            We&apos;ll email you a secure, single-use link. No password to remember.
          </p>
          <p className="mt-8 text-sm text-white/50">
            Not a client yet?{" "}
            <Link href="/pricing" className="underline underline-offset-4 hover:text-white">
              See pricing
            </Link>
            .
          </p>
        </div>
        <div className="space-y-4 lg:col-span-5 lg:col-start-8">
          {signedOut === "1" && <Notice tone="success">You&apos;ve signed out.</Notice>}
          <LoginForm next={destination || undefined} />
        </div>
      </Shell>
    </DarkPage>
  );
}
