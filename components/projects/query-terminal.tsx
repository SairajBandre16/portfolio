"use client";

import { memo, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Line = { kind: "q" | "sql" | "err" | "fix" | "ok"; text: string };

// One self-correction cycle, the loop QueryForge runs on every question.
const script: Line[] = [
  { kind: "q", text: "Which 5 customers spent the most?" },
  { kind: "sql", text: "SELECT name, SUM(amount) FROM orders ..." },
  { kind: "err", text: "no such column: name" },
  { kind: "fix", text: "retry 1/2 · error fed back to model" },
  { kind: "sql", text: "SELECT c.name, SUM(o.amount) AS spent\n  FROM customers c JOIN orders o ON ...\n  GROUP BY c.id ORDER BY spent DESC LIMIT 5" },
  { kind: "ok", text: "5 rows returned · read-only connection" },
];

const prefix: Record<Line["kind"], string> = { q: "?", sql: "›", err: "✕", fix: "↻", ok: "✓" };
const tone: Record<Line["kind"], string> = {
  q: "text-fg",
  sql: "text-muted",
  err: "text-[#e5484d]",
  fix: "text-accent",
  ok: "text-ok",
};

/** Plays the self-correction loop line by line, then restarts. Static for reduced motion. */
export const QueryTerminal = memo(function QueryTerminal() {
  const [shown, setShown] = useState(script.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(1);
    let n = 1;
    const id = window.setInterval(() => {
      n = n >= script.length + 2 ? 1 : n + 1;
      setShown(Math.min(n, script.length));
    }, 1100);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="overflow-hidden rounded-2xl border border-line bg-sunken font-mono text-[11.5px] leading-relaxed sm:text-xs"
      aria-label="Example: QueryForge writes SQL, hits an error, retries with the error message and returns 5 rows"
      role="img"
    >
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-2.5">
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="size-2 rounded-full bg-line-strong" />
        <span className="hud ml-3 text-[10px] text-subtle">queryforge ask --db shop.sqlite</span>
      </div>
      <div className="min-h-[196px] space-y-1.5 p-4">
        {script.slice(0, shown).map((line, i) => (
          <div key={i} className={cn("flex gap-3 whitespace-pre-wrap", tone[line.kind])}>
            <span className="w-3 shrink-0 text-subtle">{prefix[line.kind]}</span>
            <span>{line.text}</span>
          </div>
        ))}
        {shown < script.length && <span className="animate-caret ml-6 inline-block h-3.5 w-1.5 bg-accent align-middle" />}
      </div>
    </div>
  );
});
