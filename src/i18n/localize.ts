import type { Locale } from "./config";

/** A string in both site languages. */
export type Tx = { ar: string; en: string };

/** Deeply replaces every Tx leaf of T with a plain string. */
export type Localized<T> = T extends Tx
  ? string
  : T extends readonly (infer U)[]
    ? Localized<U>[]
    : T extends object
      ? { [K in keyof T]: Localized<T[K]> }
      : T;

const isTx = (value: unknown): value is Tx =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  Object.keys(value).length === 2 &&
  "ar" in value &&
  "en" in value;

/**
 * Content is authored once with both languages side by side;
 * pages call localize() to get the strings for the current locale.
 */
export function localize<T>(content: T, locale: Locale): Localized<T> {
  if (isTx(content)) return content[locale] as Localized<T>;
  if (Array.isArray(content)) return content.map((item) => localize(item, locale)) as Localized<T>;
  if (typeof content === "object" && content !== null) {
    return Object.fromEntries(
      Object.entries(content).map(([key, value]) => [key, localize(value, locale)]),
    ) as Localized<T>;
  }
  return content as Localized<T>;
}

/** Shorthand for authoring a Tx pair. */
export const t = (ar: string, en: string): Tx => ({ ar, en });
