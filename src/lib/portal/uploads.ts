import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { canAccessProject, type SessionUser } from "@/lib/auth/core";
import type { Db } from "@/lib/db";
import { projectEvents, uploads } from "@/lib/db/schema";

/*
 * Client file uploads (logos, photos, documents).
 * - Type is checked from the file's first bytes, not its name or the browser's claim.
 * - SVG and HTML are refused (they can carry scripts).
 * - Files are capped at 4 MB (under Vercel's request limit) and 25 per project.
 * - Only the project's owner and admins can list or download them; downloads are served as attachments.
 */

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_UPLOADS_PER_PROJECT = 25;
export const ACCEPTED_UPLOADS = "image/png,image/jpeg,image/webp,image/gif,application/pdf";

const SIGNATURES: { mime: string; ext: string; test: (bytes: Uint8Array) => boolean }[] = [
  { mime: "image/png", ext: "png", test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { mime: "image/jpeg", ext: "jpg", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { mime: "image/gif", ext: "gif", test: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 },
  {
    mime: "image/webp",
    ext: "webp",
    test: (b) => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
  { mime: "application/pdf", ext: "pdf", test: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 },
];

export function detectFileType(bytes: Uint8Array) {
  return SIGNATURES.find((signature) => bytes.length >= 12 && signature.test(bytes)) ?? null;
}

/** A safe display and download name: no paths, no control or quote characters, the right extension. */
export function safeFilename(name: string, ext: string) {
  const base = name
    .replace(/^.*[\\/]/, "")
    .replace(/\.[^.]*$/, "")
    .replace(/[^\w\- ]+/g, "")
    .trim()
    .slice(0, 80);
  return `${base || "file"}.${ext}`;
}

export type UploadCheck = { ok: true; mime: string; filename: string } | { ok: false; error: string };

export function validateUpload(name: string, bytes: Uint8Array): UploadCheck {
  if (bytes.length === 0) return { ok: false, error: "That file is empty." };
  if (bytes.length > MAX_UPLOAD_BYTES) return { ok: false, error: "Files must be 4 MB or smaller. For larger files, email us a download link." };
  const type = detectFileType(bytes);
  if (!type) return { ok: false, error: "Upload PNG, JPEG, WebP, GIF, or PDF files. For SVG or design files, email them to us." };
  return { ok: true, mime: type.mime, filename: safeFilename(name, type.ext) };
}

export async function storeUpload(db: Db, user: SessionUser, projectId: string, name: string, bytes: Uint8Array) {
  if (!(await canAccessProject(db, user, projectId))) return { ok: false as const, error: "Project not found." };
  const check = validateUpload(name, bytes);
  if (!check.ok) return check;
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(uploads).where(eq(uploads.projectId, projectId));
  if (count >= MAX_UPLOADS_PER_PROJECT) return { ok: false as const, error: `Each project can hold up to ${MAX_UPLOADS_PER_PROJECT} files. Remove one to add another.` };
  const [row] = await db
    .insert(uploads)
    .values({ projectId, uploadedBy: user.id, filename: check.filename, mime: check.mime, sizeBytes: bytes.length, data: Buffer.from(bytes) })
    .returning({ id: uploads.id, filename: uploads.filename });
  await db.insert(projectEvents).values({ projectId, actorUserId: user.id, kind: "upload", detail: `Uploaded ${row.filename}.` });
  return { ok: true as const, id: row.id, filename: row.filename };
}

export function listUploads(db: Db, projectId: string) {
  return db
    .select({ id: uploads.id, filename: uploads.filename, mime: uploads.mime, sizeBytes: uploads.sizeBytes, createdAt: uploads.createdAt })
    .from(uploads)
    .where(eq(uploads.projectId, projectId))
    .orderBy(desc(uploads.createdAt));
}

/** Returns the file only if this user may see the project it belongs to. */
export async function getUploadForUser(db: Db, user: SessionUser, uploadId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(uploadId)) return null;
  const [row] = await db.select().from(uploads).where(eq(uploads.id, uploadId)).limit(1);
  if (!row || !(await canAccessProject(db, user, row.projectId))) return null;
  return row;
}

export async function deleteUpload(db: Db, user: SessionUser, uploadId: string) {
  const row = await getUploadForUser(db, user, uploadId);
  if (!row) return false;
  await db.delete(uploads).where(and(eq(uploads.id, uploadId), eq(uploads.projectId, row.projectId)));
  await db.insert(projectEvents).values({ projectId: row.projectId, actorUserId: user.id, kind: "upload_removed", detail: `Removed ${row.filename}.` });
  return true;
}
