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

export function Process() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title} className="flex flex-col bg-surface p-6">
          <span className="font-mono text-sm font-medium text-accent">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
