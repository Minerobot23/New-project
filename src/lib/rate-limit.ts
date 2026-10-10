import "server-only";
import { sql } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { rateLimits } from "@/lib/db/schema";
import { sha256 } from "@/lib/security";

/*
 * Shared rate limiting. Every server instance increments the same database row with one atomic upsert,
 * so limits hold across Vercel function instances and concurrent requests can't slip past the count.
 * Keys are hashed, so no email address or IP is stored in the table.
 */

export type RateLimitResult = { allowed: boolean; retryAfterSeconds: number };
export type RateLimitRule = { limit: number; windowMs: number };

export const RATE_LIMITS = {
  loginPerIp: { limit: 10, windowMs: 15 * 60_000 },
  loginPerEmail: { limit: 4, windowMs: 15 * 60_000 },
  checkoutPerIp: { limit: 8, windowMs: 10 * 60_000 },
  checkoutPerEmail: { limit: 5, windowMs: 10 * 60_000 },
  supportPerUser: { limit: 6, windowMs: 60 * 60_000 },
  uploadPerUser: { limit: 40, windowMs: 60 * 60_000 },
  stepUpPerUser: { limit: 5, windowMs: 15 * 60_000 },
  leadsPerIp: { limit: 8, windowMs: 10 * 60_000 },
} satisfies Record<string, RateLimitRule>;

/** Counts one hit against `scope:identifier` and reports whether it's within the rule. */
export async function hitRateLimit(db: Db, scope: string, identifier: string, rule: RateLimitRule): Promise<RateLimitResult> {
  const key = `${scope}:${sha256(identifier.trim().toLowerCase())}`;
  const resetAt = new Date(Date.now() + rule.windowMs);
  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1, resetAt })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`case when ${rateLimits.resetAt} <= now() then 1 else ${rateLimits.count} + 1 end`,
        resetAt: sql`case when ${rateLimits.resetAt} <= now() then excluded.reset_at else ${rateLimits.resetAt} end`,
      },
    })
    .returning({ count: rateLimits.count, resetAt: rateLimits.resetAt });

  // Occasional cleanup of expired counters keeps the table small.
  if (Math.random() < 0.01) await db.delete(rateLimits).where(sql`${rateLimits.resetAt} < now() - interval '1 day'`);

  const retryAfterSeconds = Math.max(1, Math.ceil((row.resetAt.getTime() - Date.now()) / 1000));
  return { allowed: row.count <= rule.limit, retryAfterSeconds: row.count <= rule.limit ? 0 : retryAfterSeconds };
}

/**
 * Checks several limits at once (for example per-IP and per-email). Every limit is counted.
 * If the limiter itself fails (database unavailable), the request is refused, except where the caller opts to allow
 * (public lead forms, where losing a customer enquiry is worse than a burst, and nothing sensitive is reachable).
 */
export async function checkRateLimits(
  db: Db,
  checks: [scope: string, identifier: string, rule: RateLimitRule][],
  { onFailure = "deny" }: { onFailure?: "deny" | "allow" } = {},
): Promise<RateLimitResult> {
  try {
    const results = await Promise.all(checks.map(([scope, identifier, rule]) => hitRateLimit(db, scope, identifier, rule)));
    const blocked = results.filter((result) => !result.allowed);
    if (blocked.length === 0) return { allowed: true, retryAfterSeconds: 0 };
    return { allowed: false, retryAfterSeconds: Math.max(...blocked.map((result) => result.retryAfterSeconds)) };
  } catch (error) {
    console.error(`[rate-limit] limiter unavailable (${onFailure}): ${error instanceof Error ? error.message : "unknown"}`);
    return onFailure === "allow" ? { allowed: true, retryAfterSeconds: 0 } : { allowed: false, retryAfterSeconds: 60 };
  }
}
