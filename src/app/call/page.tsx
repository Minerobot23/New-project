import type { Metadata } from "next";
import { Clock, MessageSquare, PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CallRequestForm } from "@/components/call/call-request-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a 15-Minute Call",
  description:
    "Request a short call with Fluxline about how your company handles estimates that don't close. We'll reach out to coordinate a time.",
  alternates: { canonical: "/call" },
  openGraph: { url: "/call" },
};

const expectations = [
  {
    icon: MessageSquare,
    title: "A short, practical conversation",
    body: "We'll talk about how your company currently handles estimates that don't close.",
  },
  {
    icon: PhoneCall,
    title: "We reach out to you",
    body: "Someone from Fluxline will contact you to find a time that works.",
  },
  {
    icon: Clock,
    title: "About 15 minutes",
    body: "No obligation, and no need to prepare anything in advance.",
  },
];

export default function CallPage() {
  return (
    <section aria-labelledby="call-title" className="py-12 sm:py-16 lg:py-20">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="lg:pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Talk to Fluxline</p>
          <h1 id="call-title" className="mt-3 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Request a <span className="whitespace-nowrap">15-Minute</span> Call
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            Tell us how to reach you. We&apos;ll follow up to coordinate a time.
          </p>

          <ul className="mt-10 hidden space-y-6 sm:block">
            {expectations.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-accent">
                  <Icon aria-hidden="true" className="size-[18px]" />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">{title}</p>
                  <p className="mt-0.5 text-[15px] leading-relaxed text-ink-soft">{body}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-10 hidden border-t border-line pt-6 text-sm text-muted lg:block">
            Prefer email?{" "}
            <a href={`mailto:${site.contact.email}`} className="font-medium text-ink underline underline-offset-4">
              {site.contact.email}
            </a>
          </p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5 shadow-[0_1px_2px_rgba(15,26,36,0.04),0_12px_32px_-16px_rgba(15,26,36,0.16)] sm:p-8">
          <CallRequestForm />
        </div>

        <p className="text-sm text-muted lg:hidden">
          Prefer email?{" "}
          <a href={`mailto:${site.contact.email}`} className="font-medium text-ink underline underline-offset-4">
            {site.contact.email}
          </a>
        </p>
      </Container>
    </section>
  );
}
