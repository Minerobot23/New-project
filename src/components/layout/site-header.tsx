"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Wordmark } from "@/components/layout/wordmark";
import { CALL_CTA_LABEL, CALL_PATH, CHECK_PATH, industryLinks, navLinks } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close menus on navigation (adjusting state during render, per React's guidance, instead of in an effect).
  const [lastPathname, setLastPathname] = useState(pathname);
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
    setIndustriesOpen(false);
  }

  // Escape closes whichever menu is open; clicking outside closes the industries menu.
  useEffect(() => {
    if (!open && !industriesOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
      setIndustriesOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (industriesRef.current && !industriesRef.current.contains(event.target as Node)) setIndustriesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, industriesOpen]);

  const onCallPage = pathname === CALL_PATH;
  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));
  const linkClass = "rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-300 ease-[var(--ease-out-soft)]";
  const linkTone = (href: string) => (isActive(href) ? "bg-ink/[0.06] text-ink" : "text-ink-soft hover:text-ink");

  return (
    <header data-track-location="header" className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 rounded-full bg-surface/90 pl-5 pr-2 shadow-[var(--shadow-soft)] ring-1 ring-ink/[0.07] backdrop-blur-xl supports-[backdrop-filter]:bg-surface/80 sm:pl-6"
      >
        <Wordmark />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            <li>
              <Link href="/services" aria-current={isActive("/services") ? "page" : undefined} className={`${linkClass} ${linkTone("/services")}`}>
                Services
              </Link>
            </li>
            <li>
              <div ref={industriesRef} className="relative">
                <button
                  type="button"
                  aria-expanded={industriesOpen}
                  aria-controls="industries-menu"
                  onClick={() => setIndustriesOpen((value) => !value)}
                  className={`flex items-center gap-1 ${linkClass} ${industriesOpen ? "text-ink" : "text-ink-soft hover:text-ink"}`}
                >
                  Industries
                  <ChevronDown aria-hidden="true" strokeWidth={1.75} className={`size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] ${industriesOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  id="industries-menu"
                  hidden={!industriesOpen}
                  className="absolute left-1/2 top-full mt-4 w-72 -translate-x-1/2 rounded-[1.25rem] bg-surface p-2 shadow-[var(--shadow-lift)] ring-1 ring-ink/[0.07]"
                >
                  <ul>
                    {industryLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="block rounded-[1.25rem] px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-sunken hover:text-ink">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
            {navLinks
              .filter((link) => link.href !== "/services")
              .map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`${linkClass} ${linkTone(link.href)}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href={CHECK_PATH} className={`hidden xl:block ${linkClass} ${linkTone(CHECK_PATH)}`}>
            Website Check
          </Link>
          {!onCallPage && (
            <div className="hidden sm:block">
              <ButtonLink href={CALL_PATH}>{CALL_CTA_LABEL}</ButtonLink>
            </div>
          )}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative inline-flex size-12 items-center justify-center rounded-full text-ink transition-colors hover:bg-sunken lg:hidden"
          >
            {/* Two lines that morph into an X. */}
            <span
              aria-hidden="true"
              className={`absolute h-[1.5px] w-5 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-out-soft)] ${
                open ? "rotate-45" : "-translate-y-[4px]"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-[1.5px] w-5 rounded-full bg-current transition-transform duration-500 ease-[var(--ease-out-soft)] ${
                open ? "-rotate-45" : "translate-y-[4px]"
              }`}
            />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        hidden={!open}
        className="mx-auto mt-2 max-h-[calc(100dvh-6.5rem)] max-w-7xl overflow-y-auto rounded-[1.75rem] bg-surface/95 shadow-[var(--shadow-lift)] ring-1 ring-ink/[0.07] backdrop-blur-xl lg:hidden"
      >
        <Container className="py-4">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-line">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setOpen(false)} className="block py-3.5 text-lg font-medium tracking-tight text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm font-medium text-muted">Industries</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-4">
              {industryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setOpen(false)} className="block py-2.5 text-sm text-ink-soft">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-5 grid gap-2.5">
            {!onCallPage && (
              <ButtonLink href={CALL_PATH} onClick={() => setOpen(false)} size="lg" className="w-full">
                {CALL_CTA_LABEL}
              </ButtonLink>
            )}
            <ButtonLink href={CHECK_PATH} onClick={() => setOpen(false)} size="lg" variant="secondary" className="w-full">
              Get a Free Website Check
            </ButtonLink>
          </div>
        </Container>
      </div>
    </header>
  );
}
