import { formatCents } from "@/lib/billing/plans";
import { site } from "@/lib/site";

/*
 * Fluxline-branded transactional emails. Plain, table-based HTML with inline styles (what email clients
 * render reliably) plus a text version. Every interpolated value is escaped.
 */

export type Rendered = { subject: string; html: string; text: string };

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

type Block = { kind: "p"; text: string } | { kind: "button"; label: string; href: string } | { kind: "rows"; rows: [string, string][] } | { kind: "note"; text: string };

function layout(subject: string, heading: string, blocks: Block[]): Rendered {
  const htmlBlocks = blocks
    .map((block) => {
      switch (block.kind) {
        case "p":
          return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3a3a37">${esc(block.text)}</p>`;
        case "note":
          return `<p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:#64645f">${esc(block.text)}</p>`;
        case "button":
          return `<p style="margin:24px 0"><a href="${esc(block.href)}" style="display:inline-block;background:#1d4fd8;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 24px">${esc(block.label)}</a></p>`;
        case "rows":
          return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 20px;border-top:1px solid #d6d6d0">${block.rows
            .map(
              ([label, value]) =>
                `<tr><td style="padding:10px 0;border-bottom:1px solid #d6d6d0;font-size:14px;color:#64645f">${esc(label)}</td><td align="right" style="padding:10px 0;border-bottom:1px solid #d6d6d0;font-size:14px;color:#0e0e0d;font-weight:600">${esc(value)}</td></tr>`,
            )
            .join("")}</table>`;
      }
    })
    .join("");
  const html = `<!doctype html><html><body style="margin:0;background:#f4f4f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f1"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff">
<tr><td style="background:#0e0e0d;padding:22px 32px"><span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:0.02em">FLUX<span style="color:#7fa6ff">LINE</span></span><span style="display:block;color:#b9b9b2;font-size:9px;letter-spacing:0.5em;margin-top:2px">SOLUTIONS</span></td></tr>
<tr><td style="padding:32px">
<h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;color:#0e0e0d">${esc(heading)}</h1>
${htmlBlocks}
</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #e9e9e4;font-size:12px;line-height:1.6;color:#64645f">Fluxline Solutions · ${esc(site.contact.email)}<br/>You're receiving this because of your website project with Fluxline Solutions.</td></tr>
</table></td></tr></table></body></html>`;
  const text = [
    heading,
    "",
    ...blocks.flatMap((block) => {
      switch (block.kind) {
        case "p":
        case "note":
          return [block.text, ""];
        case "button":
          return [`${block.label}: ${block.href}`, ""];
        case "rows":
          return [...block.rows.map(([label, value]) => `${label}: ${value}`), ""];
      }
    }),
    `Fluxline Solutions · ${site.contact.email}`,
  ].join("\n");
  return { subject, html, text };
}

const STATUS_LABELS: Record<string, string> = {
  deposit_pending: "Deposit pending",
  deposit_paid: "Deposit paid",
  onboarding: "Onboarding",
  in_development: "In development",
  client_review: "Ready for your review",
  final_payment_pending: "Final payment pending",
  ready_for_launch: "Ready for launch",
  live: "Live",
  maintenance_active: "Website Care active",
};
export const statusLabel = (status: string) => STATUS_LABELS[status] ?? status;

export const templates = {
  signInLink: (d: { link: string; minutes: number }) =>
    layout("Your Fluxline sign-in link", "Sign in to Fluxline", [
      { kind: "p", text: "Use the button below to sign in. The link works once." },
      { kind: "button", label: "Sign in", href: d.link },
      { kind: "note", text: `It expires in ${d.minutes} minutes. If you didn't ask to sign in, you can ignore this email.` },
    ]),

  depositConfirmation: (d: { name: string; planName: string; depositCents: number; balanceCents: number; monthlyCents: number }) =>
    layout(`Deposit received: ${d.planName} website`, `Thank you, ${d.name}. Your deposit is confirmed.`, [
      { kind: "p", text: "Stripe has confirmed your payment, and your project is now on our schedule." },
      {
        kind: "rows",
        rows: [
          ["Package", d.planName],
          ["Deposit paid", formatCents(d.depositCents)],
          ["Balance due before launch", formatCents(d.balanceCents)],
          ["Website Care after launch", `${formatCents(d.monthlyCents)}/month`],
        ],
      },
      { kind: "note", text: "Stripe sends a separate receipt. Website Care starts only after launch, and only after you approve it." },
    ]),

  onboardingInvitation: (d: { name: string; link: string; hours: number }) =>
    layout("Next step: tell us about your business", `Let's get started, ${d.name}.`, [
      { kind: "p", text: "The onboarding questionnaire covers your services, audience, design preferences, and brand assets. It takes about 15 minutes, and you can save your progress and come back." },
      { kind: "button", label: "Start onboarding", href: d.link },
      { kind: "note", text: `This secure link signs you in and works once within ${d.hours} hours. After that, request a new link from the sign-in page with this email address.` },
    ]),

  onboardingReminder: (d: { name: string; link: string }) =>
    layout("Reminder: your onboarding questionnaire", `A quick reminder, ${d.name}`, [
      { kind: "p", text: "We're ready to start on your website as soon as the onboarding questionnaire is complete. Anything you've already entered has been saved." },
      { kind: "button", label: "Continue onboarding", href: d.link },
    ]),

  statusUpdate: (d: { name: string; status: string; link: string }) =>
    layout(`Project update: ${statusLabel(d.status)}`, `Your project is now: ${statusLabel(d.status)}`, [
      { kind: "p", text: `Hi ${d.name}, here's the latest on your website project.` },
      { kind: "button", label: "View your project", href: d.link },
    ]),

  finalInvoice: (d: { name: string; amountCents: number; invoiceUrl: string; dueDate: string }) =>
    layout("Your final invoice is ready", "Your website is ready for launch", [
      { kind: "p", text: `Hi ${d.name}, the remaining balance on your website is due before launch.` },
      { kind: "rows", rows: [["Amount due", formatCents(d.amountCents)], ["Due date", d.dueDate]] },
      { kind: "button", label: "View and pay invoice", href: d.invoiceUrl },
      { kind: "note", text: "Payment is handled securely by Stripe." },
    ]),

  finalPaymentConfirmation: (d: { name: string; amountCents: number }) =>
    layout("Final payment received", `Thank you, ${d.name}. Your project is paid in full.`, [
      { kind: "rows", rows: [["Final payment", formatCents(d.amountCents)]] },
      { kind: "p", text: "Next we'll confirm launch details with you. Website Care starts only after you review and approve its monthly terms." },
    ]),

  launchConfirmation: (d: { name: string; link: string }) =>
    layout("Your website is live", `Congratulations, ${d.name}. Your website is live.`, [
      { kind: "p", text: "Thank you for building it with us. Your dashboard has your project details, invoices, and support." },
      { kind: "button", label: "Open your dashboard", href: d.link },
    ]),

  careInvitation: (d: { name: string; planName: string; monthlyCents: number; link: string }) =>
    layout("Activate your Website Care plan", `${d.name}, one last step before launch`, [
      { kind: "p", text: `Your ${d.planName} website includes the Website Care plan: hosting, updates, security, and support for ${formatCents(d.monthlyCents)} a month, with a three-month minimum.` },
      { kind: "p", text: "Review the monthly terms and authorize the payment method in your dashboard. Nothing is charged until you do." },
      { kind: "button", label: "Review Website Care terms", href: d.link },
    ]),

  subscriptionActivation: (d: { name: string; monthlyCents: number; minimumEnd: string; link: string }) =>
    layout("Website Care is active", `Website Care is active, ${d.name}`, [
      {
        kind: "rows",
        rows: [
          ["Monthly charge", formatCents(d.monthlyCents)],
          ["Minimum term ends", d.minimumEnd],
        ],
      },
      { kind: "p", text: "You can update your card, see invoices, or cancel from your dashboard at any time. Cancellation takes effect at the end of the billing month, or at the end of the minimum term if later." },
      { kind: "button", label: "Manage Website Care", href: d.link },
    ]),

  careCancellation: (d: { name: string; effectiveDate: string }) =>
    layout("Website Care cancellation confirmed", `Your cancellation is confirmed, ${d.name}`, [
      { kind: "p", text: `Website Care will end on ${d.effectiveDate}. There will be no further monthly charges after that date.` },
      { kind: "note", text: "Changed your mind? Reply to this email before that date." },
    ]),

  failedPayment: (d: { name: string; amountCents: number; link: string }) =>
    layout("Action needed: payment failed", `We couldn't process a payment, ${d.name}`, [
      { kind: "p", text: `A payment of ${formatCents(d.amountCents)} for your Fluxline account didn't go through. Stripe will retry automatically, but updating your payment method now avoids any interruption.` },
      { kind: "button", label: "Update payment method", href: d.link },
    ]),

  supportConfirmation: (d: { name: string; subject: string }) =>
    layout(`We received your request: ${d.subject}`, `Thanks, ${d.name}. We have your request.`, [
      { kind: "rows", rows: [["Subject", d.subject]] },
      { kind: "p", text: "We'll reply by email, usually within one business day." },
    ]),

  quote: (d: { name: string; scope: string; devPriceCents: number; depositCents: number; monthlyCents: number; link: string; expires: string }) =>
    layout("Your Fluxline Premium quote", `Your quote is ready, ${d.name}`, [
      { kind: "p", text: d.scope },
      {
        kind: "rows",
        rows: [
          ["Development fee", formatCents(d.devPriceCents)],
          ["Deposit (50%)", formatCents(d.depositCents)],
          ["Website Care after launch", `${formatCents(d.monthlyCents)}/month`],
        ],
      },
      { kind: "button", label: "Review quote and pay deposit", href: d.link },
      { kind: "note", text: `This quote is valid until ${d.expires}.` },
    ]),

  stepUpCode: (d: { code: string; minutes: number }) =>
    layout("Your Fluxline verification code", "Confirm it's you", [
      { kind: "p", text: "Enter this code in the admin dashboard to approve billing changes such as refunds and invoices." },
      { kind: "rows", rows: [["Verification code", d.code]] },
      { kind: "note", text: `It expires in ${d.minutes} minutes and works once. If you didn't request it, someone may be trying to use your account: change your email password.` },
    ]),

  adminAlert: (d: { title: string; lines: [string, string][]; link: string }) =>
    layout(`[Fluxline] ${d.title}`, d.title, [{ kind: "rows", rows: d.lines }, { kind: "button", label: "Open in admin", href: d.link }]),
} satisfies Record<string, (data: never) => Rendered>;

export type TemplateName = keyof typeof templates;
