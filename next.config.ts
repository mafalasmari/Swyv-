import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "a.storyblok.com", pathname: "/f/337048/**" },
      { protocol: "https", hostname: "www.optoro.com", pathname: "/wp-content/uploads/**" },
    ],
  },
};

export default nextConfig;
