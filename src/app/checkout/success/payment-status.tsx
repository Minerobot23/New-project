"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import { Notice } from "@/components/billing/ui";

type Status = "unknown" | "pending" | "confirmed" | "expired";

const POLL_MS = 2500;
const MAX_POLLS = 36; // about 90 seconds

export function PaymentStatus({ sessionId, initial }: { sessionId: string; initial: Status }) {
  const [status, setStatus] = useState<Status>(initial);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (status !== "pending") return;
    let polls = 0;
    let cancelled = false;
    const timer = setInterval(async () => {
      polls += 1;
      if (polls > MAX_POLLS) {
        clearInterval(timer);
        setTimedOut(true);
        return;
      }
      try {
        const response = await fetch(`/api/checkout/status?session_id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        const body = (await response.json()) as { status: Status };
        if (!cancelled && body.status !== "pending") {
          setStatus(body.status);
          clearInterval(timer);
        }
      } catch {
        // Network hiccup: keep polling.
      }
    }, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [status, sessionId]);

  if (status === "confirmed") {
    return (
      <div aria-live="polite" className="max-w-2xl">
        <CheckCircle2 aria-hidden="true" className="size-10 text-emerald-300" />
        <h1 className="display-tight mt-6 text-[2.25rem] sm:text-5xl">Your deposit is confirmed.</h1>
        <p className="mt-6 text-lg leading-relaxed text-white/75">
          Stripe has confirmed your payment and your project is on our schedule. We&apos;ve emailed you a receipt and a secure link to start onboarding.
        </p>
        <div className="mt-8 flex items-start gap-3 border border-night-line bg-night-soft p-5 text-[15px] text-white/80">
          <Mail aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-accent-on-night" />
          <p>
            Next step: open the email titled <strong className="text-white">“Next step: tell us about your business”</strong>. Didn&apos;t get it? You can{" "}
            <Link href="/login?next=/client/onboarding" className="underline underline-offset-4">
              request a sign-in link
            </Link>{" "}
            with the email you used at checkout.
          </p>
        </div>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="max-w-2xl space-y-6">
        <h1 className="display-tight text-[2.25rem] sm:text-5xl">This checkout didn&apos;t complete.</h1>
        <Notice tone="warning">The payment wasn&apos;t completed, so nothing was charged. You can start again from the pricing page.</Notice>
        <Link href="/pricing" className="inline-block underline underline-offset-4">
          Back to pricing
        </Link>
      </div>
    );
  }

  if (status === "unknown") {
    return (
      <div className="max-w-2xl space-y-6">
        <h1 className="display-tight text-[2.25rem] sm:text-5xl">We couldn&apos;t find that checkout.</h1>
        <p className="text-lg text-white/70">
          If you completed a payment, Stripe has emailed you a receipt and we&apos;ll email your onboarding link as soon as it&apos;s confirmed.
        </p>
      </div>
    );
  }

  return (
    <div aria-live="polite" className="max-w-2xl">
      <Loader2 aria-hidden="true" className="size-10 animate-spin text-accent-on-night" />
      <h1 className="display-tight mt-6 text-[2.25rem] sm:text-5xl">Confirming your payment…</h1>
      <p className="mt-6 text-lg leading-relaxed text-white/75">
        We&apos;re waiting for Stripe to confirm the payment. This usually takes a few seconds; please keep this page open.
      </p>
      {timedOut && (
        <div className="mt-8">
          <Notice tone="info" title="Still processing">
            Some payments take a little longer to confirm. You don&apos;t need to pay again: we&apos;ll email your confirmation and onboarding link as soon
            as Stripe confirms it.
          </Notice>
        </div>
      )}
    </div>
  );
}
