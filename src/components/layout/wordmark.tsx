import Link from "next/link";

/** Text wordmark used until a designed logo exists. */
export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 text-[19px] font-semibold tracking-tight ${dark ? "text-ink" : "text-white"}`}
    >
      <span aria-hidden="true" className="flex h-5 items-end gap-[3px]">
        <span className="h-2 w-[3px] rounded-[1px] bg-accent/45" />
        <span className="h-3.5 w-[3px] rounded-[1px] bg-accent/70" />
        <span className="h-5 w-[3px] rounded-[1px] bg-accent" />
      </span>
      <span>
        Fluxline{" "}
        <span className={`font-normal ${dark ? "text-muted" : "text-slate-400"}`}>Solutions</span>
      </span>
    </Link>
  );
}
