import { ImageResponse } from "next/og";

export const alt = "Sairaj Bandre: aspiring AI engineer in Dublin, building LLM agents and automations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const bg = "#0b0b0f";
const fg = "#f3f1ea";
const muted = "#a9a8b2";
const palette = ["#c8f53a", "#45e3f2", "#ff6b45", "#ff5fa2", "#ffd23f", "#7aaeff"];

// A deterministic sprinkle of "particles" in the scene colours.
const dots = Array.from({ length: 140 }, (_, i) => {
  const a = i * 2.399963;
  const r = 40 + Math.sqrt(i) * 19;
  return { x: 900 + Math.cos(a) * r, y: 315 + Math.sin(a) * r * 0.92, c: palette[i % palette.length], s: 3 + (i % 4) };
});

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: bg, color: fg, padding: 72, position: "relative" }}>
        {dots.map((d, i) => (
          <div
            key={i}
            style={{ position: "absolute", left: d.x, top: d.y, width: d.s, height: d.s, borderRadius: d.s, background: d.c, opacity: 0.85 }}
          />
        ))}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 700 }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 3, color: muted }}>FROM MUMBAI · NOW IN DUBLIN</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 120, lineHeight: 0.9, letterSpacing: -5, fontWeight: 800 }}>SAIRAJ</div>
            <div style={{ fontSize: 120, lineHeight: 0.9, letterSpacing: -5, fontWeight: 800, color: palette[0] }}>BANDRE</div>
          </div>
          <div style={{ display: "flex", fontSize: 30, color: muted }}>MSc student at UCD · learning AI · LLM agents</div>
        </div>
      </div>
    ),
    size,
  );
}
