import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { sha256 } from "@/lib/security";
import { canAccessProject, createSession, deleteSession, userForSessionToken, type SessionUser } from "./core";
import { sessionElevatedUntil } from "./step-up-core";

/*
 * The Data Access Layer for authentication. Every protected page, server action, and route handler
 * calls requireClient/requireAdmin (or getCurrentUser) itself; there is no reliance on Proxy alone.
 */

export const SESSION_COOKIE = "fx_session";

export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  // Before a database is connected, nobody is signed in (rather than an error page).
  if (!isDatabaseConfigured()) return null;
  return userForSessionToken(await getDb(), token);
});

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "admin") redirect("/client/dashboard");
  return user;
}

export async function requireClient(next = "/client/dashboard"): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  if (user.role === "admin") redirect("/admin");
  return user;
}

/** For server actions and route handlers: returns null instead of redirecting. */
export async function userWithProjectAccess(projectId: string) {
  const user = await getCurrentUser();
  if (!user) return null;
  return (await canAccessProject(await getDb(), user, projectId)) ? user : null;
}

export async function startSession(user: SessionUser) {
  const { token, expiresAt } = await createSession(await getDb(), user);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function endSession() {
  const store = await cookies();
  await deleteSession(await getDb(), store.get(SESSION_COOKIE)?.value);
  store.delete(SESSION_COOKIE);
}

/** The current session's id (the hash of its cookie token), for step-up checks. */
export async function currentSessionId() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? sha256(token) : null;
}

/** When the current admin session's step-up verification expires, or null if it isn't elevated. */
export async function adminElevatedUntil() {
  const id = await currentSessionId();
  return id ? sessionElevatedUntil(await getDb(), id) : null;
}
