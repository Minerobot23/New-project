import { getCurrentUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { getUploadForUser } from "@/lib/portal/uploads";

/** Downloads a client file. Owner or admin only; always served as an attachment that can't run in the page. */
export async function GET(_request: Request, { params }: RouteContext<"/api/uploads/[id]">) {
  const user = await getCurrentUser();
  if (!user) return new Response("Not found.", { status: 404 });
  const { id } = await params;
  const file = await getUploadForUser(await getDb(), user, id);
  if (!file) return new Response("Not found.", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: {
      "Content-Type": file.mime,
      "Content-Length": String(file.sizeBytes),
      "Content-Disposition": `attachment; filename="${file.filename}"`,
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Cache-Control": "private, no-store",
    },
  });
}
