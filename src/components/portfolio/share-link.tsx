"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

/** Copies the page's address (or opens the native share sheet on phones) so the portfolio is one tap to forward. */
export function ShareLink({ path, title, className = "" }: { path: string; title: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = new URL(path, window.location.origin).toString();
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Dismissed share sheet or blocked clipboard: nothing to do.
    }
  };

  return (
    <button type="button" onClick={share} className={`inline-flex items-center gap-2 transition-colors ${className}`}>
      {copied ? <Check aria-hidden="true" className="size-4" /> : <Link2 aria-hidden="true" className="size-4" />}
      <span aria-live="polite">{copied ? "Link copied" : "Copy link to share"}</span>
    </button>
  );
}
