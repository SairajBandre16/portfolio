"use client";

import { useEffect, useState } from "react";

const rtf = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
const units: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

function relative(iso: string) {
  const diff = (Date.parse(iso) - Date.now()) / 1000;
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs) return rtf.format(Math.round(diff / secs), unit);
  }
  return "just now";
}

const absolute = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** "2 days ago", computed in the browser so cached HTML never goes stale. */
export function RelativeTime({ iso }: { iso: string }) {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => setLabel(relative(iso)));
    return () => cancelAnimationFrame(id);
  }, [iso]);
  return (
    <time dateTime={iso} title={absolute.format(new Date(iso))} suppressHydrationWarning>
      {label ?? absolute.format(new Date(iso))}
    </time>
  );
}
