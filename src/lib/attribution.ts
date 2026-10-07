/**
 * First-touch attribution captured in the browser and sent with lead forms.
 * Stored in localStorage for 30 days so a visitor who arrives from a cold email and
 * comes back later is still attributed correctly. Contains no personal data.
 */

export const ATTRIBUTION_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "referrer",
  "landing_page",
] as const;

export type AttributionField = (typeof ATTRIBUTION_FIELDS)[number];
export type Attribution = Partial<Record<AttributionField, string>>;

const STORAGE_KEY = "fl_attribution";
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_VALUE_LENGTH = 300;

type Stored = { capturedAt: number; data: Attribution };

function read(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (!parsed?.capturedAt || Date.now() - parsed.capturedAt > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function write(data: Attribution) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ capturedAt: Date.now(), data } satisfies Stored));
  } catch {
    // Storage can be unavailable (private mode, blocked site data); attribution is best-effort.
  }
}

const clip = (value: string) => value.slice(0, MAX_VALUE_LENGTH);

/** Call once per page load. Keeps the first touch unless a new campaign (UTM/gclid) arrives. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const campaign: Attribution = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid"] as const) {
    const value = params.get(key);
    if (value) campaign[key] = clip(value);
  }

  const existing = read();
  const hasNewCampaign = Object.keys(campaign).length > 0;
  if (existing && !hasNewCampaign) return;

  let referrer = "";
  try {
    if (document.referrer && new URL(document.referrer).host !== window.location.host) referrer = clip(document.referrer);
  } catch {
    referrer = "";
  }

  write({
    ...campaign,
    ...(referrer ? { referrer } : {}),
    landing_page: clip(window.location.pathname + window.location.search),
  });
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return read()?.data ?? {};
}
