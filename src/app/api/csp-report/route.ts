/*
 * Receives CSP violation reports (report-uri and the Reporting API). Logs only the directive, the blocked origin
 * and the page path: never query strings, which can hold sign-in or quote tokens. Always answers 204.
 */

const MAX_BYTES = 16_384;

type Violation = { directive?: string; blocked?: string; page?: string };

function originOnly(value: unknown) {
  if (typeof value !== "string" || !value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol.startsWith("http") ? url.origin : url.protocol;
  } catch {
    return value.slice(0, 40); // "inline", "eval", etc.
  }
}

function pathOnly(value: unknown) {
  if (typeof value !== "string") return undefined;
  try {
    return new URL(value).pathname.slice(0, 200);
  } catch {
    return undefined;
  }
}

function toViolation(report: Record<string, unknown>): Violation {
  return {
    directive: String(report["effective-directive"] ?? report.effectiveDirective ?? report["violated-directive"] ?? "").slice(0, 60),
    blocked: originOnly(report["blocked-uri"] ?? report.blockedURL),
    page: pathOnly(report["document-uri"] ?? report.documentURL),
  };
}

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BYTES) return new Response(null, { status: 204 });
  try {
    const text = await request.text();
    if (text.length > MAX_BYTES) return new Response(null, { status: 204 });
    const parsed: unknown = JSON.parse(text);
    const reports = Array.isArray(parsed)
      ? parsed.filter((entry) => entry?.type === "csp-violation").map((entry) => entry.body as Record<string, unknown>)
      : [((parsed as Record<string, unknown>)["csp-report"] ?? {}) as Record<string, unknown>];
    for (const report of reports.slice(0, 5)) {
      const violation = toViolation(report ?? {});
      console.warn(`[csp] ${violation.directive} blocked ${violation.blocked ?? "?"} on ${violation.page ?? "?"}`);
    }
  } catch {
    // Malformed reports are ignored.
  }
  return new Response(null, { status: 204 });
}
