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
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`text-sm font-medium ${dark ? "text-accent-on-night" : "text-accent"}`}>{eyebrow}</p>}
      <h2
        id={id}
        className={`display-tight ${eyebrow ? "mt-4" : ""} text-balance text-[2rem] sm:text-[2.75rem] ${dark ? "text-white" : "text-ink"}`}
      >
        {title}
      </h2>
      {intro && (
        <div className={`mt-5 max-w-[58ch] text-pretty text-base leading-relaxed sm:text-lg ${dark ? "text-white/70" : "text-ink-soft"}`}>
          {intro}
        </div>
      )}
    </div>
  );
}
