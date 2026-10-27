import { cacheLife } from "next/cache";
import { profile } from "@/lib/site";

export type Post = { title: string; url: string; category: string | null; date: string };

export type PostFeed = { posts: Post[]; total: number | null; source: "live" | "fallback" };

// Shown if the feed can't be reached. Refresh by hand now and then.
const FALLBACK: Post[] = [
  {
    title: "Vector Search in Python: Embeddings, NumPy and Chroma",
    url: `${profile.links.blog}/blog/vector-search-python`,
    category: "AI Engineering",
    date: "2026-10-27",
  },
  {
    title: "Check SSL Certificate Expiry with Python (Daily Alerts)",
    url: `${profile.links.blog}/blog/check-ssl-certificate-expiry-python`,
    category: "Python Automation",
    date: "2026-10-25",
  },
  {
    title: "Build an MCP Server in Python with the v2 SDK (Tested)",
    url: `${profile.links.blog}/blog/build-mcp-server-python`,
    category: "AI Engineering",
    date: "2026-10-23",
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

/** Latest posts from the Ctrl+Automate RSS feed. Cached for a few minutes, with a committed fallback. */
export async function getLatestPosts(limit = 3): Promise<PostFeed> {
  "use cache";
  cacheLife("feed");

  try {
    const res = await fetch(`${profile.links.blog}/feed.xml`, {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`feed ${res.status}`);
    const items = (await res.text()).match(/<item>[\s\S]*?<\/item>/g) ?? [];
    const posts = items
      .map((item) => {
        const title = tag(item, "title");
        const url = tag(item, "link");
        const pub = tag(item, "pubDate");
        if (!title || !url?.startsWith(profile.links.blog)) return null;
        return {
          title,
          url,
          category: tag(item, "category"),
          date: pub ? new Date(pub).toISOString() : "",
        };
      })
      .filter((p): p is Post => p !== null);
    if (posts.length === 0) throw new Error("feed had no posts");
    return { posts: posts.slice(0, limit), total: posts.length, source: "live" };
  } catch (error) {
    console.warn("[blog] using fallback posts:", (error as Error).message);
    return { posts: FALLBACK.slice(0, limit), total: null, source: "fallback" };
  }
}
