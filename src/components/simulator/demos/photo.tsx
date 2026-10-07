import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Photography used by the concept demos. Files live in /public/demo/ (optimized WebP).
 * Until a photo exists, the slot renders its illustrated fallback so the demo never breaks.
 */
export const DEMO_PHOTOS: Partial<Record<DemoPhotoKey, string>> = {
  "hvac-hero": "/demo/hvac-hero.webp",
  "hvac-tech": "/demo/hvac-tech.webp",
  "verona-hero": "/demo/verona-hero.webp",
  "verona-pasta": "/demo/verona-pasta.webp",
  "verona-wine": "/demo/verona-wine.webp",
  "verona-room": "/demo/verona-room.webp",
  "lumen-hero": "/demo/lumen-hero.webp",
  "lumen-color": "/demo/lumen-color.webp",
  "lumen-skin": "/demo/lumen-skin.webp",
  "lumen-interior": "/demo/lumen-interior.webp",
  "auto-hero": "/demo/auto-hero.webp",
  "auto-brakes": "/demo/auto-brakes.webp",
};

export type DemoPhotoKey =
  | "hvac-hero"
  | "hvac-tech"
  | "verona-hero"
  | "verona-pasta"
  | "verona-room"
  | "verona-wine"
  | "lumen-hero"
  | "lumen-color"
  | "lumen-skin"
  | "lumen-interior"
  | "auto-hero"
  | "auto-brakes"
  | "auto-bay";

type Props = {
  photo: DemoPhotoKey;
  alt: string;
  className?: string;
  /** Rendered when the photo file isn't available. */
  fallback: ReactNode;
  /** Approximate rendered width, for responsive image selection. */
  sizes?: string;
  position?: string;
};

export function DemoPhoto({ photo, alt, className = "", fallback, sizes = "600px", position = "center" }: Props) {
  const src = DEMO_PHOTOS[photo];
  if (!src) return <div className={`overflow-hidden ${className}`}>{fallback}</div>;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: position }} />
    </div>
  );
}
