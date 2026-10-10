export type OutgoingEmail = {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendOptions = {
  /** The provider drops a second send with the same key (Resend keeps keys for 24 hours). */
  idempotencyKey?: string;
};

export type SendResult = { id?: string };

export interface EmailProvider {
  readonly name: string;
  send(email: OutgoingEmail, options?: SendOptions): Promise<SendResult | void>;
}

export class EmailConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailConfigError";
  }
}
