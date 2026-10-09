/** The onboarding questionnaire. Answers are stored per project as { [field name]: string }. */

export type OnboardingField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "url" | "textarea";
  max: number;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
};

export type OnboardingSection = { id: string; title: string; intro?: string; fields: OnboardingField[] };

export const ONBOARDING_SECTIONS: OnboardingSection[] = [
  {
    id: "business",
    title: "Your business",
    fields: [
      { name: "businessName", label: "Business name", type: "text", max: 160, required: true, autoComplete: "organization" },
      { name: "industry", label: "Industry", type: "text", max: 120, required: true, hint: "For example: roofing, restaurant, salon, accounting." },
      { name: "contactName", label: "Main contact", type: "text", max: 120, required: true, autoComplete: "name" },
      { name: "contactEmail", label: "Contact email", type: "email", max: 200, required: true, autoComplete: "email" },
      { name: "contactPhone", label: "Contact phone", type: "tel", max: 40, required: true, autoComplete: "tel" },
      { name: "publicDetails", label: "Details to show on the website", type: "textarea", max: 1000, hint: "Phone, email, address, hours, and service area, exactly as customers should see them." },
    ],
  },
  {
    id: "current-site",
    title: "Your current website",
    fields: [
      { name: "existingSite", label: "Existing website address", type: "url", max: 300, hint: "Leave blank if you don't have one." },
      { name: "existingSiteNotes", label: "What works, and what doesn't?", type: "textarea", max: 2000 },
    ],
  },
  {
    id: "content",
    title: "Pages, services, and audience",
    fields: [
      { name: "desiredPages", label: "Pages you want", type: "textarea", max: 2000, required: true, hint: "For example: Home, About, Services, Gallery, Contact." },
      { name: "services", label: "Services you offer", type: "textarea", max: 4000, required: true, hint: "List each service, with a sentence or two on each if you can." },
      { name: "targetAudience", label: "Who are your customers?", type: "textarea", max: 2000, required: true, hint: "Who they are, where they are, and what they usually need." },
    ],
  },
  {
    id: "design",
    title: "Design and brand",
    intro: "Upload your logo and any photos in the Files section below.",
    fields: [
      { name: "designPreferences", label: "Design preferences", type: "textarea", max: 2000, hint: "Styles you like or dislike: modern, classic, bold, minimal, dark, light…" },
      { name: "brandColors", label: "Brand colors", type: "text", max: 300, hint: "Color names or hex codes, for example navy and #F5A623." },
    ],
  },
  {
    id: "inspiration",
    title: "Competitors and inspiration",
    fields: [
      { name: "competitors", label: "Competitors", type: "textarea", max: 2000, hint: "Names or website addresses." },
      { name: "inspirationSites", label: "Websites you like", type: "textarea", max: 2000, hint: "Addresses, and what you like about each." },
    ],
  },
  {
    id: "extras",
    title: "Features and notes",
    fields: [
      { name: "specialFeatures", label: "Special features", type: "textarea", max: 2000, hint: "Online booking, quote requests, menus, galleries, integrations…" },
      { name: "notes", label: "Anything else we should know", type: "textarea", max: 4000 },
    ],
  },
];

export const ONBOARDING_FIELDS = ONBOARDING_SECTIONS.flatMap((section) => section.fields);

export type OnboardingAnswers = Record<string, string>;

/** Keeps only known fields, trimmed and capped; reports missing required fields when submitting. */
export function cleanOnboarding(input: Record<string, unknown>, { submitting }: { submitting: boolean }) {
  const data: OnboardingAnswers = {};
  const errors: Record<string, string> = {};
  for (const field of ONBOARDING_FIELDS) {
    const raw = input[field.name];
    const value = typeof raw === "string" ? raw.trim().slice(0, field.max) : "";
    if (value) data[field.name] = value;
    if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[field.name] = "Enter a valid email address.";
    if (field.type === "url" && value && !/^(https?:\/\/)?[^\s.]+\.[^\s]+$/i.test(value)) errors[field.name] = "Enter a website address, like example.com.";
    if (submitting && field.required && !value) errors[field.name] = "Required before you submit.";
  }
  return { data, errors };
}

export function onboardingProgress(data: OnboardingAnswers) {
  const required = ONBOARDING_FIELDS.filter((field) => field.required);
  const done = required.filter((field) => data[field.name]).length;
  return { done, total: required.length };
}
