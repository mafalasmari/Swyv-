import type { MetadataRoute } from "next";
import { routes } from "@/content/site";
import { SITE_URL, href, locales } from "@/i18n/config";

const EXCLUDED = new Set(["/thank-you", "/login", "/app"]);

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(routes)
    .filter((path) => !EXCLUDED.has(path))
    .flatMap((path) =>
      locales.map((locale) => ({
        url: `${SITE_URL}${href(locale, path)}`,
        changeFrequency: "monthly" as const,
        priority: path === "/" ? 1 : path === "/pilot" ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}${href(l, path)}`])),
        },
      })),
    );
}
