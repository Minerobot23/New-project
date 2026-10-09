import { z } from "zod";
import { ATTRIBUTION_FIELDS } from "@/lib/attribution";

/** Reusable, sanitizing field validators shared by every lead form (client and server). */

export const LIMITS = {
  name: 60,
  business: 120,
  email: 254,
  phone: 30,
  url: 300,
  message: 1000,
} as const;

// Strip ASCII control characters; the free-text variant keeps newlines.
const stripControl = (value: string) => value.replace(/[\u0000-\u001F\u007F]/g, " ");
const stripControlKeepNewlines = (value: string) =>
  value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\r\n?/g, "\n");

const clean = (value: unknown) =>
  typeof value === "string" ? stripControl(value).replace(/\s+/g, " ").trim() : value;

export const singleLine = (label: string, max: number) =>
  z.preprocess(
    clean,
    z
      .string({ error: `${label} is required.` })
      .min(1, `${label} is required.`)
      .max(max, `${label} must be ${max} characters or fewer.`),
  );

export const personName = (label: string) =>
  singleLine(label, LIMITS.name).refine(
    (value) => !/[<>{}[\]\\/@]|https?:|www\./i.test(value),
    `Please enter a valid ${label.toLowerCase()}.`,
  );

export const businessName = singleLine("Business name", LIMITS.business).refine(
  (value) => !/[<>{}]|https?:\/\//i.test(value),
  "Please enter a valid business name.",
);

export const businessEmail = singleLine("Business email", LIMITS.email).pipe(
  z.email("Please enter a valid email address."),
);

/** Email is optional on the call request: a phone number is enough to call someone back. */
export const emailOptional = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : clean(value)),
  z.string().max(LIMITS.email).pipe(z.email("Please enter a valid email address.")).optional(),
);

export const countDigits = (value: string) => value.replace(/\D/g, "").length;

const phoneRules = (schema: z.ZodType<string>) =>
  schema
    .refine((value) => /^[+\d().\-\s]+$/.test(value), "Please enter a valid phone number.")
    .refine((value) => {
      const digits = countDigits(value);
      return digits >= 10 && digits <= 15;
    }, "Please enter a valid phone number, including area code.");

export const phoneRequired = phoneRules(singleLine("Phone number", LIMITS.phone));

export const phoneOptional = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : clean(value)),
  phoneRules(z.string().max(LIMITS.phone)).optional(),
);

/** Accepts "example.com" or a full URL; returns a normalized https:// URL. */
export function normalizeWebsite(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withScheme);
    if (!/^https?:$/.test(url.protocol)) return null;
    if (!url.hostname.includes(".") || url.hostname.endsWith(".")) return null;
    if (url.username || url.password) return null;
    return url.toString();
  } catch {
    return null;
  }
}

const websiteRule = (value: string) => normalizeWebsite(value) !== null;
const WEBSITE_ERROR = "Please enter a valid website address, like yourbusiness.com.";

export const websiteRequired = singleLine("Website", LIMITS.url)
  .refine(websiteRule, WEBSITE_ERROR)
  .transform((value) => normalizeWebsite(value) as string);

export const websiteOptional = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : clean(value)),
  z
    .string()
    .max(LIMITS.url)
    .refine(websiteRule, WEBSITE_ERROR)
    .transform((value) => normalizeWebsite(value) as string)
    .optional(),
);

export const message = z.preprocess(
  (value) => (typeof value === "string" ? stripControlKeepNewlines(value).trim() : ""),
  z.string().max(LIMITS.message, `Please keep this under ${LIMITS.message} characters.`),
);

/** Enumerated choice that tolerates an empty selection when optional. */
export const choice = <T extends readonly [string, ...string[]]>(values: T, error: string) =>
  z.enum(values, { error });

export const optionalChoice = <T extends readonly [string, ...string[]]>(values: T, error: string) =>
  z.preprocess((value) => (value === "" ? undefined : value), z.enum(values, { error }).optional());

/** Attribution travels with the form; values are clipped and sanitized, never trusted. */
const attributionValue = z.preprocess(
  (value) => (typeof value === "string" ? clean(value) : undefined),
  z.string().max(300).optional(),
);

export const attributionSchema = z
  .object({
    utm_source: attributionValue,
    utm_medium: attributionValue,
    utm_campaign: attributionValue,
    utm_content: attributionValue,
    utm_term: attributionValue,
    gclid: attributionValue,
    referrer: attributionValue,
    landing_page: attributionValue,
  } satisfies Record<(typeof ATTRIBUTION_FIELDS)[number], unknown>)
  .optional()
  .catch(undefined);
