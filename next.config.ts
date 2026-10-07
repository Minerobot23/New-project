import type { NextConfig } from "next";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // The apex domain is canonical. Vercel's domain settings should also redirect www; this is a safe backstop.
    return [
      // Old URL from the previous version of the site.
      { source: "/call", destination: "/request-a-call", permanent: true },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.fluxlinesolutions.com" }],
        destination: "https://fluxlinesolutions.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
