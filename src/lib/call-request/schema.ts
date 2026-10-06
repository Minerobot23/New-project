import { z } from "zod";

/**
 * Single source of truth for the call-request form.
 * Imported by the client form (for usability) and the API route (authoritative).
 */

export const PREFERRED_TIMES = ["morning", "afternoon", "evening"] as const;
export type PreferredTime = (typeof PREFERRED_TIMES)[number];

export const PREFERRED_TIME_LABELS: Record<PreferredTime, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export const LIMITS = {
  name: 60,
  company: 120,
  email: 254,
  phone: 30,
  message: 1000,
} as const;

// Strip ASCII control characters (keeps tab/newline for the free-text message only).
const stripControl = (value: string) => value.replace(/[\u0000-\u001F\u007F]/g, " ");
const stripControlKeepNewlines = (value: string) =>
  value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n");

const singleLine = (label: string, max: number) =>
  z
    .string({ error: `${label} is required.` })
    .transform((value) => stripControl(value).replace(/\s+/g, " ").trim())
    .pipe(
      z
        .string()
        .min(1, `${label} is required.`)
        .max(max, `${label} must be ${max} characters or fewer.`),
    );

const personName = (label: string) =>
  singleLine(label, LIMITS.name).refine(
    (value) => !/[<>{}\[\]\\/@]|https?:|www\./i.test(value),
    `Please enter a valid ${label.toLowerCase()}.`,
  );

export const countDigits = (value: string) => value.replace(/\D/g, "").length;

export const callRequestSchema = z.object({
  firstName: personName("First name"),
  lastName: personName("Last name"),
  company: singleLine("Company", LIMITS.company).refine(
    (value) => !/[<>{}]|https?:\/\//i.test(value),
    "Please enter a valid company name.",
  ),
  email: singleLine("Business email", LIMITS.email).pipe(
    z.email("Please enter a valid email address."),
  ),
  phone: singleLine("Phone number", LIMITS.phone)
    .refine((value) => /^[+\d().\-\s]+$/.test(value), "Please enter a valid phone number.")
    .refine((value) => {
      const digits = countDigits(value);
      return digits >= 10 && digits <= 15;
    }, "Please enter a valid phone number, including area code."),
  preferredTime: z
    .union([z.enum(PREFERRED_TIMES), z.literal("")], { error: "Please choose morning, afternoon, or evening." })
    .optional()
    .transform((value) => (value ? value : undefined)),
  message: z
    .string()
    .optional()
    .transform((value) => (value ? stripControlKeepNewlines(value).trim() : ""))
    .pipe(z.string().max(LIMITS.message, `Please keep this under ${LIMITS.message} characters.`)),
});

export type CallRequestInput = z.input<typeof callRequestSchema>;
export type CallRequest = z.output<typeof callRequestSchema>;
export type CallRequestField = keyof CallRequestInput;

/** Anti-abuse fields that travel with the form but are not part of the lead. */
export const HONEYPOT_FIELD = "website";
export const STARTED_AT_FIELD = "startedAt";

export type CallRequestResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<CallRequestField, string>> };

export function firstFieldErrors(error: z.ZodError): Partial<Record<CallRequestField, string>> {
  const result: Partial<Record<CallRequestField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as CallRequestField | undefined;
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
}
