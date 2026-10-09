import Link from "next/link";
import { projects } from "@/content/projects";
import { cn } from "@/lib/utils";

// Bearing (degrees clockwise from north) and range (0 to 1) for each project contact.
const plots: Record<string, { bearing: number; range: number; label: string }> = {
  queryforge: { bearing: 38, range: 0.56, label: "QueryForge" },
  chainwatch: { bearing: 128, range: 0.74, label: "ChainWatch" },
  squawk: { bearing: 212, range: 0.46, label: "SQUAWK" },
  "ergode-automation": { bearing: 290, range: 0.72, label: "Ergode RPA" },
  "personal-automations": { bearing: 334, range: 0.3, label: "Life admin" },
};

const SWEEP_SECONDS = 6;
const C = 200;
const R = 198;

function polar(bearing: number, radius: number) {
  const a = (bearing * Math.PI) / 180;
  return { x: C + Math.sin(a) * radius, y: C - Math.cos(a) * radius };
}

/** A radar scope where each blip is a project. Pure CSS animation, no client JS. */
export function Radar() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px] select-none">
      <svg viewBox="0 0 400 400" className="absolute inset-0 size-full text-fg" aria-hidden>
        <defs>
          <radialGradient id="scope-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={C} cy={C} r={R} fill="url(#scope-fill)" stroke="currentColor" strokeOpacity="0.18" />
        {[148, 99, 50].map((r) => (
          <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="currentColor" strokeOpacity="0.09" />
        ))}
        <path d="M200 2V398M2 200H398" stroke="currentColor" strokeOpacity="0.07" />
        {Array.from({ length: 72 }, (_, i) => {
          const major = i % 6 === 0;
          const p1 = polar(i * 5, R);
          const p2 = polar(i * 5, R - (major ? 10 : 4));
          return (
            <line
              key={i}
              x1={p1.x.toFixed(2)}
              y1={p1.y.toFixed(2)}
              x2={p2.x.toFixed(2)}
              y2={p2.y.toFixed(2)}
              stroke="currentColor"
              strokeOpacity={major ? 0.35 : 0.15}
            />
          );
        })}
        {["N", "E", "S", "W"].map((l, i) => {
          const p = polar(i * 90, 176);
          return (
            <text
              key={l}
              x={p.x.toFixed(2)}
              y={(p.y + 4).toFixed(2)}
              textAnchor="middle"
              fontSize="10"
              fontFamily="var(--font-geist-mono)"
              fill="currentColor"
              fillOpacity="0.4"
            >
              {l}
            </text>
          );
        })}
      </svg>

      {/* Sweep: a conic wedge whose bright edge leads clockwise */}
      <div
        aria-hidden
        className="animate-sweep absolute inset-[0.5%] rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 290deg, color-mix(in oklab, var(--accent) 20%, transparent) 345deg, color-mix(in oklab, var(--accent) 55%, transparent) 359.5deg, transparent 360deg)",
          animationDuration: `${SWEEP_SECONDS}s`,
        }}
      />

      {/* Home: Dublin */}
      <div className="absolute top-1/2 left-1/2" aria-hidden>
        <span className="block size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg" />
        <span className="hud absolute top-2 left-0 -translate-x-1/2 text-[10px] text-subtle">DUB</span>
      </div>

      <ul aria-label="Projects on the radar">
        {projects.map((p) => {
          const plot = plots[p.slug];
          if (!plot) return null;
          const { x, y } = polar(plot.bearing, plot.range * 192);
          const left = (x / 400) * 100;
          const top = (y / 400) * 100;
          const flip = left > 60;
          return (
            <li key={p.slug} className="absolute size-0" style={{ left: `${left}%`, top: `${top}%` }}>
              <Link
                href={`/projects/${p.slug}`}
                className="group absolute -top-4 -left-4 block size-8 rounded-full focus-visible:outline-offset-0"
                aria-label={`${p.title}: open case study`}
              >
                <span
                  className="animate-blip absolute top-1/2 left-1/2 -mt-[5px] -ml-[5px] size-2.5 rounded-full bg-accent opacity-40"
                  style={{
                    animationDelay: `${(plot.bearing / 360) * SWEEP_SECONDS}s`,
                    animationDuration: `${SWEEP_SECONDS}s`,
                  }}
                />
                <span className="absolute top-1/2 left-1/2 -mt-[11px] -ml-[11px] size-[22px] rounded-full border border-transparent transition-colors duration-300 group-hover:border-accent group-focus-visible:border-accent" />
                <span
                  className={cn(
                    "hud absolute top-1/2 -translate-y-1/2 text-[10px] leading-tight whitespace-nowrap text-subtle transition-colors group-hover:text-fg group-focus-visible:text-fg",
                    flip ? "right-8 text-right" : "left-8",
                  )}
                >
                  <span className="block text-accent">{p.callsign}</span>
                  <span className="block">{plot.label}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
