/**
 * Lightweight SVG illustrations standing in for photography in the concept demos.
 * Inline SVG keeps the simulator fast: no image requests, crisp at any scale.
 */

type SceneProps = { className?: string; /** Fill the box like object-fit: cover. */ cover?: boolean };

const fit = (cover?: boolean) => (cover ? "xMidYMid slice" : "xMidYMid meet");

export function HvacScene({ className = "", cover }: SceneProps) {
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio={fit(cover)} className={className} role="img" aria-label="Illustration: technician servicing an outdoor AC unit beside a house">
      <defs>
        <linearGradient id="hv-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#cfe3f5" />
          <stop offset="1" stopColor="#eef4fa" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#hv-sky)" />
      <rect y="300" width="600" height="100" fill="#9cc58a" />
      <rect y="300" width="600" height="14" fill="#86b374" />
      <path d="M90 300V170l130-90 130 90v130z" fill="#f4efe6" />
      <path d="M70 178 220 72l150 106-14 14L220 96 84 192z" fill="#3a4a5c" />
      <rect x="150" y="200" width="56" height="56" fill="#9fc3e6" stroke="#fff" strokeWidth="6" />
      <rect x="236" y="220" width="54" height="80" fill="#6b4f3a" />
      <g transform="translate(380 228)">
        <rect width="120" height="80" rx="8" fill="#e9ecef" stroke="#c4ccd4" strokeWidth="3" />
        <circle cx="60" cy="40" r="28" fill="#cfd6dd" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x="36" y={22 + i * 8} width="48" height="3" rx="1.5" fill="#9aa5b1" />
        ))}
      </g>
      <g transform="translate(520 196)">
        <circle cx="20" cy="18" r="16" fill="#e0b48a" />
        <rect x="2" y="36" width="36" height="58" rx="10" fill="#f26b1d" />
        <rect x="6" y="92" width="12" height="20" fill="#1f3550" />
        <rect x="22" y="92" width="12" height="20" fill="#1f3550" />
        <rect x="4" y="6" width="32" height="10" rx="5" fill="#1f3550" />
      </g>
    </svg>
  );
}

export function PlatesScene({ className = "", cover }: SceneProps) {
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio={fit(cover)} className={className} role="img" aria-label="Illustration: overhead view of pasta and antipasti on a wooden table">
      <rect width="600" height="400" fill="#5b3a26" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} y={i * 68} width="600" height="2" fill="#4a2f1f" />
      ))}
      <g transform="translate(200 190)">
        <circle r="120" fill="#f7f3ec" />
        <circle r="96" fill="#efe7da" />
        <ellipse rx="70" ry="58" fill="#e8b04e" />
        {[...Array(9)].map((_, i) => (
          <path key={i} d={`M${-60 + i * 14} -30 q 10 30 -4 60`} stroke="#d39a36" strokeWidth="5" fill="none" strokeLinecap="round" />
        ))}
        <circle cx="-20" cy="-10" r="10" fill="#c0392b" />
        <circle cx="22" cy="14" r="9" fill="#c0392b" />
        <circle cx="4" cy="-24" r="6" fill="#3f7d3a" />
        <circle cx="-30" cy="22" r="6" fill="#3f7d3a" />
      </g>
      <g transform="translate(450 120)">
        <circle r="78" fill="#f7f3ec" />
        <circle r="60" fill="#efe7da" />
        <circle cx="-22" cy="-10" r="18" fill="#c94f3d" />
        <circle cx="18" cy="-18" r="16" fill="#f1e3b8" />
        <circle cx="10" cy="22" r="18" fill="#c94f3d" />
        <circle cx="-20" cy="26" r="10" fill="#4c8a3f" />
      </g>
      <g transform="translate(470 310)">
        <circle r="46" fill="#7a1f2b" opacity=".9" />
        <circle r="34" fill="#9b2c3a" />
      </g>
      <rect x="40" y="40" width="10" height="120" rx="5" fill="#d9d4cb" transform="rotate(-20 45 100)" />
    </svg>
  );
}

export function SalonScene({ className = "", cover }: SceneProps) {
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio={fit(cover)} className={className} role="img" aria-label="Illustration: bright salon interior with a styling chair and mirror">
      <rect width="600" height="400" fill="#efe4da" />
      <rect y="290" width="600" height="110" fill="#d9c7b8" />
      <path d="M220 60h160v200a80 80 0 0 1-160 0z" fill="#f8f2ec" stroke="#c9a98f" strokeWidth="6" />
      <path d="M240 80h120v176a60 60 0 0 1-120 0z" fill="#e6dcd4" />
      <g transform="translate(300 230)">
        <rect x="-50" y="-10" width="100" height="70" rx="22" fill="#a8664f" />
        <rect x="-60" y="40" width="120" height="22" rx="11" fill="#8c5240" />
        <rect x="-6" y="62" width="12" height="40" fill="#5d5550" />
        <rect x="-40" y="100" width="80" height="8" rx="4" fill="#5d5550" />
      </g>
      <circle cx="90" cy="120" r="34" fill="#c9a98f" opacity=".5" />
      <rect x="470" y="120" width="70" height="170" rx="8" fill="#f8f2ec" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x="480" y={140 + i * 46} width="50" height="30" rx="4" fill="#e1cfc1" />
      ))}
      <path d="M80 300c0-50 20-80 20-80s20 30 20 80z" fill="#7d9a76" />
    </svg>
  );
}

export function GarageScene({ className = "", cover }: SceneProps) {
  return (
    <svg viewBox="0 0 600 400" preserveAspectRatio={fit(cover)} className={className} role="img" aria-label="Illustration: car on a lift in a clean, well-lit service bay">
      <rect width="600" height="400" fill="#1e2a35" />
      <rect y="320" width="600" height="80" fill="#2c3a47" />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={60 + i * 190} y="30" width="120" height="10" rx="5" fill="#f4f7fb" opacity=".85" />
      ))}
      <rect x="120" y="250" width="16" height="70" fill="#f2b705" />
      <rect x="464" y="250" width="16" height="70" fill="#f2b705" />
      <rect x="110" y="240" width="380" height="12" rx="4" fill="#d7dee5" />
      <g transform="translate(150 150)">
        <path d="M20 70c10-30 40-46 70-50l50-26c30-12 90-12 120 0l50 30c30 4 40 20 40 46v20H20z" fill="#d9483b" />
        <path d="M120 4h96l40 30H96z" fill="#9fc0dc" />
        <circle cx="80" cy="92" r="26" fill="#141b22" />
        <circle cx="80" cy="92" r="11" fill="#9aa5b1" />
        <circle cx="270" cy="92" r="26" fill="#141b22" />
        <circle cx="270" cy="92" r="11" fill="#9aa5b1" />
      </g>
      <rect x="40" y="200" width="50" height="120" rx="6" fill="#33485b" />
      <rect x="48" y="212" width="34" height="8" rx="2" fill="#5b7186" />
      <rect x="48" y="228" width="34" height="8" rx="2" fill="#5b7186" />
    </svg>
  );
}

/** The same imagery as a dated site would present it: small, washed out, framed with a hard border. */
export function DatedPhoto({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden border-4 border-white shadow-[0_0_0_1px_#999] [filter:saturate(.55)_contrast(.85)_brightness(1.05)] ${className}`}>
      {children}
    </div>
  );
}
