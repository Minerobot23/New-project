/*
 * Content Security Policy. Built per request in src/proxy.ts with a fresh nonce, so every HTML page is rendered
 * dynamically and Next.js stamps the nonce on its own scripts (it reads it back from the request header).
 *
 * script-src uses 'nonce-…' + 'strict-dynamic': only scripts carrying this request's nonce run, plus scripts they
 * load (Next.js chunks, Vercel Analytics). Inline scripts without the nonce, and scripts from any other origin,
 * are blocked. 'self' and https: are ignored by browsers that support 'strict-dynamic'; they are fallbacks for
 * old browsers only.
 *
 * style-src keeps 'unsafe-inline': React and the animation code write style="" attributes, which can't carry a
 * nonce. Inline styles can't run script; this is the usual trade-off.
 *
 * CSP_MODE: "enforce" or "report-only". Default: enforce on Vercel production, report-only everywhere else.
 */

export type CspMode = "enforce" | "report-only";

export function cspMode(env: Record<string, string | undefined> = process.env): CspMode {
  const value = env.CSP_MODE?.trim();
  if (value === "enforce" || value === "report-only") return value;
  return env.VERCEL_ENV === "production" ? "enforce" : "report-only";
}

export function cspHeaderName(mode: CspMode) {
  return mode === "enforce" ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only";
}

export function generateNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export function buildCsp(nonce: string, env: Record<string, string | undefined> = process.env) {
  const dev = env.NODE_ENV === "development";
  const preview = env.VERCEL_ENV === "preview";
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", "https:", ...(dev ? ["'unsafe-eval'"] : []), ...(preview ? ["https://vercel.live"] : [])],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", ...(preview ? ["https://vercel.live", "https://vercel.com"] : [])],
    "font-src": ["'self'", ...(preview ? ["https://vercel.live"] : [])],
    "media-src": ["'self'", "blob:"],
    "connect-src": ["'self'", ...(preview ? ["https://vercel.live", "wss://ws-us3.pusher.com"] : []), ...(dev ? ["ws:"] : [])],
    "frame-src": preview ? ["https://vercel.live"] : ["'none'"],
    "worker-src": ["'self'", "blob:"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    // Checkout and the billing portal are reached by server-side redirects after a form post.
    "form-action": ["'self'", "https://checkout.stripe.com", "https://billing.stripe.com"],
    "frame-ancestors": ["'none'"],
    "report-uri": ["/api/csp-report"],
    "report-to": ["csp"],
  };
  const policy = Object.entries(directives).map(([name, values]) => `${name} ${values.join(" ")}`);
  if (!dev) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}
