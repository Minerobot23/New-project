import { Eye, MousePointerClick, Smartphone, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

type Problem = { title: string; body: string };

/* Ten familiar problems, grouped by where they cost a business: the first look, the phone, and the next step. */
const groups: { icon: LucideIcon; title: string; problems: Problem[] }[] = [
  {
    icon: Eye,
    title: "The first impression",
    problems: [
      { title: "Outdated design", body: "First impressions happen in seconds. A dated site quietly suggests a dated business." },
      { title: "Slow pages", body: "Every extra second of loading is a chance for a visitor to give up." },
      { title: "A site that undersells your reputation", body: "Great reviews and great work deserve a website that reflects them." },
    ],
  },
  {
    icon: Smartphone,
    title: "On the phone",
    problems: [
      { title: "Poor mobile experience", body: "Many customers will find you on a phone. Pinching and zooming sends them back to search results." },
      { title: "PDF menus and price lists", body: "Downloads are slow, hard to read on a phone, and invisible to search engines." },
      { title: "Confusing navigation", body: "When visitors can't find what they came for, they stop looking." },
    ],
  },
  {
    icon: MousePointerClick,
    title: "The next step",
    problems: [
      { title: "Missing quote, booking, or reservation paths", body: "If the next step isn't obvious, many visitors never take it." },
      { title: "Weak calls-to-action", body: "\"Contact us\" at the bottom of a long page is easy to miss." },
      { title: "Poorly organized services", body: "Customers search for a specific service, not a paragraph listing everything you do." },
      { title: "Poor search visibility", body: "Without the right structure, the people searching for you may find a competitor first." },
    ],
  },
];

export function Problems() {
  return (
    <section aria-labelledby="problems-title" className="border-t border-line bg-surface py-24 sm:py-32">
      <Container className="grid max-w-7xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="problems-title"
            title="Your website should work as hard as your business does."
            intro={
              <p>
                Many excellent businesses have websites that don&apos;t reflect the quality of their work. The issues are usually
                familiar, and almost all of them are fixable.
              </p>
            }
          />
        </div>

        <div className="space-y-6">
          {groups.map(({ icon: Icon, title, problems }) => (
            <div key={title} className="reveal bezel">
              <div className="bg-paper p-6 sm:p-8">
                <h3 className="flex items-center gap-3 text-lg font-semibold tracking-tight text-ink">
                  <span className="flex size-9 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Icon aria-hidden="true" strokeWidth={1.5} className="size-[18px]" />
                  </span>
                  {title}
                </h3>
                <ul className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  {problems.map((problem) => (
                    <li key={problem.title}>
                      <p className="text-[15px] font-medium leading-snug text-ink">{problem.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{problem.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
