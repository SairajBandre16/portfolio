import { ImageResponse } from "next/og";

export const alt = "Sairaj Bandre: from automating warehouses to building AI systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const bg = "#0d0e10";
const fg = "#ecebe8";
const muted = "#a3a3a8";
const accent = "#eea53a";

export default function OpengraphImage() {
  const rings = [420, 300, 180];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: bg,
          color: fg,
          padding: 72,
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Radar rings on the right */}
        {rings.map((d) => (
          <div
            key={d}
            style={{
              position: "absolute",
              right: 120 - d / 2 + 210,
              top: 315 - d / 2,
              width: d,
              height: d,
              borderRadius: d,
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          />
        ))}
        <div style={{ position: "absolute", right: 322, top: 307, width: 16, height: 16, borderRadius: 16, background: fg }} />
        <div style={{ position: "absolute", right: 240, top: 190, width: 18, height: 18, borderRadius: 18, background: accent }} />
        <div style={{ position: "absolute", right: 420, top: 420, width: 12, height: 12, borderRadius: 12, background: accent, opacity: 0.6 }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 760 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, color: muted }}>
            53.35°N 6.26°W · DUBLIN · SAIRAJ BANDRE
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -2, fontWeight: 600 }}>
              From automating warehouses
            </div>
            <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -2, color: accent, fontStyle: "italic" }}>
              to building AI systems.
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: muted }}>
            Aspiring AI Engineer · MSc CS at UCD · building with Claude Code
          </div>
        </div>
      </div>
    ),
    size,
  );
}
