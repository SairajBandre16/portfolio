import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import { profile } from "@/lib/site";
import { getRecentRepos, GITHUB_USER, languageColours } from "@/lib/github";
import { getLatestPosts } from "@/lib/blog";
import { RelativeTime } from "@/components/site/relative-time";
import { IndexSection, Row, dimOthers } from "./index-section";
import { WorkList } from "./work-list";

const Arrow = () => (
  <ArrowUpRight
    size={14}
    aria-hidden
    className="text-soft group-hover:text-fg ml-1 inline align-[-0.1em] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
  />
);

function range(start: string, end: string) {
  if (start === end) return start;
  const [m1, y1] = start.split(" ");
  const [m2, y2] = end.split(" ");
  // "Jan 2026 – Jul 2026" reads better as "Jan – Jul 2026".
  if (y1 && y1 === y2) return `${m1} – ${m2} ${y2}`;
  return `${start} – ${end}`;
}

function Experience() {
  // Newest first, study and work together.
  const [msc, be] = profile.education;
  const [exec, intern] = profile.experience;
  const rows = [
    { meta: range(msc.start, msc.end), title: msc.degree, org: msc.org, note: msc.summary },
    { meta: range(exec.start, exec.end), title: exec.role, org: exec.org, note: exec.summary },
    {
      meta: range(intern.start, intern.end),
      title: intern.role,
      org: intern.org,
      note: intern.summary,
    },
    { meta: range(be.start, be.end), title: be.degree, org: be.org, note: be.summary },
  ];
  return (
    <IndexSection id="experience" title="Experience">
      <ol className={dimOthers}>
        {rows.map((r) => (
          <Row key={r.title} meta={r.meta}>
            <span className="text-fg font-medium">{r.title}</span>
            <span className="text-soft">, {r.org}</span>
            <span className="text-soft mt-1 block max-w-[62ch] text-[0.95rem] leading-snug">
              {r.note}
            </span>
          </Row>
        ))}
      </ol>
    </IndexSection>
  );
}

function Papers() {
  return (
    <IndexSection id="papers" title="Papers" count={profile.publications.length}>
      <ol className={dimOthers}>
        {profile.publications.map((p) => (
          // TODO(Sairaj): link the paper itself (DOI) once available; the code repo for now.
          <Row key={p.title} meta={p.year} href={p.link ?? p.project} external>
            <span className="text-fg font-medium">{p.title}</span>
            <Arrow />
            <span className="text-soft mt-1 block text-[0.95rem] leading-snug">{p.venue}</span>
          </Row>
        ))}
      </ol>
    </IndexSection>
  );
}

async function Repos() {
  const { repos, source } = await getRecentRepos();
  return (
    <>
      <ol className={dimOthers}>
        {repos.map((repo) => (
          <Row key={repo.name} href={repo.url} external meta={<RelativeTime iso={repo.pushedAt} />}>
            <span className="text-fg inline-flex items-center gap-2 font-medium">
              <span
                aria-hidden
                className="size-2 shrink-0 rounded-full"
                style={{
                  background: repo.language
                    ? (languageColours[repo.language] ?? "var(--soft)")
                    : "var(--faint)",
                }}
              />
              {repo.name}
              <span className="sr-only">, {repo.language ?? "no language"}</span>
            </span>
            {repo.stars > 0 && <span className="label text-soft ml-2">★ {repo.stars}</span>}
            <Arrow />
            {repo.description && (
              <span className="text-soft mt-1 block truncate text-[0.95rem]">
                {repo.description}
              </span>
            )}
          </Row>
        ))}
      </ol>
      <p className="label text-soft mt-5 flex flex-wrap items-center justify-between gap-2">
        <span>
          {source === "live"
            ? "Live from GitHub, refreshed every few minutes"
            : "Saved snapshot from GitHub"}
        </span>
        <a
          href={`https://github.com/${GITHUB_USER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group hover:text-fg transition-colors"
        >
          github.com/{GITHUB_USER}
          <Arrow />
        </a>
      </p>
    </>
  );
}

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

async function Posts() {
  const { posts } = await getLatestPosts(3);
  return (
    <>
      <ol className={dimOthers}>
        {posts.map((p) => (
          <Row
            key={p.url}
            href={p.url}
            external
            meta={p.date ? dateFmt.format(new Date(p.date)) : "Recent"}
          >
            <span className="text-fg font-medium">{p.title}</span>
            <Arrow />
            {p.category && (
              <span className="text-soft mt-1 block text-[0.95rem]">{p.category}</span>
            )}
          </Row>
        ))}
      </ol>
      <p className="label text-soft mt-5">
        <a
          href={profile.links.blog}
          target="_blank"
          rel="noopener noreferrer"
          className="group hover:text-fg transition-colors"
        >
          More on Ctrl+Automate
          <Arrow />
        </a>
      </p>
    </>
  );
}

function RowsSkeleton({ rows }: { rows: number }) {
  return (
    <ol aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="border-line flex gap-5 border-b py-5">
          <span className="bg-surface h-3 w-24 animate-pulse rounded" />
          <span className="bg-surface h-3 flex-1 animate-pulse rounded" />
        </li>
      ))}
    </ol>
  );
}

function Toolbox() {
  return (
    <IndexSection id="toolbox" title="Toolbox">
      <ul>
        {profile.skills.map((g) => (
          <Row key={g.group} meta={g.group}>
            <span className="text-fg/85 text-[0.95rem] leading-relaxed">{g.items.join(" · ")}</span>
          </Row>
        ))}
      </ul>
    </IndexSection>
  );
}

export function HomeIndex() {
  return (
    <div className="gutter mt-8 lg:mt-0">
      <div className="max-w-[70rem]">
        <IndexSection id="work" title="Work" count={projects.length}>
          <WorkList projects={projects} />
        </IndexSection>
        <Experience />
        <Papers />
        <IndexSection id="github" title="Recently on GitHub">
          <Suspense fallback={<RowsSkeleton rows={6} />}>
            <Repos />
          </Suspense>
        </IndexSection>
        <IndexSection id="writing" title="Writing">
          <Suspense fallback={<RowsSkeleton rows={3} />}>
            <Posts />
          </Suspense>
        </IndexSection>
        <Toolbox />
      </div>
    </div>
  );
}
