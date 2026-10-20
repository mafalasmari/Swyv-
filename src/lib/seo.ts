import type { Metadata } from "next";
import { SITE_URL, href, locales, type Locale } from "@/i18n/config";
import { localize, type Tx } from "@/i18n/localize";

type Seo = { title: Tx; description: Tx };

/** Title, description, canonical, hreflang alternates and share image for one page. */
export function pageMetadata(locale: Locale, path: string, seo: Seo): Metadata {
  const { title, description } = localize(seo, locale);
  const languages = Object.fromEntries(locales.map((l) => [l, `${SITE_URL}${href(l, path)}`]));
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${href(locale, path)}`,
      languages: { ...languages, "x-default": `${SITE_URL}${href("ar", path)}` },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${href(locale, path)}`,
      siteName: "SWYV",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? "en_US" : "ar_SA",
      type: "website",
      images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "SWYV" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/og.png`] },
  };
}
