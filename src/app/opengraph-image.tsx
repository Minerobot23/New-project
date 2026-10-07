import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MARK_STEM = "M8.9 35l4.3-25.5C13.8 6.6 15.4 5 18.6 5H37l-1.5 7.2H20.6L16 35z";
const MARK_ARM = "M21.4 16.2h11.4l-1.4 6.9H20z";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "radial-gradient(circle at 85% 20%, #14305e 0%, #0b1420 55%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="76" height="76" viewBox="0 0 40 40">
            <path d={MARK_STEM} fill="#ffffff" />
            <path d={MARK_ARM} fill="#2f7cff" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 46, fontWeight: 700, letterSpacing: 1 }}>
              FLUX<span style={{ color: "#2f7cff" }}>LINE</span>
            </div>
            <div style={{ display: "flex", fontSize: 17, letterSpacing: 11, color: "#c7d2e0", marginTop: 2 }}>SOLUTIONS</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 70, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 940 }}>
            Websites Built to Turn Visitors Into Customers.
          </div>
          <div style={{ marginTop: 26, fontSize: 28, color: "#a9b6c6" }}>Websites · Design · Growth</div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#7d8a9a" }}>{site.domain}</div>
      </div>
    ),
    size,
  );
}
