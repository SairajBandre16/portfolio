"use client";

import { useRef, useState } from "react";
import { LoaderCircle, Pause, Play } from "lucide-react";
import { song } from "@/content/home";
import { cn } from "@/lib/utils";

// The slice of Spotify's iFrame API this player uses.
type Playback = { isPaused: boolean; isBuffering: boolean; position: number; duration: number };
type Controller = {
  play: () => void;
  togglePlay: () => void;
  addListener: (event: string, cb: (e: { data: Playback }) => void) => void;
};
type IFrameAPI = {
  createController: (
    el: HTMLElement,
    options: { uri: string; width: number; height: number },
    cb: (controller: Controller) => void,
  ) => void;
};
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
  }
}

let api: Promise<IFrameAPI> | null = null;

/** Loads Spotify's iFrame API once, on first use. */
function loadApi() {
  api ??= new Promise((resolve) => {
    window.onSpotifyIframeApiReady = resolve;
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
  });
  return api;
}

/** Milliseconds as m:ss. */
const clock = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * A small record player for the hero: a sleeve with the record sliding out of it, the song,
 * and a play button. Nothing loads until it is pressed; then Spotify's embed streams the song
 * from a hidden frame and this card drives it.
 */
export function MusicPlayer({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const [time, setTime] = useState({ position: 0, duration: 0 });

  // Start fetching the API as soon as the pointer comes near, so the press feels instant.
  const warm = () => void loadApi();

  const toggle = async () => {
    if (controller.current) return controller.current.togglePlay();
    if (state === "loading" || !host.current) return;
    setState("loading");
    const IFrame = await loadApi();
    const mount = document.createElement("div");
    host.current.appendChild(mount);
    IFrame.createController(mount, { uri: song.spotifyUri, width: 300, height: 80 }, (c) => {
      controller.current = c;
      // Spotify marks its frame lazy, and a hidden frame would never load.
      host.current?.querySelector("iframe")?.setAttribute("loading", "eager");
      // "ready" can fire again if the frame reloads; only the first press should start it.
      let started = false;
      c.addListener("ready", () => {
        if (started) return;
        started = true;
        c.play();
      });
      c.addListener("playback_update", ({ data }) => {
        if (data.isBuffering) return;
        setState(data.isPaused ? "paused" : "playing");
        setTime({ position: data.position, duration: data.duration });
      });
    });
  };

  const playing = state === "playing";
  const started = state === "playing" || state === "paused";
  const progress = time.duration ? Math.min(time.position / time.duration, 1) : 0;

  return (
    <div
      data-playing={playing}
      className={cn(
        "player group/player bg-surface relative flex w-[17.5rem] items-center gap-3 overflow-hidden rounded-[1.1rem] py-2 pr-2 pl-2 shadow-[inset_0_0_0_1px_var(--line)] sm:w-[19rem]",
        className,
      )}
    >
      {/* Sleeve and record. The record peeks out, slides further and spins while playing. */}
      <span aria-hidden className="relative h-11 w-[4.2rem] shrink-0">
        <span
          className="player-record record absolute top-0 left-0 size-11 rounded-full"
          data-spin={playing}
        />
        <span className="player-sleeve absolute top-0 left-0 grid size-11 place-items-end justify-items-start overflow-hidden rounded-[0.55rem] p-1.5">
          <span className="font-mono text-[0.5rem] leading-none font-medium tracking-[0.08em] text-black/70 uppercase">
            {song.artist}
          </span>
        </span>
      </span>

      <span className="min-w-0 flex-1 leading-tight">
        <span className="label text-soft flex items-center gap-1.5">
          <span aria-hidden className="eq" data-on={playing}>
            <i />
            <i />
            <i />
          </span>
          <span aria-live="polite">{playing ? "Now playing" : started ? "Paused" : song.note}</span>
        </span>
        <span className="text-fg mt-1 block truncate text-[0.95rem] font-medium">{song.title}</span>
        <span className="label text-soft mt-0.5 flex items-center gap-1.5">
          <span>{song.artist}</span>
          <span aria-hidden>·</span>
          {started ? (
            <span className="tabular-nums">
              {clock(time.position)} / {clock(time.duration)}
            </span>
          ) : (
            <a
              href={song.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line hover:text-fg"
            >
              Spotify
            </a>
          )}
        </span>
      </span>

      <button
        type="button"
        onClick={toggle}
        onPointerEnter={warm}
        onFocus={warm}
        aria-label={`${playing ? "Pause" : "Play"} ${song.title} by ${song.artist}`}
        aria-pressed={playing}
        className="bg-fg text-bg grid size-10 shrink-0 place-items-center rounded-full transition-transform duration-300 ease-[var(--ease-out-expo)] hover:scale-105 active:scale-95"
      >
        {state === "loading" ? (
          <LoaderCircle size={16} className="animate-spin" aria-hidden />
        ) : playing ? (
          <Pause size={14} fill="currentColor" strokeWidth={0} aria-hidden />
        ) : (
          <Play
            size={14}
            fill="currentColor"
            strokeWidth={0}
            className="translate-x-px"
            aria-hidden
          />
        )}
      </button>

      {/* Progress runs along the bottom edge of the card. */}
      <span aria-hidden className="bg-line absolute inset-x-0 bottom-0 h-[2px]">
        <span
          className="bg-accent block h-full origin-left transition-transform duration-700 ease-linear"
          style={{ transform: `scaleX(${progress})` }}
        />
      </span>

      {/* Spotify's own player lives here, out of sight. */}
      <div
        ref={host}
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 -z-10 opacity-0"
      />
    </div>
  );
}
