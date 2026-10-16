import { Suspense } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { getRecentRepos, GITHUB_USER, languageColours, type Repo } from "@/lib/github";
import { SectionLabel } from "@/components/ui/section-label";
import { GitHubIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { RelativeTime } from "./relative-time";

function RepoTile({ repo, latest }: { repo: Repo; latest: boolean }) {
  const colour = repo.language
    ? (languageColours[repo.language] ?? "var(--fg-subtle)")
    : "var(--line-strong)";
  return (
    <li
      className={cn(
        "panel group hover:border-accent/60 relative flex flex-col rounded-[1.75rem] p-6 transition-[transform,border-color] duration-500 hover:-translate-y-1",
        latest && "md:col-span-2 md:row-span-2 md:p-8",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="tag text-muted flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ background: colour }} aria-hidden />
          {repo.language ?? "No language"}
        </span>
        <span className={cn("tag", latest ? "text-accent" : "text-subtle")}>
          {latest && "Latest push · "}
          <RelativeTime iso={repo.pushedAt} />
        </span>
      </div>

      <h3
        className={cn(
          "font-display text-fg mt-6 font-bold tracking-tight wrap-break-word",
          latest ? "text-[clamp(1.6rem,1.1rem+1.6vw,2.6rem)] leading-none" : "text-2xl",
        )}
      >
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group-hover:text-accent after:absolute after:inset-0"
        >
          {repo.name}
        </a>
      </h3>
      {repo.description && (
        <p
          className={cn(
            "text-muted mt-3",
            latest ? "max-w-[52ch] text-lg leading-relaxed" : "line-clamp-3 text-sm",
          )}
        >
          {repo.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        {repo.topics.slice(0, 3).map((t) => (
          <span
            key={t}
            className="border-line text-muted rounded-full border px-2 py-0.5 font-mono text-[10px]"
          >
            {t}
          </span>
        ))}
        <span className="ml-auto flex items-center gap-3">
          <span className="text-muted flex items-center gap-1 font-mono text-xs">
            <Star size={12} aria-hidden /> <span className="sr-only">Stars:</span>
            {repo.stars}
          </span>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-fg text-bg hover:bg-accent hover:text-ink relative z-1 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
              aria-label={`${repo.name} live demo`}
            >
              Live <ArrowUpRight size={12} />
            </a>
          )}
        </span>
      </div>
    </li>
  );
}

async function Feed() {
  const { repos, source } = await getRecentRepos();
  return (
    <>
      <p className="tag text-subtle mb-5 flex items-center gap-2">
        <span
          className={cn("size-1.5 rounded-full", source === "live" ? "bg-lime" : "bg-yellow")}
        />
        {source === "live"
          ? "Live from the GitHub API · refreshed hourly"
          : "Snapshot · live feed unavailable right now"}
      </p>
      <ul className="grid gap-4 md:grid-cols-3">
        {repos.map((r, i) => (
          <RepoTile key={r.name} repo={r} latest={i === 0} />
        ))}
      </ul>
    </>
  );
}

function FeedSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading recent repositories">
      <div className="skeleton mb-5 h-4 w-60" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className={cn(
              "skeleton h-52 rounded-[1.75rem]",
              i === 0 && "md:col-span-2 md:row-span-2 md:h-auto",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function GitHubSection() {
  return (
    <section id="github" data-scene="github" className="container-page relative py-28 md:py-40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <SectionLabel index="04" label="Live from GitHub" />
          <h2 className="headline text-display mt-5">
            Fresh <span className="text-signal">commits.</span>
          </h2>
        </div>
        <p className="text-muted max-w-[40ch] text-lg leading-relaxed">
          This updates itself. If it says three days ago, I was shipping three days ago.
        </p>
      </div>

      <div className="mt-12">
        <Suspense fallback={<FeedSkeleton />}>
          <Feed />
        </Suspense>
      </div>

      <a
        href={`https://github.com/${GITHUB_USER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group text-fg hover:text-accent mt-8 inline-flex items-center gap-2 font-medium"
      >
        <GitHubIcon size={16} /> Everything on GitHub
        <ArrowUpRight
          size={15}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </section>
  );
}
