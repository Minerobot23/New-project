import { faqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export type Faq = { q: string; a: string };

/** Accessible, no-JS accordion (native details/summary) with FAQPage structured data. */
export function FaqList({ faqs, withSchema = true }: { faqs: Faq[]; withSchema?: boolean }) {
  return (
    <>
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
      <div className="border-b border-ink">
        {faqs.map((item) => (
          <details key={item.q} className="group border-t border-ink">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-left text-lg font-medium leading-snug text-ink transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
              {item.q}
              <span aria-hidden="true" className="relative mt-1.5 size-4 shrink-0">
                <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-current" />
                <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-current transition-transform duration-300 ease-[var(--ease-out-soft)] group-open:scale-y-0" />
              </span>
            </summary>
            <p className="-mt-1 max-w-[62ch] pb-6 pr-10 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
