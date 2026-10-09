import { Suspense } from "react";
import { ArrowUpRight, ExternalLink, Star } from "lucide-react";
import { getRecentRepos, GITHUB_USER, languageColours } from "@/lib/github";
import { Accent, SectionHeading } from "@/components/ui/section-heading";
import { GitHubIcon } from "@/components/ui/icons";
import { ClaudeCodeBadge } from "@/components/projects/status-pill";
import { RelativeTime } from "./relative-time";

const cols = "md:grid-cols-[minmax(0,1.6fr)_8rem_4rem_9rem_5.5rem]";

async function Board() {
  const { repos, source } = await getRecentRepos();
  const latest = repos[0];

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        {latest && (
          <p className="flex items-center gap-2.5 text-sm text-muted">
            <span className="relative grid size-4 place-items-center">
              <span className="animate-ping-slow absolute inset-0.5 rounded-full bg-ok/60" />
              <span className="relative size-1.5 rounded-full bg-ok" />
            </span>
            Latest push: <span className="font-mono text-fg">{latest.name}</span>
            <span className="text-subtle">
              <RelativeTime iso={latest.pushedAt} />
            </span>
          </p>
        )}
        <p className="hud text-subtle">
          {source === "live" ? "Live from the GitHub API · refreshed hourly" : "Snapshot · live feed unavailable"}
        </p>
      </div>

      <div className="overflow-hidden rounded-[1.25rem] border border-line bg-sunken">
        <div className={`hud hidden gap-6 border-b border-line px-6 py-3 text-subtle md:grid ${cols}`}>
          <span>Repository</span>
          <span>Language</span>
          <span>Stars</span>
          <span>Last push</span>
          <span className="text-right">Gate</span>
        </div>
        <ul className="divide-y divide-line">
          {repos.map((r) => (
            <li key={r.name} className={`group relative grid gap-x-6 gap-y-2 px-5 py-5 transition-colors hover:bg-raised md:px-6 ${cols} md:items-center`}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.95rem] text-fg after:absolute after:inset-0 hover:text-accent"
                  >
                    {r.name}
                  </a>
                  {r.claudeCode && <ClaudeCodeBadge className="relative z-[1]" />}
                </div>
                {r.description && <p className="mt-1.5 line-clamp-2 max-w-[62ch] text-sm text-muted">{r.description}</p>}
                {r.topics.length > 0 && (
                  <p className="mt-2 flex flex-wrap gap-1.5">
                    {r.topics.slice(0, 4).map((t) => (
                      <span key={t} className="rounded-md bg-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
                        {t}
                      </span>
                    ))}
                  </p>
                )}
              </div>
              <span className="flex items-center gap-2 text-sm text-muted">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: r.language ? (languageColours[r.language] ?? "var(--fg-subtle)") : "var(--line-strong)" }}
                  aria-hidden
                />
                {r.language ?? "—"}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-sm text-muted">
                <Star size={13} strokeWidth={1.75} aria-hidden />
                <span className="sr-only">Stars:</span>
                {r.stars}
              </span>
              <span className="font-mono text-sm text-muted">
                <RelativeTime iso={r.pushedAt} />
              </span>
              <span className="relative z-[1] flex items-center gap-1 md:justify-end">
                {r.homepage && (
                  <a
                    href={r.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid size-8 place-items-center rounded-full text-muted hover:bg-line hover:text-fg"
                    aria-label={`${r.name} live demo`}
                  >
                    <ExternalLink size={15} strokeWidth={1.75} />
                  </a>
                )}
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid size-8 place-items-center rounded-full text-muted hover:bg-line hover:text-fg"
                  aria-label={`${r.name} on GitHub`}
                >
                  <GitHubIcon size={15} />
                </a>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function BoardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading recent repositories">
      <div className="skeleton mb-5 h-5 w-64" />
      <div className="divide-y divide-line overflow-hidden rounded-[1.25rem] border border-line">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={`grid gap-6 px-6 py-6 ${cols}`}>
            <div className="space-y-2">
              <div className="skeleton h-4 w-40" />
              <div className="skeleton h-3 w-72 max-w-full" />
            </div>
            <div className="skeleton hidden h-3 w-20 md:block" />
            <div className="skeleton hidden h-3 w-8 md:block" />
            <div className="skeleton hidden h-3 w-24 md:block" />
            <div className="skeleton ml-auto hidden size-8 rounded-full md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GitHubSection() {
  return (
    <section id="github" className="container-page py-24 md:py-32">
      <SectionHeading
        id="github"
        kicker="Latest on GitHub"
        title={
          <>
            Departures: <Accent>what I pushed recently.</Accent>
          </>
        }
        intro="This board updates itself from GitHub. If it says three days ago, I was coding three days ago."
      />
      <Suspense fallback={<BoardSkeleton />}>
        <Board />
      </Suspense>
      <a
        href={`https://github.com/${GITHUB_USER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-6 inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
      >
        <GitHubIcon size={15} /> All repositories on GitHub
        <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </section>
  );
}
