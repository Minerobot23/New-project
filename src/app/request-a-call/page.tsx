import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { RequestCallForm } from "@/components/forms/request-call-form";
import { pageMetadata } from "@/lib/seo";
import { ORDER_PATH, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Request a Call",
  description:
    "Request a call with Fluxline Solutions about a new website or a redesign. Tell us about your business and we'll reach out to coordinate a time.",
  path: "/request-a-call",
});

const expectations = [
  {
    title: "A practical conversation",
    body: "We'll talk about your business, your customers, and what you want your website to do.",
  },
  {
    title: "We reach out to you",
    body: "We'll review your business first, then contact you to find a time that works.",
  },
  {
    title: "No pressure",
    body: "No obligation and nothing to prepare. If we're not the right fit, we'll say so.",
  },
];

export default function RequestCallPage() {
  return (
    <section aria-labelledby="call-title" data-tone="dark" className="bg-stage text-bone">
      <Container className="max-w-[90rem] pb-16 pt-8 sm:pb-24">
        <Breadcrumbs items={[{ name: "Request a Call", path: "/request-a-call" }]} tone="dark" />
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="label text-bone/60">Talk to Fluxline</p>
            <h1 id="call-title" className="display mt-5 text-balance text-[2.4rem] uppercase sm:text-[3.6rem]">
              Request a call.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-bone/75">
              Tell us a little about your business. We&apos;ll follow up to coordinate a time to talk.
            </p>
            <ul className="mt-10 border-b border-bone/25">
              {expectations.map(({ title, body }) => (
                <li key={title} className="border-t border-bone/25 py-4">
                  <p className="label text-bone">{title}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-bone/70">{body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 border-l-2 border-bone/60 pl-5">
              <p className="text-[15px] leading-relaxed text-bone/80">
                Ready to start now? Essential and Business can be ordered online with a 50% deposit. No call needed.
              </p>
              <Link href={ORDER_PATH} className="label mt-3 inline-flex items-center gap-3 text-bone hover:text-bone/80">
                See packages and start <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="mt-8 text-sm text-bone/55">
              Prefer email?{" "}
              <a href={`mailto:${site.contact.email}`} className="text-bone underline underline-offset-4">
                {site.contact.email}
              </a>
            </p>
          </div>
          <div className="bg-paper p-5 text-ink sm:p-8 lg:col-span-6 lg:col-start-7">
            <RequestCallForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
