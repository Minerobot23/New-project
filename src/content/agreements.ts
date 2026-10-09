/**
 * SERVICE AGREEMENT AND WEBSITE CARE TERMS: EDITABLE TEMPLATE.
 *
 * This is starting language for Fluxline Solutions to review with a lawyer, not finalized legal terms.
 * Edit the sections freely. Whenever the text changes, bump `version`: every acceptance records the version,
 * a hash of the exact text, and a timestamp, so you can always show what a customer agreed to.
 *
 * `status: "draft"` keeps live payments switched off (see src/lib/billing/config.ts). Change it to "approved"
 * only after review. Test-mode checkout works while it is a draft.
 */

export type AgreementSection = { title: string; body: string[] };

export type AgreementDocument = {
  kind: "service" | "website_care";
  title: string;
  version: string;
  status: "draft" | "approved";
  sections: AgreementSection[];
};

export const SERVICE_AGREEMENT: AgreementDocument = {
  kind: "service",
  title: "Website Development Service Agreement",
  version: "2026-10-09-template-1",
  status: "draft",
  sections: [
    {
      title: "1. Scope of work",
      body: [
        "Fluxline Solutions (“Fluxline”) will design and build a website for the client as described by the selected package and, for Premium projects, the written quote the client accepted.",
        "The package determines the number of pages and the features included. Anything not listed in the package or quote is outside the scope of this agreement.",
      ],
    },
    {
      title: "2. Included pages and features",
      body: [
        "Essential: up to 3 pages, responsive mobile design, contact form and click-to-call, basic on-page SEO, hosting and SSL, and basic maintenance.",
        "Business: up to 7 custom pages, custom design and branding, service and location pages, local SEO foundations, lead-generation forms, analytics integration, hosting and uptime monitoring, and minor content updates.",
        "Premium: the custom design, development, animations, integrations, and technical SEO work described in the accepted quote, with priority support.",
      ],
    },
    {
      title: "3. Payment schedule",
      body: [
        "The development fee is paid in two parts: a deposit of 50% of the development fee, due before work begins, and the remaining 50%, due before the website is launched.",
        "Fluxline sends the final balance as an invoice when the website is ready for review. The website is launched after the final balance is paid.",
        "Payments are processed by Stripe. Fluxline does not receive or store card numbers.",
      ],
    },
    {
      title: "4. Website Care plan",
      body: [
        "Every package includes a required monthly Website Care plan: Essential $59, Business $99, or Premium $149 per month (or the monthly amount in an accepted quote). There is no annual option.",
        "Website Care does not start when the deposit is paid. It starts only after the website is approved for launch and the client separately reviews the Website Care terms and authorizes the monthly charge and payment method.",
        "Website Care has a three-month minimum commitment from the date it starts, then continues month to month until cancelled.",
      ],
    },
    {
      title: "5. Revisions",
      body: [
        "Each project includes two rounds of revisions on the design and two rounds on the built website. A round is one consolidated list of changes.",
        "Further rounds, or changes that alter the agreed scope, are additional work (section 6).",
      ],
    },
    {
      title: "6. Additional work and change requests",
      body: [
        "Requests beyond the package or quote, such as extra pages, new features, or integrations, are quoted separately and begin only after the client approves the quote in writing.",
        "Additional work may change the timeline. Fluxline will say so before starting it.",
      ],
    },
    {
      title: "7. Hosting and maintenance",
      body: [
        "While Website Care is active, Fluxline hosts the website, keeps its SSL certificate current, and applies security and software updates, with the monitoring, content updates, and support level listed for the package.",
        "Larger changes than the package includes are additional work (section 6).",
      ],
    },
    {
      title: "8. Domain and website ownership",
      body: [
        "The client owns their domain name. If Fluxline registers a domain on the client's behalf, it is registered in the client's name or transferred to the client on request.",
        "Once the development fee is paid in full, the client owns the website's content, design, and the code written specifically for it. Fluxline may keep general-purpose components and tools it uses across projects and may show the finished website in its portfolio unless the client asks otherwise in writing.",
      ],
    },
    {
      title: "9. Third-party software and licensing",
      body: [
        "Websites may use third-party services, fonts, images, plugins, or software, each under its own license. Paid third-party services the client chooses are billed to the client or passed through at cost, with the client's approval.",
        "Fluxline will use properly licensed materials and will not use content the client has not provided or approved.",
      ],
    },
    {
      title: "10. Client responsibilities",
      body: [
        "The client provides content (text, logos, photos, business details) and timely feedback, and confirms that they have the right to use any material they provide.",
        "Delays in receiving content or feedback extend the timeline.",
      ],
    },
    {
      title: "11. Cancellation",
      body: [
        "Either party may end the project with written notice. Work completed up to that point is billed against the deposit.",
        "Website Care can be cancelled online from the client dashboard at any time. Cancellation takes effect at the end of the current billing month, or at the end of the three-month minimum if that comes later. No further monthly charges are made after that date.",
      ],
    },
    {
      title: "12. Refunds",
      body: [
        "The deposit reserves Fluxline's time and covers work as it begins. If the project is cancelled before design work starts, the deposit is refunded less any third-party costs already incurred. After design work starts, the deposit is non-refundable.",
        "Final balance and Website Care payments cover work already delivered and are not refundable, except where required by law or approved by Fluxline in writing.",
        "Approved refunds are returned to the original payment method through Stripe.",
      ],
    },
    {
      title: "13. Data handling",
      body: [
        "Fluxline collects the information needed to deliver the project and bill for it: contact details, project materials, and payment records from Stripe. It is used only for this work and is not sold.",
        "Project materials are stored securely and are accessible to the client and to authorized Fluxline staff only. The client can ask for copies or deletion of their materials, subject to records Fluxline must keep for tax and accounting.",
      ],
    },
    {
      title: "14. Migration and termination",
      body: [
        "If Website Care ends, Fluxline will, on request, provide the website's files and content and reasonable help moving it to a host of the client's choice, after any outstanding balance is paid. Extensive migration work is quoted separately.",
        "Fluxline may suspend hosting for unpaid invoices after written notice, and will not delete the website or its content without giving the client a reasonable opportunity to retrieve it.",
      ],
    },
  ],
};

export const WEBSITE_CARE_TERMS: AgreementDocument = {
  kind: "website_care",
  title: "Website Care Plan: Recurring Billing Terms",
  version: "2026-10-09-template-1",
  status: "draft",
  sections: [
    {
      title: "What you're authorizing",
      body: [
        "A monthly charge for Website Care at the price shown, billed automatically to the payment method you provide in Stripe Checkout, starting today and renewing every month on the same date until you cancel.",
        "There is no annual option, and the price will not change without at least 30 days' notice by email.",
      ],
    },
    {
      title: "Minimum term",
      body: ["Website Care has a three-month minimum from today. After that it continues month to month."],
    },
    {
      title: "How to cancel",
      body: [
        "Cancel any time from your client dashboard with one click, or by emailing Fluxline. Cancellation takes effect at the end of the current billing month, or at the end of the three-month minimum if that comes later, and no further charges are made after that date. You'll get an email confirming the cancellation and its effective date.",
      ],
    },
    {
      title: "Receipts, failed payments, and changes",
      body: [
        "Stripe emails a receipt for every charge. You can update your card and see every invoice in the billing portal linked from your dashboard.",
        "If a payment fails, Stripe retries it and you'll be emailed a link to update your payment method.",
      ],
    },
  ],
};

/** The exact text that was presented, used to hash and record acceptances. */
export function agreementText(doc: AgreementDocument) {
  return [doc.title, `Version ${doc.version}`, ...doc.sections.flatMap((section) => [section.title, ...section.body])].join("\n");
}
