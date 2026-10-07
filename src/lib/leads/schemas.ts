import { z } from "zod";
import {
  attributionSchema,
  businessEmail,
  businessName,
  choice,
  message,
  optionalChoice,
  personName,
  phoneOptional,
  phoneRequired,
  websiteOptional,
  websiteRequired,
} from "./fields";

export const BUSINESS_TYPES = [
  "home-services",
  "restaurant",
  "beauty-wellness",
  "automotive",
  "professional-services",
  "retail",
  "other",
] as const;

export const BUSINESS_TYPE_LABELS: Record<(typeof BUSINESS_TYPES)[number], string> = {
  "home-services": "Home Services",
  restaurant: "Restaurant / Hospitality",
  "beauty-wellness": "Beauty / Wellness",
  automotive: "Automotive",
  "professional-services": "Professional Services",
  retail: "Retail",
  other: "Other",
};

export const PROJECT_TYPES = ["new-website", "redesign", "not-sure"] as const;
export const PROJECT_TYPE_LABELS: Record<(typeof PROJECT_TYPES)[number], string> = {
  "new-website": "New Website",
  redesign: "Website Redesign",
  "not-sure": "Not Sure Yet",
};

export const PREFERRED_TIMES = ["morning", "afternoon", "evening"] as const;
export const PREFERRED_TIME_LABELS: Record<(typeof PREFERRED_TIMES)[number], string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

export const requestCallSchema = z.object({
  firstName: personName("First name"),
  lastName: personName("Last name"),
  businessName,
  website: websiteOptional,
  email: businessEmail,
  phone: phoneRequired,
  businessType: choice(BUSINESS_TYPES, "Please choose your type of business."),
  projectType: choice(PROJECT_TYPES, "Please choose what you're looking for."),
  preferredTime: optionalChoice(PREFERRED_TIMES, "Please choose morning, afternoon, or evening."),
  message,
  attribution: attributionSchema,
});

export const websiteCheckSchema = z.object({
  website: websiteRequired,
  businessName,
  businessType: choice(BUSINESS_TYPES, "Please choose your type of business."),
  firstName: personName("First name"),
  email: businessEmail,
  phone: phoneOptional,
  attribution: attributionSchema,
});

export type RequestCall = z.output<typeof requestCallSchema>;
export type WebsiteCheck = z.output<typeof websiteCheckSchema>;

export const HONEYPOT_FIELD = "company_url";
export const STARTED_AT_FIELD = "startedAt";

export type LeadResponse =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export function firstFieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && key !== "attribution" && !result[key]) result[key] = issue.message;
  }
  return result;
}
