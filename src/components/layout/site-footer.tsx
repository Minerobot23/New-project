import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/layout/wordmark";
import { CALL_CTA_LABEL, CALL_PATH, navLinks, site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-night-line bg-night text-slate-300">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark tone="light" />
          <p className="mt-4 text-sm font-medium text-white">{site.legalName}</p>
          <p className="mt-1 text-sm text-slate-400">{site.tagline}</p>
          {site.mailingAddress && (
            <address className="mt-4 text-sm not-italic leading-relaxed text-slate-400">
              {site.mailingAddress.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          )}
        </div>

        <nav aria-label="Footer">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Company</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={CALL_PATH} className="transition-colors hover:text-white">
                {CALL_CTA_LABEL}
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Contact</p>
          <p className="mt-4 text-sm text-white">{site.contact.name}</p>
          <p className="text-sm text-slate-400">
            {site.contact.title} | {site.legalName}
          </p>
          <a
            href={`mailto:${site.contact.email}`}
            className="mt-2 inline-block break-all text-sm text-slate-200 underline decoration-slate-600 underline-offset-4 transition-colors hover:text-white hover:decoration-slate-300"
          >
            {site.contact.email}
          </a>
        </div>
      </Container>

      <div className="border-t border-night-line">
        <Container className="flex flex-col gap-3 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-slate-200">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition-colors hover:text-slate-200">
                Terms
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
