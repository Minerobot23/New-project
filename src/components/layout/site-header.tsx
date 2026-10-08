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
  /* Active page gets an underline in the accent; hover draws the same line in ink. */
  const linkClass =
    "relative py-2 text-sm font-medium transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-px after:h-[2px] after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-[var(--ease-out-soft)] hover:after:scale-x-100";
  const linkTone = (href: string) =>
    isActive(href) ? "text-ink after:scale-x-100 after:bg-accent" : "text-ink-soft hover:text-ink after:bg-ink";

  return (
    <header data-track-location="header" className="sticky top-0 z-50 border-b border-ink bg-paper">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-6 px-5 sm:px-8">
        <Wordmark />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
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
                  className={`flex items-center gap-1 ${linkClass} ${industriesOpen ? "text-ink" : "text-ink-soft hover:text-ink"} after:bg-ink`}
                >
                  Industries
                  <ChevronDown aria-hidden="true" strokeWidth={1.75} className={`size-4 transition-transform duration-300 ease-[var(--ease-out-soft)] ${industriesOpen ? "rotate-180" : ""}`} />
                </button>
                <div
                  id="industries-menu"
                  hidden={!industriesOpen}
                  className="absolute -left-4 top-full mt-[1.15rem] w-72 border border-ink bg-paper py-2"
                >
                  <ul>
                    {industryLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="block px-4 py-2 text-sm text-ink-soft transition-colors hover:bg-ink hover:text-white">
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

        <div className="flex items-center gap-6">
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
            className="relative -mr-2 inline-flex size-12 items-center justify-center text-ink lg:hidden"
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
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-ink bg-paper lg:hidden"
      >
        <Container className="py-4">
          <nav aria-label="Mobile">
            <ul className="divide-y divide-line">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={() => setOpen(false)} className="display-tight block py-4 text-2xl text-ink">
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
