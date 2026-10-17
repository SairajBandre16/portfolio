import { ImageResponse } from "next/og";

export const alt = "Sairaj Bandre: MSc student at UCD in Dublin, learning AI by building with Claude Code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const bg = "#121210";
const fg = "#efede6";
const soft = "#8d8b83";
const accent = "#ff8a4c";

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
          background: bg,
          color: fg,
          padding: 80,
        }}
      >
        <div style={{ display: "flex", fontSize: 22, color: soft, letterSpacing: 1 }}>
          DUB · 53.35° N, 6.26° W
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", fontSize: 58, lineHeight: 1.3, letterSpacing: -1.5 }}>
          <span style={{ fontWeight: 700 }}>Hi, I’m Sairaj Bandre.&nbsp;</span>
          <span style={{ color: soft }}>An MSc student at UCD in Dublin,&nbsp;</span>
          <span style={{ fontWeight: 700 }}>deep diving into AI and building real-world products using Claude.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: soft }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: accent }} />
          Text-to-SQL agents · automation · plane-spotting
        </div>
      </div>
    ),
    size,
  );
}
