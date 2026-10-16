import { ArrowUpRight } from "lucide-react";
import { getLatestPosts } from "@/lib/blog";

const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export async function LatestPosts() {
  const { posts, total } = await getLatestPosts(3);
  return (
    <div className="mt-10 border-t border-line pt-5">
      <p className="tag flex justify-between text-subtle">
        <span>Latest posts</span>
        {total !== null && <span>{total} published</span>}
      </p>
      <ul className="mt-3">
        {posts.map((post) => (
          <li key={post.url}>
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-b border-line py-3.5"
            >
              <span className="font-medium text-fg transition-colors group-hover:text-accent">{post.title}</span>
              <span className="tag flex items-center gap-1 text-subtle">
                {post.date && <time dateTime={post.date}>{day.format(new Date(post.date))}</time>}
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LatestPostsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading latest posts" className="mt-10 space-y-3 border-t border-line pt-5">
      <div className="skeleton h-4 w-28" />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="skeleton h-6 w-full" />
      ))}
    </div>
  );
}
