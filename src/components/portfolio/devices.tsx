import Image, { type StaticImageData } from "next/image";
import { Lock } from "lucide-react";

/*
 * Device frames for real project screenshots. Pure CSS around next/image (responsive sizes, blur placeholders),
 * so the portfolio stays light: no iframes, no live third-party pages loading inside ours.
 */

export function BrowserFrame({
  src,
  alt,
  url,
  preload = false,
  sizes = "(min-width: 1440px) 1300px, 92vw",
  className = "",
}: {
  src: StaticImageData;
  alt: string;
  url: string;
  preload?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={`overflow-hidden rounded-[10px] bg-[#1d1c1a] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/10 ${className}`}>
      <div className="flex items-center gap-3 px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </span>
        <span className="mx-auto flex min-w-0 max-w-sm flex-1 items-center justify-center gap-1.5 truncate rounded-md bg-white/[0.06] px-3 py-1 font-mono text-[11px] text-white/55">
          <Lock aria-hidden="true" className="size-3 shrink-0" />
          <span className="truncate">{url}</span>
        </span>
        <span aria-hidden="true" className="w-[42px]" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image src={src} alt={alt} fill sizes={sizes} placeholder="blur" preload={preload} className="object-cover object-top" />
      </div>
    </figure>
  );
}

export function TabletFrame({ src, alt, className = "" }: { src: StaticImageData; alt: string; className?: string }) {
  return (
    <figure className={`rounded-[22px] bg-[#111] p-[9px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/15 ${className}`}>
      <div className="relative aspect-[834/1112] overflow-hidden rounded-[14px]">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 300px, 45vw" placeholder="blur" className="object-cover object-top" />
      </div>
    </figure>
  );
}

export function PhoneFrame({ src, alt, className = "" }: { src: StaticImageData; alt: string; className?: string }) {
  return (
    <figure className={`rounded-[34px] bg-[#111] p-[7px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/15 ${className}`}>
      <div className="relative aspect-[390/844] overflow-hidden rounded-[28px]">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 220px, 40vw" placeholder="blur" className="object-cover object-top" />
        <span aria-hidden="true" className="absolute left-1/2 top-2 h-[18px] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </figure>
  );
}
