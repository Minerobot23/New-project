import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { ArrowUpRight } from "lucide-react";

type Variant = "primary" | "secondary" | "inverse" | "ghost-inverse";
type Size = "md" | "lg";

/* Shape rule: every interactive control is a full pill; containers use 1.25rem to 1.75rem radii. */
const base =
  "group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[background-color,border-color,color,transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] active:scale-[0.98] focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_10px_24px_-12px_rgba(29,91,216,0.7)] hover:bg-accent-strong",
  secondary: "bg-surface text-ink ring-1 ring-line-strong hover:bg-sunken hover:ring-ink/25",
  inverse: "bg-white text-ink hover:bg-white/90",
  "ghost-inverse": "text-white ring-1 ring-white/25 hover:bg-white/[0.06] hover:ring-white/45",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

/* Trailing arrow sits in its own circle, flush with the right padding ("button-in-button"). */
const arrowPad: Record<Size, string> = {
  md: "pr-1.5",
  lg: "pr-1.5",
};

const arrowWrap: Record<Variant, string> = {
  primary: "bg-white/15",
  secondary: "bg-ink/[0.06]",
  inverse: "bg-ink/[0.07]",
  "ghost-inverse": "bg-white/10",
};

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  withArrow = false,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, `${withArrow ? arrowPad[size] : ""} ${className}`)} {...props}>
      {children}
      {withArrow && (
        <span
          aria-hidden="true"
          className={`ml-1 inline-flex items-center justify-center rounded-full transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105 ${arrowWrap[variant]} ${size === "lg" ? "size-9" : "size-7"}`}
        >
          <ArrowUpRight strokeWidth={1.75} className="size-4" />
        </span>
      )}
    </Link>
  );
}
