import { NextResponse, type NextRequest } from "next/server";
import { buildCsp, cspHeaderName, cspMode, generateNonce } from "@/lib/csp";

/*
 * Adds a per-request nonce-based Content Security Policy to every page (see src/lib/csp.ts). No auth decisions
 * are made here: every page, route handler and server action checks the session itself.
 */
export function proxy(request: NextRequest) {
  const nonce = generateNonce();
  const policy = buildCsp(nonce);
  const header = cspHeaderName(cspMode());

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set(header, policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set(header, policy);
  response.headers.set("Reporting-Endpoints", 'csp="/api/csp-report"');
  return response;
}

export const config = {
  matcher: [
    {
      // Pages only: not API routes, build assets, Vercel internals, or files with an extension (images, robots.txt).
      source: "/((?!api/|_next/static|_next/image|_vercel|.*\\.[A-Za-z0-9]+$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
