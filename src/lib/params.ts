import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/config";

/** Reads and validates the [lang] segment for pages and layouts. */
export async function getLocale(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return lang;
}
