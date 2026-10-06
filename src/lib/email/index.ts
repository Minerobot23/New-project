import "server-only";
import { createResendProvider } from "./resend";
import { EmailConfigError, type EmailProvider } from "./types";

export { EmailConfigError } from "./types";
export type { EmailProvider, OutgoingEmail } from "./types";

/**
 * Returns the configured transactional email provider.
 * To switch providers later, add a module beside resend.ts and select it here.
 */
export function getEmailProvider(): EmailProvider {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;

  if (apiKey && from) return createResendProvider(apiKey, from);

  if (process.env.NODE_ENV !== "production") {
    // Local development without credentials: print the message to the dev server console.
    return {
      name: "console",
      async send(email) {
        console.info(`[email:dev] To: ${email.to.join(", ")}\nSubject: ${email.subject}\n\n${email.text}`);
      },
    };
  }

  throw new EmailConfigError("RESEND_API_KEY and LEAD_FROM_EMAIL must be set.");
}

export function getLeadRecipients(): string[] {
  const raw = process.env.LEAD_NOTIFICATION_EMAIL ?? "";
  const recipients = raw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    if (process.env.NODE_ENV !== "production") return ["dev-inbox@localhost"];
    throw new EmailConfigError("LEAD_NOTIFICATION_EMAIL must be set.");
  }
  return recipients;
}
