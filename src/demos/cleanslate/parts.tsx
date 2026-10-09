import type { ReactNode } from "react";

/** Section heading in the Clean Slate voice: small blue eyebrow, wide display title, slate intro. */
export function CsHeading({
  eyebrow,
  title,
  intro,
  id,
  tone = "light",
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
  as?: "h1" | "h2";
}) {
  const dark = tone === "dark";
  return (
    <div className="max-w-3xl">
      <p className={`text-[12px] font-semibold uppercase tracking-[0.2em] ${dark ? "text-cs-sky" : "text-cs-blue"}`}>{eyebrow}</p>
      <Tag
        id={id}
        className={`mt-4 text-balance font-display text-[2.2rem] font-extrabold leading-[1.02] tracking-[-0.025em] sm:text-[clamp(2.6rem,4.4vw,3.6rem)] ${dark ? "text-white" : "text-cs-ink"}`}
        style={{ fontStretch: "106%" }}
      >
        {title}
      </Tag>
      {intro && <div className={`mt-5 max-w-[58ch] text-pretty text-lg leading-relaxed ${dark ? "text-white/70" : "text-cs-slate"}`}>{intro}</div>}
    </div>
  );
}
