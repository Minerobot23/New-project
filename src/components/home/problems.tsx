const problems: { title: string; body: string }[] = [
  { title: "Outdated design", body: "First impressions happen in seconds. A dated site quietly suggests a dated business." },
  { title: "Poor mobile experience", body: "Many customers will find you on a phone. Pinching and zooming sends them back to search results." },
  { title: "Slow pages", body: "Every extra second of loading is a chance for a visitor to give up." },
  { title: "Confusing navigation", body: "When visitors can't find what they came for, they stop looking." },
  { title: "PDF menus and price lists", body: "Downloads are slow, hard to read on a phone, and invisible to search engines." },
  { title: "Missing quote, booking, or reservation paths", body: "If the next step isn't obvious, many visitors never take it." },
  { title: "Weak calls-to-action", body: "“Contact us” at the bottom of a long page is easy to miss." },
  { title: "Poor search visibility", body: "Without the right structure, the people searching for you may find a competitor first." },
  { title: "Poorly organized services", body: "Customers search for a specific service, not a paragraph listing everything you do." },
  { title: "A site that undersells your reputation", body: "Great reviews and great work deserve a website that reflects them." },
];

export function Problems() {
  return (
    <section aria-labelledby="problems-title" className="border-t border-ink">
      <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-12">
          <h2 id="problems-title" className="display-tight text-balance text-[2.25rem] sm:text-[3.25rem] lg:col-span-8">
            Your website should work as hard as your business does.
          </h2>
          <p className="max-w-[46ch] text-pretty text-lg leading-relaxed text-ink-soft lg:col-span-4 lg:self-end">
            Many excellent businesses have websites that don&apos;t reflect the quality of their work. The issues are usually
            familiar, and almost all of them are fixable.
          </p>
        </div>

        <ol className="mt-14 grid gap-x-12 sm:mt-20 md:grid-cols-2">
          {problems.map((problem, index) => (
            <li key={problem.title} className="grid grid-cols-[3.25rem_1fr] gap-4 border-t border-line-strong py-6 sm:grid-cols-[4.5rem_1fr]">
              <span className="display-tight text-2xl text-accent sm:text-3xl">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="text-lg font-semibold leading-snug text-ink">{problem.title}</h3>
                <p className="mt-1.5 max-w-[48ch] text-[15px] leading-relaxed text-ink-soft">{problem.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
