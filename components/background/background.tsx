import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/site";
import { Reveal } from "@/components/ui/reveal";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";
import { SkillIcon } from "./skill-icon";

type Role = { title: string; when: string; body: string };
type Entry = {
  when: string;
  kind: "Study" | "Work";
  org: string;
  place: string;
  roles: Role[];
  now?: boolean;
};

const year = (d: string) => d.split(" ").at(-1) ?? d;
const span = (start: string, end: string) => `${year(start)} – ${year(end)}`;
const [msc, be] = profile.education;
const jobs = profile.experience;

// One entry per organisation; roles inside it carry their exact month ranges.
const timeline: Entry[] = [
  {
    when: span(msc.start, msc.end),
    kind: "Study",
    org: msc.org,
    place: msc.place,
    roles: [{ title: msc.degree, when: `${msc.start} – ${msc.end}`, body: msc.summary }],
    now: true,
  },
  {
    when: span(jobs.at(-1)!.start, jobs[0].end),
    kind: "Work",
    org: jobs[0].org,
    place: jobs[0].place,
    roles: jobs.map((j) => ({ title: j.role, when: `${j.start} – ${j.end}`, body: j.summary })),
  },
  {
    when: span(be.start, be.end),
    kind: "Study",
    org: be.org,
    place: `${be.place}, Navi Mumbai`,
    roles: [{ title: be.degree, when: `${be.start} – ${be.end}`, body: be.summary }],
  },
];

function Marquee({ items, reverse, speed }: { items: string[]; reverse?: boolean; speed: string }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-pause overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <ul
        className={cn(
          "flex w-max gap-3 py-2",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
        style={{ "--marquee-speed": speed } as React.CSSProperties}
      >
        {doubled.map((s, i) => (
          <li
            key={i}
            aria-hidden={i >= items.length}
            className="group border-line-strong font-display text-fg flex shrink-0 items-center gap-2.5 rounded-full border py-2.5 pr-5 pl-3.5 text-lg font-bold whitespace-nowrap"
          >
            <SkillIcon
              name={s}
              className="text-muted group-hover:text-accent size-5 transition-colors"
            />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Background() {
  const rowA = [...profile.skills[0].items, ...profile.skills[2].items];
  const rowB = [...profile.skills[1].items, ...profile.skills[3].items];

  return (
    <section id="background" data-scene="background" className="relative py-28 md:py-40">
      <div className="container-page">
        <SectionLabel index="05" label="Background" />
        <h2 className="headline text-display mt-5">
          Where I&apos;ve <span className="text-signal">been.</span>
        </h2>

        <ol className="border-line mt-14 max-w-[56rem] border-t">
          {timeline.map((e) => (
            <li key={e.org} className="border-line border-b">
              <Reveal className="grid gap-x-10 gap-y-4 py-8 md:grid-cols-[10rem_minmax(0,1fr)]">
                <div className="flex items-center gap-3 md:block">
                  <p
                    className={cn(
                      "font-display text-lg leading-none font-bold whitespace-nowrap tabular-nums",
                      e.now ? "text-accent" : "text-fg",
                    )}
                  >
                    {e.when}
                  </p>
                  <p className="tag text-subtle md:mt-3">
                    {e.kind}
                    {e.now && (
                      <span className="bg-accent text-ink ml-2 rounded-full px-2 py-0.5">Now</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="tag text-muted">
                    {e.org} · {e.place}
                  </p>
                  <ul
                    className={cn(
                      "mt-3",
                      e.roles.length > 1 && "border-line-strong space-y-6 border-l pl-5",
                    )}
                  >
                    {e.roles.map((r) => (
                      <li key={r.title}>
                        <h3 className="font-display text-fg text-xl leading-tight font-bold tracking-tight">
                          {r.title}
                        </h3>
                        {e.roles.length > 1 && <p className="tag text-accent mt-1.5">{r.when}</p>}
                        <p className="text-muted mt-2 max-w-[58ch] leading-relaxed">{r.body}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-24 max-w-[56rem]">
          <h3 className="tag text-muted">Published research</h3>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {profile.publications.map((p, i) => (
              <li key={p.title}>
                <Reveal
                  delay={i * 0.06}
                  className="panel flex h-full flex-col rounded-[1.75rem] p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-accent text-2xl leading-none font-bold tabular-nums">
                      {p.year}
                    </span>
                    <span className="tag text-subtle">
                      {p.venue.match(/\(([^)]+)\)/)?.[1] ?? "Journal"}
                    </span>
                  </div>
                  <h4 className="font-display text-fg mt-6 text-xl leading-tight font-bold">
                    {p.title}
                  </h4>
                  <p className="text-subtle mt-1 text-sm">{p.venue}</p>
                  <p className="text-muted mt-4">{p.summary}</p>
                  {p.project && (
                    <a
                      href={p.project}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group text-fg hover:text-accent mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium"
                    >
                      Project code
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  )}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <h3 className="tag text-muted mt-24">Toolbox</h3>
        <ul className="sr-only">
          {profile.skills.map((g) => (
            <li key={g.group}>
              {g.group}: {g.items.join(", ")}
            </li>
          ))}
        </ul>
      </div>
      <div aria-hidden className="mt-5 space-y-3">
        <Marquee items={rowA} speed="60s" />
        <Marquee items={rowB} speed="70s" reverse />
      </div>
    </section>
  );
}
