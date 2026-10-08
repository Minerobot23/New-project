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

/* A horizontal timeline on large screens (one connecting line, a node per step); a vertical rail on small ones. */
export function Process() {
  return (
    <ol className="relative grid gap-10 md:grid-cols-4 md:gap-8">
      <span aria-hidden="true" className="absolute left-[1.0625rem] top-2 bottom-2 w-px bg-line-strong md:inset-x-0 md:bottom-auto md:left-0 md:top-[1.0625rem] md:h-px md:w-auto" />
      {steps.map((step, index) => (
        <li key={step.title} className="reveal relative flex gap-5 md:flex-col md:gap-0">
          <span className="relative flex size-[2.125rem] shrink-0 items-center justify-center rounded-full bg-surface font-mono text-xs font-medium text-accent ring-1 ring-line-strong">
            {index + 1}
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-ink md:mt-6">{step.title}</h3>
            <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
