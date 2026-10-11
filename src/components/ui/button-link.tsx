import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "primary" | "secondary" | "inverse" | "ghost-inverse";
type Size = "md" | "lg";

/* Square, solid buttons. The arrow is a typeset glyph that slides on hover. */
const base =
  "group relative inline-flex items-center justify-center gap-3 whitespace-nowrap font-medium transition-[background-color,color,box-shadow] duration-200 active:translate-y-px focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-bone hover:bg-ink-soft",
  secondary: "text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)] hover:bg-ink hover:text-white",
  inverse: "bg-bone text-ink hover:bg-white",
  "ghost-inverse": "text-bone shadow-[inset_0_0_0_1.5px_rgba(239,234,226,0.55)] hover:bg-bone hover:text-ink",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-7 text-[15px]",
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
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {children}
      {withArrow && (
        <span aria-hidden="true" className="inline-block transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-x-1">
          →
        </span>
      )}
    </Link>
  );
}
