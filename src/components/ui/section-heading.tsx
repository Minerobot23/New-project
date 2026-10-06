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
          className={`text-xs font-semibold uppercase tracking-[0.14em] ${dark ? "text-emerald-300/90" : "text-accent"}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={`mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl ${dark ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {intro && (
        <div
          className={`mt-4 text-pretty text-base leading-relaxed sm:text-lg ${dark ? "text-slate-300" : "text-ink-soft"}`}
        >
          {intro}
        </div>
      )}
    </div>
  );
}
