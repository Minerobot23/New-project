import { Compass, MousePointerClick, Palette, Smartphone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { WebsiteCheckForm } from "@/components/forms/website-check-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Website Check",
  description:
    "Send us your business website and we'll personally review it for design, mobile experience, customer journey, and conversion opportunities. Free, with no obligation.",
  path: "/website-check",
});

const areas = [
  { icon: Palette, title: "Design", body: "Does the site reflect the quality of your business in the first few seconds?" },
  { icon: Smartphone, title: "Mobile experience", body: "Is it easy to read, navigate, and act on from a phone?" },
  { icon: Compass, title: "Customer journey", body: "Can visitors quickly find services, prices, hours, or the information they came for?" },
  { icon: MousePointerClick, title: "Conversion", body: "Is the next step, whether that's a call, quote, booking, or order, obvious and easy?" },
];

export default function WebsiteCheckPage() {
  return (
    <section aria-labelledby="check-title" className="py-10 sm:py-14 lg:py-16">
      <Container className="max-w-[90rem]">
        <Breadcrumbs items={[{ name: "Website Check", path: "/website-check" }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="lg:pt-2">
            <p className="text-sm font-medium text-accent">Free Website Check</p>
            <h1 id="check-title" className="mt-3 display text-balance text-[2.5rem] text-ink sm:text-[3.5rem]">
              See What Could Be Better.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
              We&apos;ll review your current website and identify opportunities around design, mobile experience, customer
              journey, and conversion.
            </p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {areas.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center border border-line bg-surface text-accent">
                    <Icon aria-hidden="true" className="size-[18px]" />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-line pt-6 text-sm leading-relaxed text-muted">
              Every check is done by a person, not an automated scanner. There&apos;s no cost and no obligation.
            </p>
          </div>
          <div className="border border-ink bg-surface p-5 sm:p-8">
            <WebsiteCheckForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
