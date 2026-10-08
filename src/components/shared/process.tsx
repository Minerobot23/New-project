const steps = [
  {
    title: "Conversation",
    body: "A short call about your business, your customers, and what you want the website to do. No pressure and no jargon.",
  },
  {
    title: "Review & plan",
    body: "We look at your current site (if you have one) and your market, then propose a clear scope, timeline, and price before any work starts.",
  },
  {
    title: "Design & build",
    body: "You see the design early and give feedback before it's built. We build it fast, accessible, and mobile-first.",
  },
  {
    title: "Launch & measure",
    body: "We handle domain, hosting, analytics, and search setup, then make sure calls and form submissions are being tracked.",
  },
];

/* Four ruled columns with large numerals; stacks on small screens. */
export function Process() {
  return (
    <ol className="grid border-t border-ink md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="border-b border-line-strong py-8 md:border-b-0 md:py-10 md:pr-8 lg:border-l lg:border-line-strong lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
        >
          <span className="display block text-[3.5rem] text-accent sm:text-[4.5rem]">{index + 1}</span>
          <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">{step.title}</h3>
          <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
