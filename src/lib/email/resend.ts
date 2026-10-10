import "server-only";
import type { EmailProvider, OutgoingEmail, SendOptions } from "./types";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/** Resend transactional email over its REST API (no SDK dependency). */
export function createResendProvider(apiKey: string, from: string): EmailProvider {
  return {
    name: "resend",
    async send(email: OutgoingEmail, options?: SendOptions) {
      const response = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          ...(options?.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey.slice(0, 256) } : {}),
        },
        body: JSON.stringify({
          from,
          to: email.to,
          subject: email.subject,
          html: email.html,
          text: email.text,
          ...(email.replyTo ? { reply_to: email.replyTo } : {}),
        }),
        signal: AbortSignal.timeout(10_000),
        cache: "no-store",
      });

      if (!response.ok) {
        // Resend error bodies describe the failure (e.g. unverified domain) without echoing message content.
        const detail = await response.text().catch(() => "");
        throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 300)}`);
      }
      const body = (await response.json().catch(() => ({}))) as { id?: string };
      return { id: body.id };
    },
  };
}
