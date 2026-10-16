"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore, writeStore } from "@/lib/local-store";
import { SPAWN_PLANE_EVENT } from "./command-menu";

// A little game for fellow spotters: now and then a plane crosses the screen. Click it.
// Callsigns and types are made up on the spot; it's a toy, not a flight tracker.

const TYPES = ["A320", "B738", "A21N", "B789", "A359", "E190", "AT76", "B77W"];
const AIRLINES = ["EIN", "RYR", "BAW", "KLM", "DLH", "AFR", "UAE", "AIC"];
const KEY = "sb-planes-spotted";

type Flight = { id: number; ltr: boolean; top: number; climb: number; duration: number };
type Sighting = { callsign: string; type: string; level: string };

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

function PlaneGlyph() {
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
      <path
        fill="currentColor"
        d="M50 3 53.6 9 54 40 94 58 94 63 54 55.5 53.4 82 68 92 68 95.5 52 92.5 50 97 48 92.5 32 95.5 32 92 46.6 82 46 55.5 6 63 6 58 46 40 46.4 9Z"
      />
    </svg>
  );
}

/** The spotting tally, shown in the nav once you've spotted at least one plane. */
export function SpottedCount() {
  const count = Number(useStore(KEY, "0")) || 0;
  return (
    <AnimatePresence initial={false}>
      {count > 0 && (
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex h-9 items-center"
          title="Planes cross the screen now and then. Click one to spot it."
        >
          <span className="text-fg flex items-center gap-1.5 px-2.5 whitespace-nowrap">
            <span className="text-accent block size-3.5 rotate-45">
              <PlaneGlyph />
            </span>
            <span className="font-mono text-xs tabular-nums">{String(count).padStart(2, "0")}</span>
            <span className="sr-only">planes spotted</span>
          </span>
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function PlaneSpotter() {
  const [flight, setFlight] = useState<Flight | null>(null);
  const [flights, setFlights] = useState(0);
  const [sighting, setSighting] = useState<Sighting | null>(null);
  const count = Number(useStore(KEY, "0")) || 0;

  // Whenever the sky is empty, schedule the next plane: the first one soon, then every so
  // often. The command menu can also call one in on demand.
  useEffect(() => {
    if (flight || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const launch = () => {
      setFlights((n) => n + 1);
      setFlight({
        id: Date.now(),
        ltr: Math.random() > 0.35,
        top: 14 + Math.random() * 58,
        climb: (Math.random() - 0.5) * 22,
        duration: 9 + Math.random() * 5,
      });
    };
    const delay = flights === 0 ? 9000 : 22000 + Math.random() * 22000;
    const t = window.setTimeout(launch, delay);
    window.addEventListener(SPAWN_PLANE_EVENT, launch);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(SPAWN_PLANE_EVENT, launch);
    };
  }, [flight, flights]);

  useEffect(() => {
    if (!sighting) return;
    const t = window.setTimeout(() => setSighting(null), 3200);
    return () => window.clearTimeout(t);
  }, [sighting]);

  const land = () => setFlight(null);

  const spot = () => {
    writeStore(KEY, String(count + 1));
    setSighting({
      callsign: `${pick(AIRLINES)}${Math.floor(100 + Math.random() * 899)}`,
      type: pick(TYPES),
      level: `FL${Math.floor(28 + Math.random() * 12) * 10}`,
    });
    land();
  };

  return (
    <>
      <AnimatePresence>
        {flight && (
          <motion.button
            key={flight.id}
            type="button"
            onClick={spot}
            aria-label="A plane is flying past. Spot it!"
            className="text-fg focus-visible:outline-accent fixed left-0 z-[45] grid size-14 cursor-crosshair place-items-center"
            style={{ top: `${flight.top}vh` }}
            initial={{ x: flight.ltr ? "-12vw" : "108vw", y: 0, opacity: 1 }}
            animate={{ x: flight.ltr ? "108vw" : "-12vw", y: `${flight.climb}vh` }}
            exit={{ scale: 1.8, opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: flight.duration, ease: "linear" }}
            onAnimationComplete={(def) => {
              if (typeof def === "object" && def !== null && "x" in def) land();
            }}
          >
            <span
              className="relative block size-7"
              style={{ rotate: `${(flight.ltr ? 90 : -90) - flight.climb * 1.2}deg` }}
            >
              <PlaneGlyph />
              <span
                aria-hidden
                className="from-fg/50 absolute top-[92%] left-1/2 h-24 w-px -translate-x-1/2 bg-gradient-to-b to-transparent"
              />
            </span>
            <span
              aria-hidden
              className="animate-ping-slow border-accent/60 absolute inset-2 rounded-full border"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-[46] flex justify-center px-4 md:bottom-6"
      >
        <AnimatePresence>
          {sighting && (
            <motion.p
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="panel text-fg rounded-2xl px-5 py-3 text-sm"
            >
              <span className="tag text-accent mr-2">Spotted</span>
              <span className="font-mono">{sighting.callsign}</span> · {sighting.type} ·{" "}
              {sighting.level}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
