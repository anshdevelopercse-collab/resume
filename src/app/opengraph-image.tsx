import { ImageResponse } from "next/og";

export const alt = "Ansh Sharma — Software Developer, Full-Stack & AI Applications";
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
          background: "#050506",
          padding: 72,
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", color: "#8c877c", fontSize: 22, letterSpacing: 6 }}>
          <span>PORTFOLIO / 2026</span>
          <span>B.TECH CSE / 2027</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#ede6d6", fontSize: 190, lineHeight: 0.9, letterSpacing: -6, fontWeight: 300 }}>ANSH</div>
          <div
            style={{
              color: "transparent",
              fontSize: 190,
              lineHeight: 0.9,
              letterSpacing: -4,
              marginLeft: 120,
              fontStyle: "italic",
              WebkitTextStroke: "2px #c8a24a",
            }}
          >
            SHARMA
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#e7d3a1", fontSize: 28, letterSpacing: 5 }}>
          <div style={{ width: 90, height: 2, background: "#c8a24a" }} />
          SOFTWARE DEVELOPER — FULL-STACK &amp; AI APPLICATIONS
        </div>
        <div
          style={{
            position: "absolute",
            right: 90,
            top: 90,
            width: 0,
            height: 0,
            borderLeft: "70px solid transparent",
            borderRight: "70px solid transparent",
            borderBottom: "300px solid #141416",
            transform: "rotate(14deg)",
            display: "flex",
          }}
        />
      </div>
    ),
    size,
  );
}
