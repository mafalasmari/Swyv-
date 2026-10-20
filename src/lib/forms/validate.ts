import type { Locale } from "@/i18n/config";
import { MAX_FILE_BYTES, formMessages, type FormSchema } from "./schemas";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Saudi mobile: 05XXXXXXXX, 5XXXXXXXX, +9665XXXXXXXX or 009665XXXXXXXX. */
const SA_MOBILE = /^(?:\+?966|00966|0)?5\d{8}$/;

export const normalizeMobile = (value: string) => value.replace(/[\s()-]/g, "");

/**
 * Validates submitted values against a form schema.
 * Shared by the server action (authoritative) and the browser (instant feedback).
 */
export function validateForm(schema: FormSchema, data: FormData, locale: Locale) {
  const errors: Record<string, string> = {};
  const values: Record<string, string | string[]> = {};
  const files: File[] = [];

  for (const field of schema.fields) {
    if (field.type === "file") {
      const list = data.getAll(field.name).filter((f): f is File => f instanceof File && f.size > 0);
      if (field.required && list.length === 0) errors[field.name] = formMessages.required[locale];
      const extensions = (field.accept ?? "").split(",").filter(Boolean);
      const bad = list.find(
        (f) => f.size > MAX_FILE_BYTES || (extensions.length > 0 && !extensions.some((ext) => f.name.toLowerCase().endsWith(ext))),
      );
      if (bad) errors[field.name] = formMessages.file[locale];
      files.push(...list);
      continue;
    }

    if (field.type === "multi") {
      const list = data.getAll(field.name).map(String).filter(Boolean);
      values[field.name] = list;
      if (field.required && list.length === 0) errors[field.name] = formMessages.required[locale];
      continue;
    }

    const raw = String(data.get(field.name) ?? "").trim();
    values[field.name] = raw;

    if (!raw) {
      if (field.required) errors[field.name] = formMessages.required[locale];
      continue;
    }
    if (field.type === "email" && !EMAIL.test(raw)) errors[field.name] = formMessages.email[locale];
    if (field.type === "tel" && !SA_MOBILE.test(normalizeMobile(raw))) errors[field.name] = formMessages.mobile[locale];
    if (field.type === "number" && (!/^\d+$/.test(raw) || Number(raw) < (field.min ?? 0)))
      errors[field.name] = formMessages.number[locale];
    if (field.type === "select" && field.options && !field.options.some((o) => o.value === raw))
      errors[field.name] = formMessages.required[locale];
  }

  return { errors, values, files };
}
