import { cacheLife } from "next/cache";
import { profile } from "@/lib/site";

export type Post = { title: string; url: string; category: string | null; date: string };

export type PostFeed = { posts: Post[]; total: number | null; source: "live" | "fallback" };

// Shown if the feed can't be reached. Refresh by hand now and then.
const FALLBACK: Post[] = [
  {
    title: "Organize Files with Python: Auto-Sort Your Downloads Folder",
    url: `${profile.links.blog}/blog/organize-files-python`,
    category: "Python Automation",
    date: "2026-10-04",
  },
  {
    title: "Send Telegram Messages from Python: Alerts for Your Scripts",
    url: `${profile.links.blog}/blog/telegram-notifications-python`,
    category: "Python Automation",
    date: "2026-10-03",
  },
  {
    title: "GitHub Actions Cron: Run a Python Script on a Schedule",
    url: `${profile.links.blog}/blog/github-actions-cron-python`,
    category: "Python Automation",
    date: "2026-10-02",
  },
];

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim();

const tag = (item: string, name: string) => {
  const m = item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : null;
};

/** Latest posts from the Ctrl+Automate RSS feed. Cached for an hour, with a committed fallback. */
export async function getLatestPosts(limit = 3): Promise<PostFeed> {
  "use cache";
  cacheLife("hours");

  try {
    const res = await fetch(`${profile.links.blog}/feed.xml`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error(`feed ${res.status}`);
    const items = (await res.text()).match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const posts = items
      .map((item) => {
        const title = tag(item, "title");
        const url = tag(item, "link");
        const pub = tag(item, "pubDate");
        if (!title || !url?.startsWith(profile.links.blog)) return null;
        return { title, url, category: tag(item, "category"), date: pub ? new Date(pub).toISOString() : "" };
      })
      .filter((p): p is Post => p !== null);
    if (posts.length === 0) throw new Error("feed had no posts");
    return { posts: posts.slice(0, limit), total: posts.length, source: "live" };
  } catch (error) {
    console.warn("[blog] using fallback posts:", (error as Error).message);
    return { posts: FALLBACK.slice(0, limit), total: null, source: "fallback" };
  }
}
