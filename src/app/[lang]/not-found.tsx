import { lang } from "next/root-params";
import { NotFoundView } from "@/components/sections/NotFoundView";
import { system } from "@/content/system";
import { defaultLocale, hasLocale, href } from "@/i18n/config";
import { localize } from "@/i18n/localize";

export default async function NotFound() {
  const value = await lang();
  const locale = hasLocale(value) ? value : defaultLocale;
  const copy = localize(system.notFound, locale);
  return <NotFoundView title={copy.title} button={copy.button} homeHref={href(locale)} />;
}
