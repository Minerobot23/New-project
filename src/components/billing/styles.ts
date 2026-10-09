/* Class names shared by server and client components on the dark billing surfaces. */

/** Shared input styling for dark forms: 16px text on phones (no iOS zoom), visible focus, error state. */
export function darkInput(invalid = false, extra = "") {
  return `mt-1.5 block w-full border bg-night px-3.5 text-[16px] text-white placeholder:text-white/35 transition-colors focus:outline-2 focus:outline-offset-0 sm:text-[15px] ${
    invalid ? "border-red-400 focus:outline-red-400" : "border-night-line hover:border-white/30 focus:border-accent-on-night focus:outline-accent-on-night"
  } ${extra}`;
}

export const darkButton = {
  primary:
    "inline-flex h-11 items-center justify-center gap-2 bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent disabled:hover:text-white",
  secondary:
    "inline-flex h-11 items-center justify-center gap-2 px-5 text-sm font-medium text-white shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.45)] transition-colors hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-50",
  danger:
    "inline-flex h-11 items-center justify-center gap-2 px-5 text-sm font-medium text-red-200 shadow-[inset_0_0_0_1.5px_rgba(248,113,113,0.6)] transition-colors hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50",
  small:
    "inline-flex h-9 items-center justify-center gap-2 px-3.5 text-[13px] font-medium text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] transition-colors hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-50",
};
