import { Plus } from "lucide-react";
import { faqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export type Faq = { q: string; a: string };

/** Accessible, no-JS accordion (native details/summary) with FAQPage structured data. */
export function FaqList({ faqs, withSchema = true }: { faqs: Faq[]; withSchema?: boolean }) {
  return (
    <>
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
      <div className="space-y-3">
        {faqs.map((item) => (
          <details key={item.q} className="group rounded-[1.25rem] bg-paper ring-1 ring-line transition-colors open:bg-surface open:shadow-[var(--shadow-soft)]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-[1.25rem] px-6 py-5 text-left text-base font-medium text-ink [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface ring-1 ring-line transition-transform duration-300 ease-[var(--ease-out-soft)] group-open:rotate-45 group-open:bg-accent group-open:text-white group-open:ring-accent">
                <Plus aria-hidden="true" strokeWidth={1.75} className="size-4" />
              </span>
            </summary>
            <p className="-mt-1 max-w-[65ch] px-6 pb-6 pr-14 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
