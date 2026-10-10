import "server-only";
import { randomInt } from "node:crypto";
import { and, desc, eq, gt, isNull, sql } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { sessions, stepUpCodes } from "@/lib/db/schema";
import { safeEqual, sha256 } from "@/lib/security";

/*
 * Step-up verification for financial admin actions (refunds, invoices, cancellations, quotes).
 * A signed-in admin requests a 6-digit code by email and enters it; that session is then "elevated" for a short
 * time. Codes are single-use, expire quickly, allow few guesses, and are stored only as hashes.
 */

export const STEP_UP_CODE_MINUTES = 10;
export const ELEVATION_MINUTES = 15;
const MAX_GUESSES = 5;

const hashCode = (userId: string, code: string) => sha256(`step-up:${userId}:${code}`);

/** Creates a fresh code (invalidating earlier ones) and returns it for the email. Called at send time only. */
export async function createStepUpCode(db: Db, userId: string, ttlMinutes = STEP_UP_CODE_MINUTES) {
  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  await db.update(stepUpCodes).set({ usedAt: new Date() }).where(and(eq(stepUpCodes.userId, userId), isNull(stepUpCodes.usedAt)));
  await db.insert(stepUpCodes).values({ userId, codeHash: hashCode(userId, code), expiresAt: new Date(Date.now() + ttlMinutes * 60_000) });
  return code;
}

export type StepUpResult = { ok: true; until: Date } | { ok: false; error: string };

/** Checks a code and, if right, elevates the given session. */
export async function verifyStepUpCode(db: Db, userId: string, sessionTokenHash: string, code: string): Promise<StepUpResult> {
  const clean = code.replace(/\D/g, "");
  if (clean.length !== 6) return { ok: false, error: "Enter the 6-digit code from the email." };
  const [current] = await db
    .select()
    .from(stepUpCodes)
    .where(and(eq(stepUpCodes.userId, userId), isNull(stepUpCodes.usedAt), gt(stepUpCodes.expiresAt, new Date())))
    .orderBy(desc(stepUpCodes.createdAt))
    .limit(1);
  if (!current) return { ok: false, error: "That code has expired. Request a new one." };

  // Count the guess first (atomically), so parallel guesses can't exceed the limit.
  const [counted] = await db
    .update(stepUpCodes)
    .set({ attempts: sql`${stepUpCodes.attempts} + 1` })
    .where(and(eq(stepUpCodes.id, current.id), isNull(stepUpCodes.usedAt)))
    .returning({ attempts: stepUpCodes.attempts });
  if (!counted || counted.attempts > MAX_GUESSES) {
    await db.update(stepUpCodes).set({ usedAt: new Date() }).where(eq(stepUpCodes.id, current.id));
    return { ok: false, error: "Too many attempts. Request a new code." };
  }
  if (!safeEqual(current.codeHash, hashCode(userId, clean))) return { ok: false, error: "That code isn't right." };

  const used = await db
    .update(stepUpCodes)
    .set({ usedAt: new Date() })
    .where(and(eq(stepUpCodes.id, current.id), isNull(stepUpCodes.usedAt)))
    .returning({ id: stepUpCodes.id });
  if (used.length === 0) return { ok: false, error: "That code was already used. Request a new one." };
  const until = new Date(Date.now() + ELEVATION_MINUTES * 60_000);
  await db.update(sessions).set({ elevatedUntil: until }).where(and(eq(sessions.id, sessionTokenHash), eq(sessions.userId, userId)));
  return { ok: true, until };
}

export async function sessionElevatedUntil(db: Db, sessionTokenHash: string) {
  const [row] = await db.select({ until: sessions.elevatedUntil }).from(sessions).where(eq(sessions.id, sessionTokenHash)).limit(1);
  return row?.until && row.until > new Date() ? row.until : null;
}
