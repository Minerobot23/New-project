import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { SubmitButton } from "@/components/billing/submit-button";
import { DarkPage, Notice, Shell } from "@/components/billing/ui";
import { peekLoginToken } from "@/lib/auth/core";
import { getDb } from "@/lib/db";
import { verifyLoginLink } from "../actions";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function VerifyPage({ searchParams }: PageProps<"/auth/verify">) {
  await connection();
  const { token, error } = await searchParams;
  const value = typeof token === "string" ? token : "";
  const valid = !error && value ? await peekLoginToken(await getDb(), value) : null;

  return (
    <DarkPage>
      <Shell className="max-w-xl py-16 sm:py-24">
        {valid ? (
          <>
            <h1 className="display-tight text-[2.25rem] sm:text-5xl">Continue to your account</h1>
            <p className="mt-5 text-lg text-white/70">Signing in as {valid.email}.</p>
            <form action={verifyLoginLink} className="mt-8">
              <input type="hidden" name="token" value={value} />
              <SubmitButton pendingLabel="Signing in…" className="h-12 w-full sm:w-auto">
                Continue
              </SubmitButton>
            </form>
          </>
        ) : (
          <>
            <h1 className="display-tight text-[2.25rem] sm:text-5xl">This link has expired</h1>
            <div className="mt-6">
              <Notice tone="warning">Sign-in links work once and expire after a short time. Request a new one with your email address.</Notice>
            </div>
            <Link href="/login" className="mt-8 inline-block underline underline-offset-4">
              Get a new sign-in link
            </Link>
          </>
        )}
      </Shell>
    </DarkPage>
  );
}
