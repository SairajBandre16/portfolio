import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    // The GitHub and blog feeds. An expiry under five minutes keeps them out of the prerender,
    // so each visit renders them fresh from a cache at most a few minutes old, instead of
    // serving an hours-old static page and refreshing it in the background.
    feed: { stale: 60, revalidate: 120, expire: 240 },
  },
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
