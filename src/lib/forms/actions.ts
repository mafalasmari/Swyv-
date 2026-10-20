"use server";

import { redirect } from "next/navigation";
import { hasLocale, href } from "@/i18n/config";
import { routes } from "@/content/site";
import { deliver } from "./deliver";
import { FORMS, formMessages, type FormId, type FormState } from "./schemas";
import { validateForm } from "./validate";

/** Minimum time between page render and submit; bots usually post instantly. */
const MIN_FILL_MS = 3000;

export async function submitForm(_prev: FormState, data: FormData): Promise<FormState> {
  const locale = String(data.get("_locale"));
  const formId = String(data.get("_form")) as FormId;
  const schema = FORMS[formId];
  if (!hasLocale(locale) || !schema) return { status: "error", message: "Bad request" };

  // Honeypot: real visitors never see or fill this field. Pretend success for bots.
  if (String(data.get("company_website") ?? "")) redirect(href(locale, routes.thankYou));

  const startedAt = Number(data.get("_started"));
  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "error", message: formMessages.tooFast[locale] };
  }

  const { errors, values, files } = validateForm(schema, data, locale);
  if (Object.keys(errors).length) {
    return { status: "error", message: formMessages.fixErrors[locale], errors, values };
  }

  try {
    await deliver({ schema, locale, values, files });
  } catch (error) {
    console.error("[forms] delivery failed", error);
    return { status: "error", message: formMessages.failed[locale], values };
  }

  redirect(href(locale, routes.thankYou));
}
