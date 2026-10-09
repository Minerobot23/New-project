"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { LOGIN_LINK_MINUTES, consumeLoginToken, createLoginToken, findUserForLogin } from "@/lib/auth/core";
import { endSession, startSession } from "@/lib/auth/session";
import { getDb, isDatabaseConfigured } from "@/lib/db";
import { sendNotification } from "@/lib/notify/send";
import { templates } from "@/lib/notify/templates";
import { createRateLimiter } from "@/lib/rate-limit";
import { appUrl, clientIpFrom, safeNextPath, sha256 } from "@/lib/security";

export type LoginState = { sent?: boolean; error?: string } | null;

const ipLimiter = createRateLimiter({ limit: 10, windowMs: 15 * 60_000 });
const emailLimiter = createRateLimiter({ limit: 4, windowMs: 15 * 60_000 });

/** Always gives the same answer, so the form can't be used to find out who is a customer. */
export async function requestLoginLink(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = z.email().max(200).safeParse(String(formData.get("email") ?? "").trim());
  if (!parsed.success) return { error: "Enter a valid email address." };
  if (!isDatabaseConfigured()) return { error: "The client portal isn't open yet. Please email us and we'll help directly." };
  const email = parsed.data.toLowerCase();
  const ip = clientIpFrom(await headers());
  if (!ipLimiter(ip).allowed || !emailLimiter(email).allowed) return { error: "Too many requests. Please wait a few minutes and try again." };

  const db = await getDb();
  const user = await findUserForLogin(db, email);
  if (user) {
    const fallback = user.role === "admin" ? "/admin" : "/client/dashboard";
    const next = safeNextPath(formData.get("next"), fallback);
    // A client can't be sent into /admin, and an admin's default is the admin dashboard.
    const destination = user.role === "client" && next.startsWith("/admin") ? "/client/dashboard" : next;
    const token = await createLoginToken(db, email, { next: destination });
    await sendNotification(db, {
      template: "signInLink",
      to: email,
      dedupeKey: `login:${sha256(token).slice(0, 32)}`,
      rendered: templates.signInLink({ link: `${appUrl()}/auth/verify?token=${token}`, minutes: LOGIN_LINK_MINUTES }),
    });
  }
  return { sent: true };
}

/** Runs on an explicit click (POST), so link scanners that prefetch email links can't use up the token. */
export async function verifyLoginLink(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const db = await getDb();
  const row = await consumeLoginToken(db, token);
  if (!row) redirect("/auth/verify?error=expired");
  const user = await findUserForLogin(db, row.email);
  if (!user) redirect("/auth/verify?error=expired");
  await startSession(user);
  const fallback = user.role === "admin" ? "/admin" : "/client/dashboard";
  const next = safeNextPath(row.next, fallback);
  redirect(user.role === "client" && next.startsWith("/admin") ? "/client/dashboard" : next);
}

export async function signOut() {
  await endSession();
  redirect("/login?signedOut=1");
}
