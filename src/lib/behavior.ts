const PUBLIC_PAGES = new Set(["/", "/pricing", "/website-check", "/request-a-call", "/start/contractors", "/start/restaurants", "/services", "/experiences", "/about", "/contact", "/privacy"]);

/** Exclude private routes and arbitrary parameters that may contain personal data or tokens. */
export function canRecordBehavior(url: URL): boolean {
  if (!PUBLIC_PAGES.has(url.pathname)) return false;
  for (const [key, value] of url.searchParams) {
    if (/^(gclid|fbclid|gbraid|wbraid)$/.test(key) && /^[a-zA-Z0-9_-]{1,512}$/.test(value)) continue;
    if (!/^utm_(source|medium|campaign|content|term)$/.test(key) || !/^[a-zA-Z0-9 _|$.-]{1,120}$/.test(value)) return false;
  }
  return !url.hash;
}
