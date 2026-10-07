import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Photography used by the concept demos. Files live in /public/demo/ (optimized WebP).
 * Until a photo exists, the slot renders its illustrated fallback so the demo never breaks.
 */
export const DEMO_PHOTOS: Partial<Record<DemoPhotoKey, string>> = {};

export type DemoPhotoKey =
  | "hvac-hero"
  | "hvac-tech"
  | "hvac-install"
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
