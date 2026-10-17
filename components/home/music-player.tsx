"use client";

import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
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

/**
 * A small record player for the hero. Nothing loads until it is pressed; then Spotify's
 * embed streams the song from an off-screen frame and this button drives it.
 */
export function MusicPlayer({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<Controller | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const [progress, setProgress] = useState(0);

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
        setProgress(data.duration ? data.position / data.duration : 0);
      });
    });
  };

  const playing = state === "playing";

  return (
    <div
      className={cn(
        "bg-surface inline-flex h-12 items-center gap-3 rounded-full py-1.5 pr-4 pl-1.5 shadow-[inset_0_0_0_1px_var(--line)]",
        className,
      )}
    >
      <button
        type="button"
        onClick={toggle}
        onPointerEnter={warm}
        onFocus={warm}
        aria-label={`${playing ? "Pause" : "Play"} ${song.title} by ${song.artist}`}
        aria-pressed={playing}
        className="group relative grid size-9 shrink-0 place-items-center rounded-full active:scale-95"
      >
        {/* The record: grooves, a label in the accent colour, and a spin while it plays. */}
        <span aria-hidden className="record absolute inset-0 rounded-full" data-spin={playing} />
        <span
          aria-hidden
          className={cn(
            "bg-fg text-bg relative grid size-4 place-items-center rounded-full transition-transform duration-300 group-hover:scale-110",
            state === "loading" && "animate-pulse",
          )}
        >
          {playing ? (
            <Pause size={8} fill="currentColor" strokeWidth={0} />
          ) : (
            <Play size={8} fill="currentColor" strokeWidth={0} className="translate-x-px" />
          )}
        </span>
      </button>
      <span className="min-w-0 leading-tight">
        <span className="text-fg flex items-center gap-2 text-sm font-medium">
          <span className="truncate">{song.title}</span>
          <span aria-hidden className="eq" data-on={playing}>
            <i />
            <i />
            <i />
          </span>
        </span>
        <span className="label text-soft flex items-center gap-1.5">
          <span>{song.artist}</span>
          <span aria-hidden>·</span>
          <a
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-line hover:text-fg"
          >
            {state === "idle" ? song.note : "Spotify"}
          </a>
        </span>
        <span aria-hidden className="bg-line mt-1 block h-px w-full overflow-hidden rounded-full">
          <span
            className="bg-accent block h-full origin-left transition-transform duration-700 ease-linear"
            style={{ transform: `scaleX(${progress})` }}
          />
        </span>
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
