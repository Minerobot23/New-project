import "server-only";
import type { Attribution } from "@/lib/attribution";
import type { OutgoingEmail } from "@/lib/email";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Keeps a leading "+" and digits only, which is what tel: links expect. */
const toTelHref = (phone: string) => {
  const trimmed = phone.trim();
  return `tel:${trimmed.startsWith("+") ? "+" : ""}${trimmed.replace(/\D/g, "")}`;
};

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

/** Best-effort channel label so leads from search, ads, outreach, and referrals can be told apart. */
export function classifyChannel(attribution: Attribution | undefined): string {
  const a = attribution ?? {};
  const source = (a.utm_source ?? "").toLowerCase();
  const medium = (a.utm_medium ?? "").toLowerCase();
  const referrerHost = a.referrer ? hostOf(a.referrer) : "";

  if (a.gclid || (source === "google" && /^(cpc|ppc|paid|paidsearch)$/.test(medium))) return "Google Ads";
  if (/^(cpc|ppc|paid|paidsearch|display|paid_social)$/.test(medium)) return `Paid (${source || "unknown source"})`;
  if (medium === "email" || /email|outreach|cold/.test(source)) return "Email outreach";
  if (/call|phone/.test(medium) || /call/.test(source)) return "Call follow-up";
  if (medium === "social" || /facebook|instagram|linkedin|tiktok|twitter|x\.com/.test(source)) return "Social";
  if (source) return `Campaign (${source}${medium ? ` / ${medium}` : ""})`;
  if (/(^|\.)google\./.test(referrerHost)) return "Google organic";
  if (/(^|\.)(bing|duckduckgo|yahoo)\./.test(referrerHost)) return "Other search (organic)";
  if (/facebook|instagram|linkedin|t\.co|twitter|tiktok/.test(referrerHost)) return "Social (referral)";
  if (referrerHost) return `Referral (${referrerHost})`;
  return "Direct / unknown";
}

function formatSubmitted(date: Date) {
  const timeZone = process.env.LEAD_NOTIFICATION_TIMEZONE || "UTC";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone,
      timeZoneName: "short",
    }).format(date);
  } catch {
    return date.toUTCString();
  }
}

export type LeadRow = { label: string; value: string; href?: string };

type LeadEmailInput = {
  heading: string;
  subject: string;
  primaryName: string;
  businessName: string;
  rows: LeadRow[];
  phone?: string;
  /** The prospect's email, when they gave one. */
  replyTo?: string;
  recipients: string[];
  attribution?: Attribution;
  isTest?: boolean;
  submittedAt?: Date;
};

export const mailtoHref = (email: string) => `mailto:${encodeURIComponent(email).replace(/%40/g, "@")}`;
export const telHref = toTelHref;

/** Submissions clearly marked as test data get a [TEST] subject prefix so they're easy to filter out. */
export const looksLikeTest = (...values: Array<string | undefined>) =>
  values.some((value) => value && /\btest\b/i.test(value));

export function buildLeadEmail(input: LeadEmailInput): OutgoingEmail {
  const submitted = formatSubmitted(input.submittedAt ?? new Date());
  const subject = `${input.isTest ? "[TEST] " : ""}${input.subject}`;
  const a = input.attribution ?? {};
  const attributionRows: LeadRow[] = [
    { label: "Channel", value: classifyChannel(a) },
    ...(
      [
        ["utm_source", "UTM Source"],
        ["utm_medium", "UTM Medium"],
        ["utm_campaign", "UTM Campaign"],
        ["utm_content", "UTM Content"],
        ["utm_term", "UTM Term"],
        ["gclid", "Google Click ID"],
        ["referrer", "Referrer"],
        ["landing_page", "Landing Page"],
      ] as const
    )
      .filter(([key]) => a[key])
      .map(([key, label]) => ({ label, value: a[key] as string })),
  ];

  const allRows = [...input.rows, { label: "Submitted", value: submitted }];

  const text = [
    input.heading,
    "",
    ...allRows.map((row) => `${row.label}: ${row.value || "—"}`),
    "",
    "SOURCE",
    ...attributionRows.map((row) => `${row.label}: ${row.value}`),
  ].join("\n");

  const linkStyle = "color:#1d5bd8;text-decoration:underline;";
  const renderRow = (row: LeadRow, small = false) => `
          <tr>
            <td style="padding:${small ? "8px" : "12px"} 0;border-bottom:1px solid #e4e4de;">
              <div style="font-size:12px;line-height:16px;color:#5c6670;text-transform:uppercase;letter-spacing:0.08em;">${escapeHtml(row.label)}</div>
              <div style="margin-top:4px;font-size:${small ? "14px" : "17px"};line-height:${small ? "20px" : "24px"};color:#0f1a24;word-break:break-word;">${
                row.href
                  ? `<a href="${escapeHtml(row.href)}" style="${linkStyle}">${escapeHtml(row.value)}</a>`
                  : escapeHtml(row.value || "—").replace(/\n/g, "<br />")
              }</div>
            </td>
          </tr>`;

  const callButton = input.phone
    ? `
            <tr>
              <td style="padding:16px 20px 4px 20px;">
                <a href="${escapeHtml(toTelHref(input.phone))}" style="display:block;background:#1d5bd8;color:#ffffff;text-decoration:none;text-align:center;font-size:17px;font-weight:600;line-height:24px;padding:14px 16px;border-radius:6px;">Call ${escapeHtml(input.phone)}</a>
              </td>
            </tr>`
    : !input.replyTo
      ? ""
      : `
            <tr>
              <td style="padding:16px 20px 4px 20px;">
                <a href="${escapeHtml(mailtoHref(input.replyTo))}" style="display:block;background:#1d5bd8;color:#ffffff;text-decoration:none;text-align:center;font-size:17px;font-weight:600;line-height:24px;padding:14px 16px;border-radius:6px;">Email ${escapeHtml(input.replyTo)}</a>
              </td>
            </tr>`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f3ef;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3ef;">
      <tr>
        <td align="center" style="padding:16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e4e4de;border-radius:8px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
            <tr>
              <td style="padding:20px 20px 4px 20px;">
                <div style="font-size:12px;font-weight:600;letter-spacing:0.12em;color:#1d5bd8;">${escapeHtml(input.heading)}</div>
                <div style="margin-top:6px;font-size:22px;line-height:28px;font-weight:600;color:#0f1a24;">${escapeHtml(input.businessName)}</div>
                <div style="font-size:15px;line-height:22px;color:#3b4652;">${escapeHtml(input.primaryName)}</div>
              </td>
            </tr>${callButton}
            <tr>
              <td style="padding:0 20px 12px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${allRows.map((row) => renderRow(row)).join("\n")}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 20px 4px 20px;font-size:12px;font-weight:600;letter-spacing:0.12em;color:#5c6670;">SOURCE</td>
            </tr>
            <tr>
              <td style="padding:0 20px 12px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${attributionRows.map((row) => renderRow(row, true)).join("\n")}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 20px 20px 20px;font-size:13px;line-height:18px;color:#5c6670;">
                Sent from fluxlinesolutions.com. ${input.replyTo ? "Replying to this email replies to the prospect." : "No email address was provided: call the number above."}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { to: input.recipients, subject, html, text, replyTo: input.replyTo };
}
