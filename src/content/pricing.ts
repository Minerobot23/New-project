import type { Faq } from "@/components/ui/faq-list";
import type { PlanId } from "@/lib/billing/plans";

/** Comparison table rows. "yes" renders a check, "no" a dash; anything else is shown as written. */
export type ComparisonRow = { label: string; values: Record<PlanId, string> };

export const COMPARISON: { group: string; rows: ComparisonRow[] }[] = [
  {
    group: "Pricing",
    rows: [
      { label: "Development fee (one time)", values: { essential: "$700", business: "$1,300", premium: "From $2,200" } },
      { label: "Deposit to start (50%)", values: { essential: "$350", business: "$650", premium: "From $1,100" } },
      { label: "Balance due before launch", values: { essential: "$350", business: "$650", premium: "From $1,100" } },
      { label: "Website Care (monthly, required)", values: { essential: "$59/mo", business: "$99/mo", premium: "$149/mo" } },
      { label: "How to start", values: { essential: "Pay deposit online", business: "Pay deposit online", premium: "Quote, then deposit" } },
    ],
  },
  {
    group: "Website",
    rows: [
      { label: "Pages", values: { essential: "Up to 3", business: "Up to 7 custom", premium: "Scoped in your quote" } },
      { label: "Responsive mobile design", values: { essential: "yes", business: "yes", premium: "yes" } },
      { label: "Custom design and branding", values: { essential: "no", business: "yes", premium: "yes" } },
      { label: "Contact and lead forms", values: { essential: "Contact form, click-to-call", business: "Lead-generation forms", premium: "Scoped in your quote" } },
      { label: "Service and location pages", values: { essential: "no", business: "yes", premium: "Scoped in your quote" } },
      { label: "Advanced animations and cinematic visuals", values: { essential: "no", business: "no", premium: "yes" } },
      { label: "Custom integrations", values: { essential: "no", business: "no", premium: "yes" } },
    ],
  },
  {
    group: "Search and measurement",
    rows: [
      { label: "SEO", values: { essential: "Basic on-page", business: "Local SEO foundations", premium: "Advanced technical foundations" } },
      { label: "Analytics integration", values: { essential: "no", business: "yes", premium: "Scoped in your quote" } },
    ],
  },
  {
    group: "Website Care",
    rows: [
      { label: "Hosting and SSL", values: { essential: "yes", business: "yes", premium: "yes" } },
      { label: "Uptime monitoring", values: { essential: "no", business: "yes", premium: "Scoped in your quote" } },
      { label: "Updates and support", values: { essential: "Basic maintenance", business: "Minor content updates", premium: "Priority support" } },
      { label: "Minimum term, then month to month", values: { essential: "3 months", business: "3 months", premium: "3 months" } },
    ],
  },
];

export const PRICING_FAQS: Faq[] = [
  {
    q: "How does payment work?",
    a: "Every package has a one-time development fee, paid in two parts. You pay a 50% deposit online to start; it's processed by Stripe, and we never see or store your card number. When your website is ready for launch, we send the remaining 50% as an invoice, and the site launches once it's paid.",
  },
  {
    q: "What is Website Care, and why is it required?",
    a: "Website Care keeps your site hosted, secure, and up to date after launch, with the updates and support listed for your package. It's billed monthly: $59, $99, or $149 depending on the package. There is no annual option. It starts only after launch, and only after you separately review its terms and authorize the monthly charge.",
  },
  {
    q: "Is there a minimum commitment?",
    a: "Website Care has a three-month minimum from the day it starts. After that it continues month to month until you cancel.",
  },
  {
    q: "How do I cancel Website Care?",
    a: "Online, from your client dashboard, with one click, or by emailing us. Cancellation takes effect at the end of the current billing month, or at the end of the three-month minimum if that's later, and you're charged nothing after that date. You'll get an email confirming the date.",
  },
  {
    q: "Who owns the website and domain?",
    a: "Your domain is yours. Once the development fee is paid in full, you own your website's content, design, and the code written specifically for it. If you leave Website Care, we'll provide your site's files and reasonable help moving it to another host.",
  },
  {
    q: "Do you guarantee search rankings?",
    a: "No. Nobody can honestly guarantee rankings, traffic, or leads. What we do is build the SEO foundations listed for your package (page structure, titles and descriptions, speed, and, on Business and Premium, local and technical foundations) so search engines can understand your site.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on the package and how quickly we receive your content and feedback. After onboarding, we'll give you an estimated schedule for your project, and your dashboard shows where it stands at every stage.",
  },
  {
    q: "How many revisions are included?",
    a: "Two rounds of revisions on the design and two rounds on the built website. Changes beyond that, or new pages and features outside your package, are quoted separately before any work starts.",
  },
  {
    q: "Why does Premium need a quote?",
    a: "Premium projects vary widely: animation, cinematic visuals, and integrations depend on what you need. We agree on the scope and price in writing first. The development fee starts at $2,200, with a 50% deposit to begin.",
  },
  {
    q: "Can I get a refund?",
    a: "If a project is cancelled before design work starts, the deposit is refunded less any third-party costs already incurred. After design work starts, the deposit is non-refundable. Approved refunds go back to your original payment method through Stripe. The service agreement shown at checkout has the full terms.",
  },
];
