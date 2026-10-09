import Link from "next/link";
import { ArrowDownRight, ArrowRight, FileDown } from "lucide-react";
import { profile } from "@/lib/site";
import { ButtonLink } from "@/components/ui/button-link";
import { Magnetic } from "@/components/ui/magnetic";
import { LiveClock } from "./live-clock";
import { RoleTicker } from "./role-ticker";
import { Radar } from "./radar";

export function Hero() {
  const { location, now } = profile;
  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Hairline grid that fades out towards the edges */}
      <div
        aria-hidden
        className="hairline-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_70%_60%_at_65%_45%,#000_25%,transparent_75%)]"
      />

      <div className="container-page flex min-h-[100dvh] flex-col pt-24 pb-10 sm:pt-28">
        <div className="rise hud flex flex-wrap items-center gap-x-4 gap-y-2 text-subtle">
          <span>
            {location.lat.toFixed(2)}°N {Math.abs(location.lon).toFixed(2)}°W
          </span>
          <span aria-hidden>/</span>
          <span>
            {location.city} <LiveClock />
          </span>
          <span className="hidden sm:inline" aria-hidden>
            /
          </span>
          <span className="hidden sm:inline">MSc CS · UCD</span>
        </div>

        <div className="grid flex-1 items-center gap-12 py-10 md:grid-cols-12 md:gap-6 md:py-12">
          <div className="md:col-span-7">
            <div className="rise" style={{ "--d": "0.05s" } as React.CSSProperties}>
              <Link
                href={now.buildingHref}
                className="group inline-flex max-w-full items-center gap-2.5 rounded-full border border-line bg-raised/70 py-1.5 pr-4 pl-2 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                <span className="relative grid size-5 shrink-0 place-items-center">
                  <span className="animate-ping-slow absolute inset-1 rounded-full bg-ok/60" />
                  <span className="relative size-2 rounded-full bg-ok" />
                </span>
                <span className="truncate">
                  Building <span className="text-fg">{now.building}</span>
                  <span className="hidden sm:inline">
                    {" "}
                    · learning <span className="text-fg">{now.learning}</span>
                  </span>
                </span>
                <ArrowRight
                  size={14}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>

            <div className="rise" style={{ "--d": "0.12s" } as React.CSSProperties}>
              <h1 className="mt-7 text-hero leading-[0.95] font-medium tracking-[-0.045em] text-balance">
                <span className="sr-only">{profile.name}: </span>
                {profile.headline.lead}{" "}
                <em className="font-serif font-normal tracking-[-0.015em] text-accent italic">
                  {profile.headline.accent}
                </em>
              </h1>
            </div>

            <div className="rise" style={{ "--d": "0.2s" } as React.CSSProperties}>
              <p className="mt-7 font-mono text-[0.9rem] text-muted sm:text-base">
                <span className="text-subtle">{profile.name} / </span>
                <RoleTicker roles={profile.roles} />
              </p>
              <p className="mt-5 max-w-[54ch] text-lg leading-relaxed text-muted">{profile.pitch}</p>
            </div>

            <div className="rise mt-9 flex flex-wrap items-center gap-3" style={{ "--d": "0.28s" } as React.CSSProperties}>
              <Magnetic>
                <ButtonLink href="#work" variant="primary">
                  View projects <ArrowDownRight size={16} />
                </ButtonLink>
              </Magnetic>
              <ButtonLink href={profile.links.resume} download>
                <FileDown size={16} strokeWidth={1.75} /> Résumé
              </ButtonLink>
              <ButtonLink href="#contact" variant="ghost">
                Get in touch
              </ButtonLink>
            </div>
          </div>

          <div className="rise px-6 sm:px-10 md:col-span-5 md:px-0" style={{ "--d": "0.2s" } as React.CSSProperties}>
            <Radar />
            <p className="hud mt-5 text-center text-subtle">
              5 contacts on scope · select one to open it
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
