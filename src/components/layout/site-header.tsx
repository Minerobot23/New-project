"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Wordmark } from "@/components/layout/wordmark";
import { CALL_CTA_LABEL, CALL_PATH, CHECK_PATH, industryLinks, navLinks } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const industriesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  const linkClass = "text-sm font-medium text-ink-soft transition-colors hover:text-ink";

  return (
    <header
      data-track-location="header"
      className={`sticky top-0 z-50 border-b bg-paper/90 backdrop-blur-md transition-colors duration-200 supports-[backdrop-filter]:bg-paper/80 ${
        scrolled || open ? "border-line" : "border-transparent"
      }`}
    >
      <Container className="flex h-16 max-w-7xl items-center justify-between gap-6">
        <Wordmark />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            <li>
              <Link href="/services" className={linkClass}>
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
                  className={`flex items-center gap-1 ${linkClass}`}
                >
                  Industries
                  <ChevronDown aria-hidden="true" className={`size-4 transition-transform ${industriesOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  id="industries-menu"
                  hidden={!industriesOpen}
                  className="absolute left-1/2 top-full mt-3 w-72 -translate-x-1/2 rounded-xl border border-line bg-surface p-2 shadow-[0_16px_40px_-16px_rgba(15,26,36,0.25)]"
                >
                  <ul>
                    {industryLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="block rounded-md px-3 py-2 text-sm text-ink-soft hover:bg-sunken hover:text-ink">
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
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href={CHECK_PATH} className={`hidden px-2 xl:block ${linkClass}`}>
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
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-sunken lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </Container>

      <div id="mobile-nav" hidden={!open} className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-paper lg:hidden">
        <Container className="py-4">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-line">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setOpen(false)} className="block py-3.5 text-base font-medium text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Industries</p>
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
