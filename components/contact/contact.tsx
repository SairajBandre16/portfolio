import { ArrowUpRight, FileDown } from "lucide-react";
import { profile, section } from "@/lib/site";
import { Magnetic } from "@/components/ui/magnetic";
import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";
import { GitHubIcon, LinkedInIcon, Mark } from "@/components/ui/icons";
import { LiveClock } from "@/components/hero/live-clock";
import { CopyEmail } from "./copy-email";

export function Contact() {
  const s = section("contact");
  return (
    <section id="contact" className="relative isolate overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="hairline-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_70%_at_20%_60%,#000_20%,transparent_70%)]"
      />
      <div className="container-page pt-24 pb-10 md:pt-36">
        <Reveal>
          <p className="hud flex items-center gap-2 text-subtle">
            <span className="inline-block size-1.5 rounded-full bg-accent" />
            <span className="text-accent">{s.fl}</span> / Cruise altitude
          </p>
          <h2 className="mt-8 max-w-[14ch] text-[clamp(2.75rem,1.5rem+5.5vw,6.5rem)] leading-[0.92] font-medium tracking-[-0.05em] text-fg">
            Looking for an AI engineer who <em className="font-serif font-normal text-accent">ships?</em>
          </h2>
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-muted">
            I&apos;m open to AI, applied AI, ML engineering and data science roles in Dublin or remote.
            If you have a problem that needs automating, or just want to talk about planes, my inbox is open.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic>
            <ButtonLink href={`mailto:${profile.email}`} variant="primary" className="h-12 px-6 text-base">
              {profile.email} <ArrowUpRight size={16} />
            </ButtonLink>
          </Magnetic>
          <CopyEmail email={profile.email} />
          <ButtonLink href={profile.links.resume} download>
            <FileDown size={16} strokeWidth={1.75} /> Résumé
          </ButtonLink>
        </Reveal>

        <Reveal delay={0.12} className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href={profile.links.linkedin} external variant="ghost" className="px-0 pr-4">
            <LinkedInIcon size={16} /> LinkedIn
          </ButtonLink>
          <ButtonLink href={profile.links.github} external variant="ghost" className="px-0 pr-4">
            <GitHubIcon size={16} /> GitHub
          </ButtonLink>
        </Reveal>

        <footer className="mt-28 flex flex-col gap-6 border-t border-line pt-8 text-sm text-subtle md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 text-fg">
            <Mark size={28} />
            <span className="text-subtle">
              © 2026 {profile.name}. Built with Next.js and Claude Code.
            </span>
          </div>
          <p className="hud flex flex-wrap gap-x-4 gap-y-1">
            <span>
              {profile.location.city} <LiveClock seconds={false} />
            </span>
            <span>Squawk 7000 · VFR</span>
            <a href="#top" className="text-muted hover:text-fg">
              Back to ground ↑
            </a>
          </p>
        </footer>
      </div>
    </section>
  );
}
