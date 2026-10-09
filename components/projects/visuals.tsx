import { FileSpreadsheet, Mail, Send, Sheet, Sparkles } from "lucide-react";
import { QueryTerminal } from "./query-terminal";
import { AlertsTicker } from "./alerts-ticker";

/** India to Rotterdam via Suez, with the Red Sea alert and the Cape of Good Hope detour. */
export function LaneMap() {
  return (
    <div className="relative">
      <svg viewBox="0 0 300 220" className="w-full text-fg" role="img" aria-label="Shipping lane from Nhava Sheva to Rotterdam via Suez, with a disruption alert in the Red Sea and the longer Cape of Good Hope detour">
        {/* Schematic coastline hints */}
        <path d="M120 40 Q150 20 190 30 L210 60 Q200 90 175 100 L160 140 Q150 190 130 200" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="10" strokeLinecap="round" />
        {/* Main lane */}
        <path id="lane" d="M262 120 C 230 118 205 108 188 96 L 168 66 C 150 48 110 40 50 32" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeDasharray="2 5" />
        {/* Detour */}
        <path d="M262 120 C 240 160 200 200 150 208 C 100 214 60 170 40 110 C 34 80 40 50 50 32" fill="none" stroke="var(--accent)" strokeOpacity="0.55" strokeDasharray="5 5" className="animate-dash" />
        {/* Ports */}
        <circle cx="262" cy="120" r="3.5" fill="currentColor" />
        <circle cx="50" cy="32" r="3.5" fill="currentColor" />
        <text x="258" y="138" fontSize="8" textAnchor="end" fill="currentColor" fillOpacity="0.55" fontFamily="var(--font-geist-mono)">NHAVA SHEVA</text>
        <text x="56" y="24" fontSize="8" fill="currentColor" fillOpacity="0.55" fontFamily="var(--font-geist-mono)">ROTTERDAM</text>
        {/* Red Sea alert */}
        <g transform="translate(182 88)">
          <circle r="6" fill="var(--accent)" fillOpacity="0.4" className="animate-ping-slow [transform-box:fill-box] [transform-origin:center]" />
          <circle r="4" fill="var(--accent)" />
        </g>
        <text x="196" y="80" fontSize="8" fill="var(--accent)" fontFamily="var(--font-geist-mono)">RED SEA · ALERT</text>
        <text x="96" y="196" fontSize="8" fill="var(--accent)" fillOpacity="0.85" fontFamily="var(--font-geist-mono)">CAPE DETOUR +4,540 NM</text>
      </svg>
    </div>
  );
}

const nodes = [
  { icon: Mail, label: "Gmail" },
  { icon: Sheet, label: "Sheets" },
  { icon: FileSpreadsheet, label: "Excel" },
  { icon: Sparkles, label: "AI insight" },
  { icon: Send, label: "Report" },
];

/** Invoice pipeline with a packet travelling between stages. */
export function Pipeline() {
  return (
    <div className="relative px-1" aria-hidden>
      <div className="absolute top-[18px] right-[10%] left-[10%] h-px bg-line-strong" />
      <div className="absolute top-[18px] right-[10%] left-[10%] h-px">
        <div className="animate-packet absolute inset-0">
          <span className="absolute top-[-3px] left-0 block size-[7px] rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-soft)]" />
        </div>
      </div>
      <ol className="relative grid grid-cols-5">
        {nodes.map(({ icon: Icon, label }) => (
          <li key={label} className="flex flex-col items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl border border-line-strong bg-raised text-muted">
              <Icon size={15} strokeWidth={1.6} />
            </span>
            <span className="hud text-[9px] text-subtle">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export { QueryTerminal, AlertsTicker };
