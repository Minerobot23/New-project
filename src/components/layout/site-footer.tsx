import Link from "next/link";
import { brandFont } from "@/components/brand/fonts";
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
      <p className="text-sm text-white/45">{title}</p>
      <ul className="mt-4 space-y-2 text-[15px]">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-white/85 transition-colors hover:text-accent-on-night">
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
    <footer data-track-location="footer" className="overflow-hidden bg-night text-white">
      <div className="mx-auto grid max-w-[90rem] gap-12 border-t border-white/25 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-[15px] font-medium">{site.name}</p>
          <p className="mt-1 text-[15px] text-white/55">{site.tagline}</p>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/55">{site.serviceArea}</p>
          <p className="mt-6 text-[15px]">{site.contact.name}</p>
          <a
            href={`mailto:${site.contact.email}`}
            className="mt-1 inline-block break-all text-[15px] text-white underline decoration-white/35 underline-offset-4 transition-colors hover:decoration-white"
          >
            {site.contact.email}
          </a>
          {site.mailingAddress && (
            <address className="mt-5 text-sm not-italic leading-relaxed text-white/55">
              {site.mailingAddress.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          )}
        </div>
        <div className="lg:col-span-2">
          <FooterList title="Company" links={companyLinks} />
        </div>
        <div className="lg:col-span-3">
          <FooterList title="Industries" links={industryLinks} />
        </div>
        <div className="lg:col-span-3">
          <FooterList title="Areas we serve" links={locationLinks} />
        </div>
      </div>

      {/* The wordmark, set edge to edge. Decorative: the name is already in the footer text. */}
      <div aria-hidden="true" className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <p className={`${brandFont.className} select-none text-[18.4vw] font-bold leading-[0.8] tracking-[-0.02em] text-white 2xl:text-[17.4rem]`}>
          FLUX<span className="text-accent-on-night">LINE</span>
        </p>
      </div>

      <div className="mx-auto flex max-w-[90rem] flex-col gap-3 px-5 py-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {year} {site.legalName}. All rights reserved.
        </p>
        <ul className="flex gap-6">
          <li>
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy
            </Link>
          </li>
          <li>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
