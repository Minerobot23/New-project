import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import type { z } from "zod";
import { EmailConfigError, getEmailProvider, getLeadRecipients, type OutgoingEmail } from "@/lib/email";
import { getDb } from "@/lib/db";
import { RATE_LIMITS, checkRateLimits } from "@/lib/rate-limit";
import { clientIpFrom } from "@/lib/security";
import { site } from "@/lib/site";
import { HONEYPOT_FIELD, STARTED_AT_FIELD, firstFieldErrors, type LeadResponse } from "./schemas";

const MAX_BODY_BYTES = 12 * 1024;
const MIN_FILL_TIME_MS = 2_500;


const FALLBACK_ERROR = `Something went wrong sending your request. Please try again, or email ${site.contact.email}.`;

const json = (body: LeadResponse, status = 200, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

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

type Options<S extends z.ZodType> = {
  name: string;
  schema: S;
  buildEmail: (lead: z.output<S>, recipients: string[]) => OutgoingEmail;
  /** Extra content heuristics; return true to silently drop as spam. */
  isSpam?: (lead: z.output<S>) => boolean;
};

/**
 * Shared, defensive handler for every lead form:
 * same-origin + content-type checks, rate limiting, body size cap, honeypot and minimum
 * fill time (silent success for bots), schema validation, then email delivery.
 * Lead details are never logged.
 */
export async function handleLead<S extends z.ZodType>(request: NextRequest, options: Options<S>) {
  if (!isSameOrigin(request)) return json({ ok: false, error: "Invalid request." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Invalid request." }, 415);
  }

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json({ ok: false, error: "Request is too large." }, 413);

  // Shared across both lead endpoints so one client can't double its allowance by switching forms.
  const rate = await checkRateLimits(await getDb(), [["leads:ip", clientIpFrom(request.headers), RATE_LIMITS.leadsPerIp]], { onFailure: "allow" });
  if (!rate.allowed) {
    return json(
      { ok: false, error: "Too many requests. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(rate.retryAfterSeconds) },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: "Request is too large." }, 413);

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
  if ((typeof honeypot === "string" && honeypot.trim() !== "") || filledTooFast) return json({ ok: true });

  const result = options.schema.safeParse(body);
  if (!result.success) {
    return json(
      { ok: false, error: "Please correct the highlighted fields.", fieldErrors: firstFieldErrors(result.error) },
      422,
    );
  }

  const lead = result.data as z.output<S>;
  if (options.isSpam?.(lead)) return json({ ok: true });

  try {
    await getEmailProvider().send(options.buildEmail(lead, getLeadRecipients()));
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    console.error(
      `[${options.name}] ${error instanceof EmailConfigError ? "Email not configured" : "Delivery failed"}: ${reason}`,
    );
    return json({ ok: false, error: FALLBACK_ERROR }, 502);
  }

  return json({ ok: true });
}

export const tooManyLinks = (text: string, max = 2) => (text.match(/https?:\/\//gi) ?? []).length > max;
