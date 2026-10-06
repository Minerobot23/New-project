import { Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { CALL_CTA_LABEL, CALL_PATH } from "@/lib/site";

const faqs = [
  {
    q: "Does Fluxline generate leads?",
    a: "No. Fluxline focuses on opportunities your business has already generated: estimates you've quoted that haven't closed.",
  },
  {
    q: "Do I need to replace my CRM?",
    a: "No. Fluxline is designed to work alongside your existing operation, including the CRM and sales process you already use.",
  },
  {
    q: "What kinds of estimates do you work with?",
    a: "It depends on the business. Job types, ticket sizes, and how your estimates are tracked all vary, so we look at that together during the first conversation before recommending anything.",
  },
  {
    q: "Do you guarantee recovered revenue?",
    a: "No. We don't promise specific results. The goal is to systematically identify the opportunities that are still viable and pursue them with a consistent, measurable process.",
  },
  {
    q: "Who is Fluxline for?",
    a: "Home-service businesses with meaningful estimate volume and higher-value jobs, such as HVAC, plumbing, roofing, electrical, and remodeling companies.",
  },
  {
    q: "How do we get started?",
    a: "With a short conversation about how your company currently handles estimates that don't close. Request a call and we'll reach out to find a time.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="border-t border-line bg-surface py-20 sm:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <SectionHeading id="faq-title" eyebrow="FAQ" title="Common questions." />
          <div className="mt-8 hidden lg:block">
            <ButtonLink href={CALL_PATH} withArrow>
              {CALL_CTA_LABEL}
            </ButtonLink>
          </div>
        </div>
        <div>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((item) => (
              <details key={item.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <Plus
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45"
                  />
                </summary>
                <p className="-mt-1 pb-5 pr-10 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
              </details>
            ))}
          </div>
          <ButtonLink href={CALL_PATH} size="lg" className="mt-8 w-full sm:w-auto lg:hidden" withArrow>
            {CALL_CTA_LABEL}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
