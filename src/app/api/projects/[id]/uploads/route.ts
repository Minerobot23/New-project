import { getCurrentUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { MAX_UPLOAD_BYTES, storeUpload } from "@/lib/portal/uploads";

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

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_UPLOAD_BYTES + 64 * 1024) return Response.json({ error: "Files must be 4 MB or smaller." }, { status: 413 });

  let file: FormDataEntryValue | null;
  try {
    file = (await request.formData()).get("file");
  } catch {
    return Response.json({ error: "Invalid upload." }, { status: 400 });
  }
  if (!(file instanceof File)) return Response.json({ error: "Choose a file to upload." }, { status: 400 });

  const { id } = await params;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const result = await storeUpload(await getDb(), user, id, file.name, bytes);
  if (!result.ok) return Response.json({ error: result.error }, { status: result.error === "Project not found." ? 404 : 400 });
  return Response.json({ id: result.id, filename: result.filename }, { status: 201 });
}
