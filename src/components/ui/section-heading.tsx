import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  tone = "light",
  align = "left",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p
          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] ring-1 ${
            dark ? "text-accent-on-night ring-white/15" : "text-accent ring-accent/20"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={`${eyebrow ? "mt-5" : ""} text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[2.75rem] ${dark ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {intro && (
        <div
          className={`mt-5 max-w-[60ch] text-pretty text-base leading-relaxed sm:text-lg ${dark ? "text-slate-300" : "text-ink-soft"}`}
        >
          {intro}
        </div>
      )}
    </div>
  );
}
