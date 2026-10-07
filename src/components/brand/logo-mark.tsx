/** Brand blue used in the logo. Brighter than the UI accent; intended for the mark and wordmark. */
export const LOGO_BLUE = "#2f7cff";

/**
 * The Fluxline "F" mark: a slanted stem and top bar, with the middle arm in brand blue.
 * `tone` sets the stem color: dark ink on light backgrounds, white on dark ones.
 */
export function LogoMark({ tone = "dark", className = "size-7" }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <path d="M8.9 35l4.3-25.5C13.8 6.6 15.4 5 18.6 5H37l-1.5 7.2H20.6L16 35z" fill={tone === "light" ? "#ffffff" : "#0f1a24"} />
      <path d="M21.4 16.2h11.4l-1.4 6.9H20z" fill={LOGO_BLUE} />
    </svg>
  );
}
