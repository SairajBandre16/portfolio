"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { clocks } from "@/content/home";
import { cn } from "@/lib/utils";

const formatters = new Map(
  clocks.map((c) => [
    c.code,
    new Intl.DateTimeFormat("en-GB", {
      timeZone: c.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }),
  ]),
);

const timeIn = (code: string, now: Date) => formatters.get(code)?.format(now) ?? "--:--";

/** One character on the board. Remounts when the character changes, which plays the flip. */
function Flaps({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {[...text].map((ch, i) =>
        ch === ":" ? (
          <span key={i} aria-hidden className="text-soft -mx-px">
            :
          </span>
        ) : (
          <span key={i} aria-hidden className="flap">
            <span key={ch} style={{ "--i": i + offset } as React.CSSProperties}>
              {ch}
            </span>
          </span>
        ),
      )}
    </>
  );
}

/** A departures-board clock for Dublin, with Mumbai one click away. */
export function FlightClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [code, setCode] = useState(clocks[0].code);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = requestAnimationFrame(tick);
    const id = window.setInterval(tick, 10_000);
    return () => {
      cancelAnimationFrame(first);
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = clocks.find((c) => c.code === code) ?? clocks[0];
  const time = now ? timeIn(active.code, now) : "--:--";

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Local time in ${active.city}: ${time}. Show other cities`}
        className="bg-surface text-fg hover:bg-surface-2/70 flex h-10 items-center gap-2.5 rounded-full py-1 pr-3 pl-1.5 font-mono text-[0.8rem] shadow-[inset_0_0_0_1px_var(--line)] transition-colors"
      >
        <span className="flex items-center gap-[2px]">
          <Flaps text={active.code} />
        </span>
        <span className="flex items-center gap-[2px] tabular-nums">
          <Flaps text={time} offset={3} />
        </span>
        <ChevronDown
          size={14}
          className={cn("text-soft transition-transform duration-300", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          "bg-surface absolute top-[calc(100%+0.5rem)] right-0 z-30 w-60 origin-top-right rounded-2xl p-1.5 shadow-[0_18px_40px_-12px_rgb(var(--shadow)/0.35),inset_0_0_0_1px_var(--line)] transition-[opacity,scale] duration-300",
          open ? "scale-100 opacity-100" : "pointer-events-none invisible scale-95 opacity-0",
        )}
      >
        <ul>
          {clocks.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                onClick={() => {
                  setCode(c.code);
                  setOpen(false);
                }}
                aria-current={c.code === code ? "true" : undefined}
                className="hover:bg-surface-2/70 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors"
              >
                <span className="text-fg font-mono text-xs">{c.code}</span>
                <span className="text-fg flex-1 text-sm">
                  {c.city}
                  <span className="text-soft"> · {c.note}</span>
                </span>
                <span className="text-soft font-mono text-xs tabular-nums">
                  {now ? timeIn(c.code, now) : "--:--"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
