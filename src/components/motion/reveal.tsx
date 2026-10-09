"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type HTMLAttributes } from "react";

type RevealProps = HTMLAttributes<HTMLElement> & {
  /** Element to render: "div" by default; "li", "ul", or "figure" where the markup needs it. */
  as?: ElementType;
  /** Stagger step: each unit delays the reveal by 90ms. */
  delay?: number;
};

/**
 * Rises content in once as it enters the viewport (styles in globals.css, `.reveal`).
 * Only elements that start below the fold are hidden, and only after hydration,
 * so the page reads fully without JavaScript and nothing above the fold flashes.
 * Reduced motion: the CSS never hides anything.
 */
export function Reveal({ as: Component = "div", delay = 0, className = "", style, ...props }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    element.setAttribute("data-armed", "");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.setAttribute("data-shown", "");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <Component ref={ref} className={`reveal ${className}`} style={{ ...style, "--d": delay } as CSSProperties} {...props} />;
}
