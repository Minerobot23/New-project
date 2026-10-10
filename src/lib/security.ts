import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/** 256-bit random token, URL-safe. */
export const randomToken = () => randomBytes(32).toString("base64url");

export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

function secret() {
  const value = process.env.AUTH_SECRET;
  if (value && value.length >= 32) return value;
  if (process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET must be set (at least 32 characters).");
  return "development-only-secret-not-for-production-use";
}

/** Keyed hash of a client IP: lets an agreement acceptance be tied to a request without storing the raw address. */
export const hashIp = (ip: string) => createHmac("sha256", secret()).update(ip).digest("hex");

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * The client IP, from headers only Vercel's edge sets (it overwrites any client-supplied value).
 * Outside Vercel (local development) there's no trusted proxy, so a client-sent header is never believed.
 */
export function clientIpFrom(headers: Headers) {
  if (!process.env.VERCEL) return "local";
  return headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip")?.trim() || "unknown";
}

/** Only same-site relative paths are allowed as post-login destinations (no open redirects). */
export function safeNextPath(next: unknown, fallback = "/client/dashboard") {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

/** Public base URL used in emails and Stripe redirects. Never derived from request headers. */
export function appUrl() {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === "production") return "https://fluxlinesolutions.com";
  return "http://localhost:3000";
}
