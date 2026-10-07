import Link from "next/link";
import { brandFont } from "@/components/brand/fonts";
import { LOGO_BLUE, LogoMark } from "@/components/brand/logo-mark";

/** Fluxline Solutions logo: F mark, FLUX + LINE wordmark, and spaced SOLUTIONS. */
export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const light = tone === "light";
  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${brandFont.className}`}>
      <LogoMark tone={tone} className="size-8" />
      <span className="flex flex-col leading-none">
        <span className={`text-[19px] font-bold tracking-[0.01em] ${light ? "text-white" : "text-ink"}`}>
          FLUX<span style={{ color: light ? LOGO_BLUE : "#1d5bd8" }}>LINE</span>
        </span>
        <span className={`mt-[3px] text-[7.5px] font-semibold tracking-[0.62em] ${light ? "text-slate-300" : "text-ink-soft"}`}>
          SOLUTIONS
        </span>
      </span>
    </Link>
  );
}
