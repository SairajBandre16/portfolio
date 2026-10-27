import { cacheLife } from "next/cache";
import fallback from "@/content/github-fallback.json";

export const GITHUB_USER = "SairajBandre16";

// Never shown in the feed: the profile README repo and old or empty experiments.
const HIDDEN_REPOS = new Set([
  GITHUB_USER,
  "Fake-Instagram-Account-Detection",
  "Creditcard-fraud",
  "MunchMap",
]);

// Shown when a repo has no description on GitHub. A description set on GitHub always wins.
const FALLBACK_DESCRIPTIONS: Record<string, string> = {
  SQUAWK:
    "The sky above you, live in 3D: real-time aircraft over satellite imagery, built for plane-spotting.",
  ownit: "Turns an AI-assisted draft into a student's own work, and checks they understand it.",
  RainWise:
    "Predicts rainfall, then tells you how much rainwater to store. Published at ICCCNT 2025.",
  "Scan-to-Measure":
    "Real-time object size measurement with OpenCV and ArUco markers. Published in IJRTI 2023.",
  "News-Summarizer": "Full-stack NLP app that summarises news across categories.",
};

export type Repo = {
  name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  pushedAt: string;
  homepage: string | null;
  topics: string[];
};

export type RepoFeed = { repos: Repo[]; source: "live" | "fallback"; fetchedAt: string };

type ApiRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  homepage: string | null;
  topics?: string[];
  fork: boolean;
  archived?: boolean;
};

function normalise(list: ApiRepo[]): Repo[] {
  return list
    .filter((r) => !r.fork && !r.archived && !HIDDEN_REPOS.has(r.name))
    .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
    .slice(0, 6)
    .map((r) => ({
      name: r.name,
      url: r.html_url,
      description: r.description?.trim() || FALLBACK_DESCRIPTIONS[r.name] || null,
      language: r.language,
      stars: r.stargazers_count,
      pushedAt: r.pushed_at,
      homepage: r.homepage?.trim() || null,
      topics: (r.topics ?? []).filter((t) => t !== "built-with-claude-code"),
    }));
}

function fromFallback(): RepoFeed {
  return {
    repos: normalise(
      fallback.repos.map((r) => ({ ...r, html_url: r.html_url, fork: false })) as ApiRepo[],
    ),
    source: "fallback",
    fetchedAt: fallback.fetchedAt,
  };
}

/** Most recently pushed public repos. Cached for a few minutes, falls back to a committed snapshot. */
export async function getRecentRepos(): Promise<RepoFeed> {
  "use cache";
  cacheLife("feed");

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "sairaj-portfolio",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=pushed&per_page=30`,
      { headers, signal: AbortSignal.timeout(6000) },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const repos = normalise((await res.json()) as ApiRepo[]);
    if (repos.length === 0) throw new Error("GitHub API returned no repos");
    return { repos, source: "live", fetchedAt: new Date().toISOString() };
  } catch (error) {
    console.warn("[github] using fallback snapshot:", (error as Error).message);
    return fromFallback();
  }
}

// GitHub's linguist colours for the languages that appear on the profile.
export const languageColours: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Svelte: "#ff3e00",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Java: "#b07219",
  Dart: "#00B4AB",
  "Jupyter Notebook": "#DA5B0B",
};
