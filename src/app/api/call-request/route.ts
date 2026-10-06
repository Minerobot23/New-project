import { NextResponse, type NextRequest } from "next/server";
import {
  HONEYPOT_FIELD,
  STARTED_AT_FIELD,
  callRequestSchema,
  firstFieldErrors,
  type CallRequestResponse,
} from "@/lib/call-request/schema";
import { buildCallRequestEmail } from "@/lib/call-request/notification-email";
import { EmailConfigError, getEmailProvider, getLeadRecipients } from "@/lib/email";
import { createRateLimiter } from "@/lib/rate-limit";
import { site } from "@/lib/site";

const MAX_BODY_BYTES = 8 * 1024;
const MIN_FILL_TIME_MS = 2_500;
const limiter = createRateLimiter({ limit: 8, windowMs: 10 * 60 * 1000 });

const FALLBACK_ERROR = `Something went wrong sending your request. Please try again, or email ${site.contact.email}.`;

const json = (body: CallRequestResponse, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Rejects cross-site posts: browsers always send Origin on fetch POSTs. */
function isSameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return json({ ok: false, error: "Invalid request." }, 403);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Invalid request." }, 415);
  }

  const rate = limiter(clientIp(request));
  if (!rate.allowed) {
    return json(
      { ok: false, error: "Too many requests. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(rate.retryAfterSeconds) },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Request is too large." }, 413);
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  // Bot traps. Respond as if successful so automated submitters get no signal.
  const honeypot = body[HONEYPOT_FIELD];
  const startedAt = Number(body[STARTED_AT_FIELD]);
  const filledTooFast = !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_TIME_MS;
  if ((typeof honeypot === "string" && honeypot.trim() !== "") || filledTooFast) {
    return json({ ok: true });
  }

  const result = callRequestSchema.safeParse(body);
  if (!result.success) {
    return json(
      { ok: false, error: "Please correct the highlighted fields.", fieldErrors: firstFieldErrors(result.error) },
      422,
    );
  }

  const lead = result.data;
  if ((lead.message.match(/https?:\/\//gi) ?? []).length > 2) {
    return json({ ok: true });
  }

  try {
    const provider = getEmailProvider();
    await provider.send(buildCallRequestEmail(lead, getLeadRecipients()));
  } catch (error) {
    // Log the failure reason only; never the lead's details.
    const reason = error instanceof Error ? error.message : "unknown error";
    console.error(`[call-request] ${error instanceof EmailConfigError ? "Email not configured" : "Delivery failed"}: ${reason}`);
    return json({ ok: false, error: FALLBACK_ERROR }, 502);
  }

  return json({ ok: true });
}
