import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { WebsiteCheckForm } from "@/components/forms/website-check-form";
import { pageMetadata } from "@/lib/seo";
import { ORDER_PATH } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Free Website Check",
  description:
    "Send us your business website and we'll personally review it for design, mobile experience, customer journey, and conversion opportunities. Free, with no obligation.",
  path: "/website-check",
});

const areas = [
  { title: "Design", body: "Does the site reflect the quality of your business in the first few seconds?" },
  { title: "Mobile experience", body: "Is it easy to read, navigate, and act on from a phone?" },
  { title: "Customer journey", body: "Can visitors quickly find services, prices, hours, or the information they came for?" },
  { title: "Conversion", body: "Is the next step, whether that's a call, quote, booking, or order, obvious and easy?" },
];

export default function WebsiteCheckPage() {
  return (
    <section aria-labelledby="check-title" data-tone="dark" className="bg-stage text-bone">
      <Container className="max-w-[90rem] pb-16 pt-8 sm:pb-24">
        <Breadcrumbs items={[{ name: "Website Check", path: "/website-check" }]} tone="dark" />
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="label text-bone/60">Free website check</p>
            <h1 id="check-title" className="display mt-5 text-balance text-[2.4rem] uppercase sm:text-[3.6rem]">
              See what could be better.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-bone/75">
              We&apos;ll review your current website and identify opportunities around design, mobile experience, customer
              journey, and conversion.
            </p>
            <ul className="mt-10 border-b border-bone/25">
              {areas.map(({ title, body }) => (
                <li key={title} className="grid gap-1 border-t border-bone/25 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6">
                  <p className="label pt-1 text-bone">{title}</p>
                  <p className="text-[15px] leading-relaxed text-bone/70">{body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm leading-relaxed text-bone/55">
              Every check is done by a person, not an automated scanner. There&apos;s no cost and no obligation. Already know you want a
              new website?{" "}
              <Link href={ORDER_PATH} className="text-bone underline underline-offset-4">
                See packages and start
              </Link>
              .
            </p>
          </div>
          <div className="bg-paper p-5 text-ink sm:p-8 lg:col-span-6 lg:col-start-7">
            <WebsiteCheckForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
