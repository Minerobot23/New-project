import { Plus } from "lucide-react";
import { faqSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";

export type Faq = { q: string; a: string };

/** Accessible, no-JS accordion (native details/summary) with FAQPage structured data. */
export function FaqList({ faqs, withSchema = true }: { faqs: Faq[]; withSchema?: boolean }) {
  return (
    <>
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
      <div className="divide-y divide-line border-y border-line">
        {faqs.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-medium text-ink [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus aria-hidden="true" className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45" />
            </summary>
            <p className="-mt-1 pb-5 pr-10 text-[15px] leading-relaxed text-ink-soft">{item.a}</p>
          </details>
        ))}
      </div>
    </>
  );
}
