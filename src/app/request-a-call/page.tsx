import Image from "next/image";
import { Clock, MessageSquare, PhoneCall } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { RequestCallForm } from "@/components/forms/request-call-form";
import { pageMetadata } from "@/lib/seo";
import { PHOTOS } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Request a Call",
  description:
    "Request a call with Fluxline Solutions about a new website or a redesign. Tell us about your business and we'll reach out to coordinate a time.",
  path: "/request-a-call",
});

const expectations = [
  {
    icon: MessageSquare,
    title: "A practical conversation",
    body: "We'll talk about your business, your customers, and what you want your website to do.",
  },
  {
    icon: PhoneCall,
    title: "We reach out to you",
    body: "We'll review your business first, then contact you to find a time that works.",
  },
  {
    icon: Clock,
    title: "No pressure",
    body: "No obligation and nothing to prepare. If we're not the right fit, we'll say so.",
  },
];

export default function RequestCallPage() {
  return (
    <section aria-labelledby="call-title" className="py-10 sm:py-14 lg:py-16">
      <Container className="max-w-[90rem]">
        <Breadcrumbs items={[{ name: "Request a Call", path: "/request-a-call" }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="lg:pt-2">
            <p className="text-sm font-medium text-accent">Talk to Fluxline</p>
            <h1 id="call-title" className="mt-3 display text-balance text-[2.5rem] text-ink sm:text-[3.5rem]">
              Request a Call
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
              Tell us a little about your business. We&apos;ll follow up to coordinate a time to talk.
            </p>
            <div className="relative mt-8 hidden aspect-[16/9] overflow-hidden bg-sunken sm:block">
              <Image src={PHOTOS.ownerCall.src} alt={PHOTOS.ownerCall.alt} fill sizes="(min-width: 1024px) 40vw, 90vw" placeholder="blur" className="object-cover" />
            </div>
            <ul className="mt-10 hidden space-y-6 sm:block">
              {expectations.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center border border-line bg-surface text-accent">
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
          <div className="border border-ink bg-surface p-5 sm:p-8">
            <RequestCallForm />
          </div>
          <p className="text-sm text-muted lg:hidden">
            Prefer email?{" "}
            <a href={`mailto:${site.contact.email}`} className="font-medium text-ink underline underline-offset-4">
              {site.contact.email}
            </a>
          </p>
        </div>
      </Container>
    </section>
  );
}
