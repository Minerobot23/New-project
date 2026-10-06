import "server-only";
import { PREFERRED_TIME_LABELS, type CallRequest } from "./schema";
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

/** Submissions clearly marked as test data get a [TEST] subject prefix so they're easy to filter out. */
export const isTestSubmission = (lead: CallRequest) =>
  [lead.firstName, lead.lastName, lead.company].some((value) => /\btest\b/i.test(value));

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

export function buildCallRequestEmail(lead: CallRequest, recipients: string[], submittedAt = new Date()): OutgoingEmail {
  const name = `${lead.firstName} ${lead.lastName}`;
  const preferredTime = lead.preferredTime ? PREFERRED_TIME_LABELS[lead.preferredTime] : "No preference";
  const message = lead.message || "—";
  const submitted = formatSubmitted(submittedAt);
  const subject = `${isTestSubmission(lead) ? "[TEST] " : ""}New Fluxline Call Request — ${lead.company}`;

  const text = [
    "NEW FLUXLINE CALL REQUEST",
    "",
    `Name: ${name}`,
    `Company: ${lead.company}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Preferred Time: ${preferredTime}`,
    `Message: ${message}`,
    `Submitted: ${submitted}`,
  ].join("\n");

  const row = (label: string, valueHtml: string) => `
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #e4e4de;">
              <div style="font-size:12px;line-height:16px;color:#5c6670;text-transform:uppercase;letter-spacing:0.08em;">${label}</div>
              <div style="margin-top:4px;font-size:17px;line-height:24px;color:#0f1a24;">${valueHtml}</div>
            </td>
          </tr>`;

  const linkStyle = "color:#0e6b5c;text-decoration:underline;";
  const telHref = toTelHref(lead.phone);
  const mailHref = `mailto:${encodeURIComponent(lead.email).replace(/%40/g, "@")}`;

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
                <div style="font-size:12px;font-weight:600;letter-spacing:0.12em;color:#0e6b5c;">NEW FLUXLINE CALL REQUEST</div>
                <div style="margin-top:6px;font-size:22px;line-height:28px;font-weight:600;color:#0f1a24;">${escapeHtml(name)}</div>
                <div style="font-size:15px;line-height:22px;color:#3b4652;">${escapeHtml(lead.company)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 20px 4px 20px;">
                <a href="${escapeHtml(telHref)}" style="display:block;background:#0e6b5c;color:#ffffff;text-decoration:none;text-align:center;font-size:17px;font-weight:600;line-height:24px;padding:14px 16px;border-radius:6px;">Call ${escapeHtml(lead.phone)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 20px 12px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${row("Name", escapeHtml(name))}
${row("Company", escapeHtml(lead.company))}
${row("Email", `<a href="${escapeHtml(mailHref)}" style="${linkStyle}">${escapeHtml(lead.email)}</a>`)}
${row("Phone", `<a href="${escapeHtml(telHref)}" style="${linkStyle}">${escapeHtml(lead.phone)}</a>`)}
${row("Preferred Time", escapeHtml(preferredTime))}
${row("Message", escapeHtml(message).replace(/\n/g, "<br />"))}
${row("Submitted", escapeHtml(submitted))}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 20px 20px 20px;font-size:13px;line-height:18px;color:#5c6670;">
                Sent from the call request form on fluxlinesolutions.com. Replying to this email replies to the prospect.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { to: recipients, subject, html, text, replyTo: lead.email };
}
