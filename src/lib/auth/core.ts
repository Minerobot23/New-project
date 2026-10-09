import "server-only";
import { and, eq, gt, isNull } from "drizzle-orm";
import type { Db } from "@/lib/db";
import { customers, loginTokens, projects, sessions, users } from "@/lib/db/schema";
import { randomToken, sha256 } from "@/lib/security";

/*
 * Authentication core, independent of Next.js so it can be tested directly.
 * - Sign-in links are single-use, short-lived, and stored only as SHA-256 hashes.
 * - Sessions are random tokens in an httpOnly cookie, also stored only as hashes, so a database leak
 *   doesn't leak usable sessions.
 * - Admin access is granted only to addresses in ADMIN_EMAILS, re-checked on every request,
 *   so removing an address revokes access immediately.
 */

export const LOGIN_LINK_MINUTES = 20;
/** Links sent in onboarding invitations, where the customer may not open email immediately. */
export const INVITE_LINK_HOURS = 72;
export const CLIENT_SESSION_DAYS = 30;
export const ADMIN_SESSION_HOURS = 12;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function adminEmails(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map(normalizeEmail)
      .filter(Boolean),
  );
}

export const isAdminEmail = (email: string) => adminEmails().has(normalizeEmail(email));

export type SessionUser = { id: string; email: string; name: string | null; role: "admin" | "client" };

/**
 * The account a sign-in link may be issued for. Admins are created on first sign-in from the allowlist;
 * clients exist only once they've paid a deposit (created by the verified webhook), so the form can't create accounts.
 */
export async function findUserForLogin(db: Db, rawEmail: string): Promise<SessionUser | null> {
  const email = normalizeEmail(rawEmail);
  if (isAdminEmail(email)) {
    const [admin] = await db
      .insert(users)
      .values({ email, role: "admin" })
      .onConflictDoUpdate({ target: users.email, set: { role: "admin" } })
      .returning();
    return admin;
  }
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user && user.role === "client" ? user : null;
}

export async function createLoginToken(db: Db, rawEmail: string, { next, ttlMinutes = LOGIN_LINK_MINUTES }: { next?: string; ttlMinutes?: number } = {}) {
  const token = randomToken();
  await db.insert(loginTokens).values({
    tokenHash: sha256(token),
    email: normalizeEmail(rawEmail),
    next: next ?? null,
    expiresAt: new Date(Date.now() + ttlMinutes * 60_000),
  });
  return token;
}

/** Atomically marks a link used. Returns null for unknown, expired, or already-used links. */
export async function consumeLoginToken(db: Db, token: string) {
  if (!token || token.length > 200) return null;
  const [row] = await db
    .update(loginTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(loginTokens.tokenHash, sha256(token)), isNull(loginTokens.usedAt), gt(loginTokens.expiresAt, new Date())))
    .returning();
  return row ?? null;
}

/** Non-consuming check, for showing the confirmation page. */
export async function peekLoginToken(db: Db, token: string) {
  if (!token || token.length > 200) return null;
  const [row] = await db
    .select()
    .from(loginTokens)
    .where(and(eq(loginTokens.tokenHash, sha256(token)), isNull(loginTokens.usedAt), gt(loginTokens.expiresAt, new Date())))
    .limit(1);
  return row ?? null;
}

export async function createSession(db: Db, user: SessionUser) {
  const token = randomToken();
  const ms = user.role === "admin" ? ADMIN_SESSION_HOURS * 3_600_000 : CLIENT_SESSION_DAYS * 86_400_000;
  const expiresAt = new Date(Date.now() + ms);
  await db.insert(sessions).values({ id: sha256(token), userId: user.id, expiresAt });
  return { token, expiresAt };
}

export async function userForSessionToken(db: Db, token: string | undefined): Promise<SessionUser | null> {
  if (!token || token.length > 200) return null;
  const [row] = await db
    .select({ id: users.id, email: users.email, name: users.name, role: users.role })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.id, sha256(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  if (!row) return null;
  // An admin removed from ADMIN_EMAILS loses access on their next request.
  if (row.role === "admin" && !isAdminEmail(row.email)) return null;
  return row;
}

export async function deleteSession(db: Db, token: string | undefined) {
  if (token) await db.delete(sessions).where(eq(sessions.id, sha256(token)));
}

/** The projects a client may see: only those belonging to their own customer record. */
export async function projectsForUser(db: Db, userId: string) {
  return db
    .select({ project: projects, customer: customers })
    .from(projects)
    .innerJoin(customers, eq(customers.id, projects.customerId))
    .where(eq(customers.userId, userId))
    .orderBy(projects.createdAt);
}

/** Ownership check used by every client read and write. Admins may access any project. */
export async function canAccessProject(db: Db, user: SessionUser, projectId: string) {
  if (user.role === "admin") return true;
  if (!/^[0-9a-f-]{36}$/i.test(projectId)) return false;
  const [row] = await db
    .select({ id: projects.id })
    .from(projects)
    .innerJoin(customers, eq(customers.id, projects.customerId))
    .where(and(eq(projects.id, projectId), eq(customers.userId, user.id)))
    .limit(1);
  return Boolean(row);
}
