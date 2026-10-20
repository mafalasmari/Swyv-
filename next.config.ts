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
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    globalNotFound: true,
    serverActions: {
      // Carrier documents and CVs are capped at 4 MB in the form validation.
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
