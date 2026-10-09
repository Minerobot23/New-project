"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ClipboardList, Phone } from "lucide-react";
import { brandFont } from "@/components/brand/fonts";
import { BASE, business, services } from "./content";
import { locations } from "./locations";
import { PresentationToggle } from "./presentation";

/** Shield monogram in Clean Slate's colors: a blue half with a C, a charcoal (or white, on dark) half with an S. */
export function CsMark({ className = "h-9 w-8", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const right = tone === "light" ? "#ffffff" : "#1b1c1c";
  const rightLetter = tone === "light" ? "#0d0f12" : "#ffffff";
  return (
    <svg viewBox="0 0 40 46" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id={`cs-shield-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2e86c9" />
          <stop offset="1" stopColor="#16479f" />
        </linearGradient>
      </defs>
      <path d="M0 0h19.2v46L0 35.6z" fill={`url(#cs-shield-${tone})`} />
      <path d="M20.8 0H40v35.6L20.8 46z" fill={right} />
      <text x="9.8" y="25" textAnchor="middle" fontSize="21" fontWeight="800" fill="#ffffff" fontFamily="inherit">
        C
      </text>
      <text x="30.2" y="25" textAnchor="middle" fontSize="21" fontWeight="800" fill={rightLetter} fontFamily="inherit">
        S
      </text>
    </svg>
  );
}

export function CsWordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <Link href={BASE} className={`inline-flex items-center gap-2.5 ${brandFont.className}`} aria-label={`${business.name}, home`}>
      <CsMark tone={tone} />
      <span className="flex flex-col leading-none">
        <span className={`text-[17px] font-bold tracking-[0.02em] ${light ? "text-white" : "text-cs-ink"}`}>CLEANSLATE</span>
        <span className={`mt-1 text-[8px] font-semibold tracking-[0.55em] ${light ? "text-white/70" : "text-cs-slate"}`}>SERVICES</span>
      </span>
    </Link>
  );
}

/** Always-visible disclosure: this is Fluxline's independent concept, not Clean Slate's website. */
export function ConceptBar() {
  return (
    <div className="relative z-[60] bg-cs-night text-[12px] text-white/70">
      <div className="mx-auto flex max-w-[84rem] items-center justify-between gap-4 px-5 py-2 sm:px-8">
        <p className="min-w-0 truncate">
          <span className="font-semibold text-white">Independent concept</span>
          <span className="hidden sm:inline"> by Fluxline Solutions</span> · Not Clean Slate Services&apos; official website
        </p>
        <div className="flex shrink-0 items-center gap-5">
          <a
            href={business.officialSite}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1 hover:text-white md:inline-flex"
          >
            Current site <ArrowUpRight aria-hidden="true" className="size-3" />
          </a>
          <PresentationToggle className="text-cs-sky hover:text-white" />
        </div>
      </div>
    </div>
  );
}

export function EmergencyCallButton({ size = "md", className = "", label = "Call Emergency Response" }: { size?: "md" | "lg"; className?: string; label?: string }) {
  return (
    <a
      href={business.phoneHref}
      className={`group inline-flex items-center justify-center gap-3 bg-cs-blue font-semibold text-white transition-colors duration-200 hover:bg-cs-blue-deep active:translate-y-px ${
        size === "lg" ? "h-14 px-7 text-[15px]" : "h-11 px-5 text-sm"
      } ${className}`}
    >
      <Phone aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:-rotate-12" strokeWidth={2.25} />
      <span>{label}</span>
    </a>
  );
}

const NAV = [
  ...services.map((service) => ({ href: `${BASE}/${service.slug}`, label: service.tab })),
  { href: `${BASE}/locations`, label: "Service Areas" },
  { href: `${BASE}#insurance`, label: "Insurance Claims" },
];

export function CsHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header role="banner" className="sticky top-0 z-50 border-b border-cs-ink/10 bg-white">
      <div className="mx-auto flex h-[4.5rem] max-w-[84rem] items-center justify-between gap-6 px-5 sm:px-8">
        <CsWordmark />

        <nav aria-label="Clean Slate primary" className="hidden xl:block">
          <ul className="flex items-center gap-6">
            {NAV.map((link) => {
              const active = pathname === link.href || (link.href.endsWith("/locations") && pathname.startsWith(link.href));
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-2 text-[14px] font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:origin-left after:scale-x-0 after:bg-cs-blue after:transition-transform after:duration-300 hover:text-cs-ink hover:after:scale-x-100 ${
                      active ? "text-cs-ink after:scale-x-100" : "text-cs-slate"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          <a href={business.phoneHref} className="hidden flex-col items-end leading-tight sm:flex">
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-cs-slate">
              <span aria-hidden="true" className="cs-live size-2 rounded-full bg-cs-alert" />
              24/7 Emergency
            </span>
            <span className="text-lg font-bold tracking-tight text-cs-ink">{business.phoneDisplay}</span>
          </a>
          <Link
            href={`${BASE}#assessment`}
            className="hidden h-11 items-center bg-cs-ink px-5 text-sm font-semibold text-white transition-colors hover:bg-cs-blue lg:inline-flex"
          >
            Request an Assessment
          </Link>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="cs-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative -mr-2 inline-flex size-12 items-center justify-center text-cs-ink xl:hidden"
          >
            <span aria-hidden="true" className={`absolute h-[2px] w-6 bg-current transition-transform duration-500 ease-[var(--ease-out-soft)] ${open ? "rotate-45" : "-translate-y-[5px]"}`} />
            <span aria-hidden="true" className={`absolute h-[2px] w-6 bg-current transition-transform duration-500 ease-[var(--ease-out-soft)] ${open ? "-rotate-45" : "translate-y-[5px]"}`} />
          </button>
        </div>
      </div>

      <div id="cs-mobile-nav" hidden={!open} className="max-h-[calc(100dvh-7rem)] overflow-y-auto border-t border-cs-ink/10 bg-white xl:hidden">
        <nav aria-label="Clean Slate mobile" className="mx-auto max-w-[84rem] px-5 py-3 sm:px-8">
          <ul className="divide-y divide-cs-ink/10">
            {NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)} className="block py-4 text-xl font-semibold text-cs-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-2.5 pb-4">
            <EmergencyCallButton size="lg" className="w-full" label={`Call ${business.phoneDisplay}`} />
            <Link
              href={`${BASE}#assessment`}
              onClick={() => setOpen(false)}
              className="inline-flex h-14 w-full items-center justify-center text-[15px] font-semibold text-cs-ink shadow-[inset_0_0_0_1.5px_var(--color-cs-ink)]"
            >
              Request an Assessment
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

/** Phones: call and assessment stay one thumb away for the whole visit. */
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[65] grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-2 border-t border-white/10 bg-cs-night p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
      <a href={business.phoneHref} className="flex h-12 items-center justify-center gap-2 bg-cs-blue text-[15px] font-semibold text-white">
        <span aria-hidden="true" className="cs-live size-2 rounded-full bg-cs-alert" />
        Call 24/7
      </a>
      <Link href={`${BASE}#assessment`} className="flex h-12 min-w-0 items-center justify-center gap-2 text-[15px] font-semibold text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.35)]">
        <ClipboardList aria-hidden="true" className="size-4" />
        Assessment
      </Link>
    </div>
  );
}

export function CsFooter() {
  return (
    <footer role="contentinfo" className="bg-cs-night pb-24 text-white/70 md:pb-0">
      <div className="mx-auto grid max-w-[84rem] gap-12 px-5 py-16 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <CsWordmark tone="light" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            Property restoration and emergency cleanup: water, fire and smoke, and mold, plus construction and home improvement.
          </p>
          <a href={business.phoneHref} className="mt-6 block text-2xl font-bold text-white hover:text-cs-sky">
            {business.phoneDisplay}
          </a>
          <p className="mt-1 text-sm">24/7 emergency service · {business.officeHours}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Services</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={`${BASE}/${service.slug}`} className="hover:text-white">
                    {service.name}
                  </Link>
                </li>
              ))}
              <li>Reconstruction after damage</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Service areas</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {locations.map((location) => (
                <li key={location.slug}>
                  <Link href={`${BASE}/locations/${location.slug}`} className="hover:text-white">
                    {location.full}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Contact</p>
            <address className="mt-4 space-y-2.5 text-sm not-italic">
              <p>
                {business.street}
                <br />
                {business.city}, {business.region} {business.postalCode}
              </p>
              <p>
                <a href={`mailto:${business.email}`} className="break-all hover:text-white">
                  {business.email}
                </a>
              </p>
            </address>
            <ul className="mt-4 flex flex-wrap gap-4 text-sm">
              {business.social.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[84rem] space-y-2 px-5 py-6 text-xs leading-relaxed text-white/50 sm:px-8">
          <p>
            <strong className="font-semibold text-white/80">Independent concept.</strong> This is an unofficial website redesign concept prepared by{" "}
            <a href="/portfolio" className="underline underline-offset-2 hover:text-white">
              Fluxline Solutions
            </a>{" "}
            for discussion with Clean Slate Services. It is not Clean Slate Services&apos; official website, which is{" "}
            <a href={business.officialSite} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
              cleanslateservicesny.com
            </a>
            . Business details were taken from that site; process and service copy is proposed wording for Clean Slate to review and approve.
          </p>
          <p>
            <Link href={`${BASE}/sitemap`} className="underline underline-offset-2 hover:text-white">
              Sitemap
            </Link>{" "}
            ·{" "}
            <a href={`${BASE}/sitemap.xml`} className="underline underline-offset-2 hover:text-white">
              XML sitemap
            </a>
          </p>
          <p>
            Photography is licensed stock (Unsplash License) used for illustration only. It does not show Clean Slate Services projects, staff, or
            equipment. The request form is a demonstration and does not send or store anything.
          </p>
        </div>
      </div>
    </footer>
  );
}
