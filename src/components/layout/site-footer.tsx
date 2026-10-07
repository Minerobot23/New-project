import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Wordmark } from "@/components/layout/wordmark";
import { CALL_CTA_LABEL, CALL_PATH, CHECK_PATH, industryLinks, locationLinks, site } from "@/lib/site";

const companyLinks = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/resources", label: "Resources" },
  { href: "/#simulator", label: "See the Difference" },
  { href: CHECK_PATH, label: "Website Check" },
  { href: CALL_PATH, label: CALL_CTA_LABEL },
];

function FooterList({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer data-track-location="footer" className="border-t border-night-line bg-night text-slate-300">
      <Container className="grid max-w-7xl gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
        <div>
          <Wordmark tone="light" />
          <p className="mt-4 text-sm font-medium text-white">{site.name}</p>
          <p className="mt-1 text-sm text-slate-400">{site.tagline}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">{site.serviceArea}</p>
          <div className="mt-5">
            <p className="text-sm text-white">{site.contact.name}</p>
            <a
              href={`mailto:${site.contact.email}`}
              className="mt-1 inline-block break-all text-sm text-slate-200 underline decoration-slate-600 underline-offset-4 transition-colors hover:text-white hover:decoration-slate-300"
            >
              {site.contact.email}
            </a>
          </div>
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
        <FooterList title="Company" links={companyLinks} />
        <FooterList title="Industries" links={industryLinks} />
        <FooterList title="Areas We Serve" links={locationLinks} />
      </Container>

      <div className="border-t border-night-line">
        <Container className="flex max-w-7xl flex-col gap-3 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-5">
            <li>
              <Link href="/privacy" className="transition-colors hover:text-slate-200">
                Privacy
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
