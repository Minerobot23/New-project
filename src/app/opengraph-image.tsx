import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: "72px 80px",
          background: "#0d1720",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, fontSize: 40, fontWeight: 600 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 40, marginRight: 10 }}>
            <div style={{ width: 8, height: 16, background: "#0e6b5c", borderRadius: 2 }} />
            <div style={{ width: 8, height: 28, background: "#14937e", borderRadius: 2 }} />
            <div style={{ width: 8, height: 40, background: "#2bb59c", borderRadius: 2 }} />
          </div>
          Fluxline <span style={{ color: "#7d8a96", fontWeight: 400, marginLeft: 10 }}>Solutions</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
            Websites Built to Turn Visitors Into Customers.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#a9b4be" }}>{site.tagline}</div>
        </div>
        <div style={{ fontSize: 24, color: "#7d8a96" }}>{site.domain}</div>
      </div>
    ),
    size,
  );
}
