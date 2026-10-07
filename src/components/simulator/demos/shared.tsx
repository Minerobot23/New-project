import type { ReactNode } from "react";
import { Star } from "lucide-react";

/** A button inside a demo site. It never navigates; it explains what the real site would do. */
export function DemoButton({
  action,
  onAction,
  className = "",
  children,
  label,
  style,
}: {
  style?: React.CSSProperties;
  action: string;
  onAction: (description: string) => void;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <button type="button" aria-label={label} onClick={() => onAction(action)} className={className} style={style}>
      {children}
    </button>
  );
}

/**
 * Renders a fixed-width desktop layout squeezed into a phone screen,
 * which is how most non-responsive sites actually appear on mobile.
 */
export function NonResponsive({ mobile, width = 980, children }: { mobile: boolean; width?: number; children: ReactNode }) {
  if (!mobile) return <>{children}</>;
  // `zoom` (unlike transform) shrinks layout height too, so the phone scrolls a realistic distance.
  return <div style={{ width, zoom: 390 / width }}>{children}</div>;
}

export function Stars({ className = "size-3.5", color = "#f5a524" }: { className?: string; color?: string }) {
  return (
    <span className="inline-flex" aria-label="5 out of 5 stars (fictional demo review)">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} aria-hidden="true" className={className} style={{ color, fill: color }} />
      ))}
    </span>
  );
}
