import Image, { type StaticImageData } from "next/image";

type Props = {
  desktop: StaticImageData;
  mobile: StaticImageData;
  /** Accessible description of what the screens show. */
  alt: string;
  /** Load eagerly with high priority (use for an above-the-fold showcase). */
  eager?: boolean;
  className?: string;
};

/** A laptop with an overlapping phone, both showing real screenshots. */
export function DeviceShowcase({ desktop, mobile, alt, eager = false, className = "" }: Props) {
  return (
    <figure className={`relative pb-[6%] pr-[9%] ${className}`}>
      <div className="relative">
        <div className="rounded-t-[14px] border border-white/10 bg-[#0a0f16] p-[1.6%] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
          <div className="relative aspect-[1400/888] overflow-hidden rounded-[4px] bg-[#111]">
            <Image
              src={desktop}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 620px, 90vw"
              className="object-cover object-top"
              placeholder="blur"
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
            />
          </div>
        </div>
        <div
          aria-hidden="true"
          className="relative -mx-[5%] h-3 rounded-b-xl bg-gradient-to-b from-[#c9d0da] to-[#8d96a3] sm:h-4"
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-[14%] -translate-x-1/2 rounded-b-md bg-[#7d8693]" />
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-[24%] rounded-[18%/9%] border border-white/15 bg-[#0a0f16] p-[1.4%] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.85)]">
        <div className="relative aspect-[640/1282] overflow-hidden rounded-[15%/7.5%] bg-[#111]">
          <Image
            src={mobile}
            alt=""
            fill
            sizes="(min-width: 1024px) 160px, 24vw"
            className="object-cover object-top"
            placeholder="blur"
          />
        </div>
      </div>
    </figure>
  );
}
