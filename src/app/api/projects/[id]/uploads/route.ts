import { canAccessProject } from "@/lib/auth/core";
import { getCurrentUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { MAX_UPLOAD_BYTES, storeUpload } from "@/lib/portal/uploads";
import { RATE_LIMITS, checkRateLimits } from "@/lib/rate-limit";

/** Same-origin check: uploads come only from the portal's own pages (CSRF protection for this non-action endpoint). */
function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request, { params }: RouteContext<"/api/projects/[id]/uploads">) {
  if (!sameOrigin(request)) return Response.json({ error: "Invalid request." }, { status: 403 });
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Please sign in again." }, { status: 401 });

  // Everything that can be decided without reading the body is decided first.
  const { id } = await params;
  const db = await getDb();
  if (!(await canAccessProject(db, user, id))) return Response.json({ error: "Project not found." }, { status: 404 });
  const rate = await checkRateLimits(db, [["upload:user", user.id, RATE_LIMITS.uploadPerUser]]);
  if (!rate.allowed) return Response.json({ error: "Too many uploads. Please try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const lengthHeader = request.headers.get("content-length");
  if (!lengthHeader) return Response.json({ error: "Upload size is required." }, { status: 411 });
  if (Number(lengthHeader) > MAX_UPLOAD_BYTES + 64 * 1024) return Response.json({ error: "Files must be 4 MB or smaller." }, { status: 413 });

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return Response.json({ error: "Invalid upload." }, { status: 400 });
  }
  if (!(file instanceof File)) return Response.json({ error: "Choose a file to upload." }, { status: 400 });

  const bytes = new Uint8Array(await file.arrayBuffer());
  const result = await storeUpload(db, user, id, file.name, bytes);
  if (!result.ok) return Response.json({ error: result.error }, { status: result.error === "Project not found." ? 404 : 400 });
  return Response.json({ id: result.id, filename: result.filename }, { status: 201 });
}
