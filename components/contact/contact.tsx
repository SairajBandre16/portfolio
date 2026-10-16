import { ArrowUp, ArrowUpRight, FileDown, PenLine } from "lucide-react";
import { profile } from "@/lib/site";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { LiveClock } from "@/components/hero/live-clock";
import { CopyEmail } from "./copy-email";
import { SplitName } from "./split-name";

const links = [
  { label: "LinkedIn", href: profile.links.linkedin, icon: LinkedInIcon },
  { label: "GitHub", href: profile.links.github, icon: GitHubIcon },
  { label: "Blog", href: profile.links.blog, icon: PenLine },
];

export function Contact() {
  const [first, last] = profile.name.split(" ");
  const [emailUser, emailDomain] = profile.email.split("@");
  return (
    <section
      id="contact"
      data-scene="contact"
      className="relative flex min-h-dvh flex-col justify-between pt-28 md:pt-40"
    >
      <div className="container-page">
        <SectionLabel index="06" label="Contact" />
        <h2 className="headline mt-6 max-w-[11ch] text-[clamp(2.2rem,1rem+4.4vw,5.5rem)]">
          Let&apos;s build something that <span className="text-signal">thinks.</span>
        </h2>
        <Reveal className="mt-10 max-w-[44ch]">
          <p className="text-muted text-lg leading-relaxed">
            Hiring for an AI or ML role, got an idea worth automating, or just want to talk planes?
            My inbox is open.
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-12">
          <a
            href={`mailto:${profile.email}`}
            className="group font-display text-fg inline-flex max-w-full items-center gap-3 text-[clamp(1.2rem,0.9rem+1.4vw,2.2rem)] font-bold tracking-tight"
          >
            {/* Wraps only at the @ on narrow screens, never mid-word. */}
            <span className="min-w-0 bg-[linear-gradient(var(--accent),var(--accent))] bg-size-[0%_3px] bg-bottom-left bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-size-[100%_3px]">
              {emailUser}@<wbr />
              {emailDomain}
            </span>
            <ArrowUpRight className="text-accent size-[0.8em] shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-3">
          <CopyEmail email={profile.email} />
          {links.map(({ label, href, icon: Icon }) => (
            <Magnetic key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="border-line-strong text-fg hover:bg-line inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors"
              >
                <Icon size={15} /> {label}
              </a>
            </Magnetic>
          ))}
          <a
            href={profile.links.resume}
            download
            className="bg-accent text-ink inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-transform active:scale-[0.97]"
          >
            <FileDown size={15} /> Résumé
          </a>
        </Reveal>
      </div>

      <footer data-scene="signoff" className="container-page mt-24 pb-24 md:pb-8">
        <SplitName first={first} last={last} />
        <div className="border-line mt-6 flex flex-col gap-6 border-t pt-6 md:flex-row md:items-center md:justify-between">
          <p className="tag text-subtle">
            © 2026 {profile.name} · From {profile.location.from.city}, now in{" "}
            {profile.location.city} · It&apos;s{" "}
            <span className="text-fg">
              <LiveClock seconds={false} />
            </span>{" "}
            here
          </p>
          <a
            href="#top"
            className="tag group text-muted hover:text-fg inline-flex items-center gap-2"
          >
            Back to the top
            <ArrowUp size={13} className="transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </footer>
    </section>
  );
}
