import Link from "next/link";
import { Mail } from "lucide-react";
import { cta, intro, type IntroPart } from "@/content/home";
import { getProject } from "@/content/projects";
import { profile } from "@/lib/site";
import { GitHubIcon, LinkedInIcon } from "@/components/site/icons";
import { ProjectMark } from "@/components/site/project-mark";
import { Shot } from "@/components/site/shot";

const strong = "text-fg font-[560]";
const soft = "text-soft";

function ProjectChip({ slug }: { slug: string }) {
  const p = getProject(slug);
  if (!p) return null;
  return (
    <Link
      href={`/projects/${p.slug}`}
      className={`chip relative inline-block whitespace-nowrap ${strong}`}
    >
      <ProjectMark project={p} className="mr-[0.24em]" />
      <span className="link-line">{p.title}</span>
      {p.image && (
        <span
          aria-hidden
          className="chip-preview bg-surface block rounded-[1.1rem] p-1.5 text-left whitespace-normal shadow-[0_24px_50px_-18px_rgb(var(--shadow)/0.45),inset_0_0_0_1px_var(--line)]"
        >
          <span className="relative block aspect-[16/10] overflow-hidden rounded-[0.8rem]">
            <Shot project={p} sizes="(min-width: 1024px) 30vw, 78vw" eager />
          </span>
          <span className="text-soft block px-2 pt-2 pb-1 text-[0.8rem] leading-snug font-normal tracking-normal">
            {p.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}

const socials = [
  {
    label: "LinkedIn",
    href: profile.links.linkedin,
    tile: "bg-[#0a66c2] text-white",
    Icon: LinkedInIcon,
  },
  { label: "GitHub", href: profile.links.github, tile: "bg-fg text-bg", Icon: GitHubIcon },
  { label: "Email", href: `mailto:${profile.email}`, tile: "bg-accent text-bg", Icon: Mail },
];

function Socials() {
  return (
    <span className="inline-flex gap-[0.18em] align-baseline">
      {socials.map(({ label, href, tile, Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="chip"
        >
          <span className={`chip-icon ${tile}`}>
            <Icon className="size-[56%]" aria-hidden />
          </span>
        </a>
      ))}
    </span>
  );
}

/** Keeps hyphenated words such as "e-commerce" on one line. */
function Words({ text }: { text: string }) {
  return text.split(/(\S+-\S+)/).map((chunk, i) =>
    i % 2 ? (
      <span key={i} className="whitespace-nowrap">
        {chunk}
      </span>
    ) : (
      chunk
    ),
  );
}

function Part({ part }: { part: IntroPart }) {
  switch (part.kind) {
    case "strong":
      return (
        <span className={strong}>
          <Words text={part.text} />
        </span>
      );
    case "soft":
      return (
        <span className={soft}>
          <Words text={part.text} />
        </span>
      );
    case "project":
      return <ProjectChip slug={part.slug} />;
    case "socials":
      return <Socials />;
  }
}

/** Renders a sentence, keeping punctuation glued to an icon chip right before it. */
function Sentence({ parts }: { parts: IntroPart[] }) {
  return parts.map((part, j) => {
    const prev = parts[j - 1];
    const next = parts[j + 1];
    const glued = (p?: IntroPart) => p?.kind === "strong" && /^[.,]$/.test(p.text);
    if (part.kind === "project" && glued(next)) {
      return (
        <span key={j} className="whitespace-nowrap">
          <Part part={part} />
          <Part part={next} />
        </span>
      );
    }
    if (prev?.kind === "project" && glued(part)) return null;
    return <Part key={j} part={part} />;
  });
}

const underline =
  "text-fg font-[560] underline decoration-[color-mix(in_oklab,var(--fg)_30%,transparent)] decoration-[0.06em] underline-offset-[0.22em] transition-[text-decoration-color] hover:decoration-[var(--accent)]";

/** The whole introduction as one paragraph, sentence by sentence. */
export function Intro() {
  const [first, ...rest] = intro;
  return (
    <div className="text-intro max-w-[33em] leading-[1.45] tracking-[-0.016em] text-pretty">
      <div>
        <span className="settle inline" style={{ "--i": 0 } as React.CSSProperties}>
          {/* The name sentence doubles as the page heading. */}
          <h1 className="inline">
            <Part part={first[0]} />
          </h1>
          {first.slice(1).map((part, j) => (
            <Part key={j} part={part} />
          ))}{" "}
        </span>
        {rest.map((sentence, i) => (
          <span
            key={i}
            className={`settle inline ${sentence.some((p) => p.kind === "socials") ? "whitespace-nowrap" : ""}`}
            style={{ "--i": i + 1 } as React.CSSProperties}
          >
            <Sentence parts={sentence} />{" "}
          </span>
        ))}
      </div>
      <p className="settle mt-[1.1em]" style={{ "--i": intro.length + 1 } as React.CSSProperties}>
        <span className={soft}>{cta.lead} </span>
        <a href={`mailto:${profile.email}`} className={underline}>
          {cta.talk}
        </a>
        <span className={soft}>{cta.or}</span>
        <a href={profile.links.resume} download className={underline}>
          {cta.resume}
        </a>
        <span className={soft}>.</span>
      </p>
    </div>
  );
}
