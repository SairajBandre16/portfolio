"use client";

import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-IE", {
  timeZone: "Europe/Dublin",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Live Dublin time. Renders a placeholder on the server so markup never mismatches. */
export function LiveClock({ seconds = true }: { seconds?: boolean }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => {
      const t = fmt.format(new Date());
      setNow(seconds ? t : t.slice(0, 5));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [seconds]);

  return (
    <time suppressHydrationWarning className="tabular-nums">
      {now ?? (seconds ? "--:--:--" : "--:--")}
    </time>
  );
}
