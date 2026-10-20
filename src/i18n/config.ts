export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const dirOf = (locale: Locale) => (locale === "ar" ? "rtl" : "ltr");

/** Public site origin, used for canonical URLs, hreflang and the sitemap. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://swyv.sa").replace(/\/$/, "");

/** Builds a locale-prefixed path: href("ar", "/pilot") → "/ar/pilot". */
export const href = (locale: Locale, path = "/") =>
  `/${locale}${path === "/" ? "" : path}`;
