import { about } from "@/content/about";
import { careers } from "@/content/careers";
import { carriers } from "@/content/carriers";
import { faq } from "@/content/faq";
import { industries } from "@/content/industries";
import { portal } from "@/content/portal";
import { services } from "@/content/services";
import { routes, type NavMenuKey } from "@/content/site";
import { href, type Locale } from "@/i18n/config";
import { localize } from "@/i18n/localize";

export type NavChild = { href: string; label: string; description: string };

/**
 * Children of each header menu, taken from the pages' own content (titles and
 * descriptions), so the menus never carry copy the pages do not.
 */
export function navMenus(locale: Locale): Record<NavMenuKey, NavChild[]> {
  const to = (path: string, hash = "") => href(locale, path) + hash;
  const l = <T,>(value: T) => localize(value, locale);

  return {
    services: l(services.available).map((s) => ({
      href: to(routes.services, `#${s.id}`),
      label: s.title,
      description: s.body,
    })),
    industries: l(industries.sectors).map((s) => ({
      href: to(routes.industries, `#${s.code.toLowerCase()}`),
      label: s.name,
      description: `${s.deliver} · ${s.back}`,
    })),
    portal: [
      { href: to(routes.portal, "#telemetry"), label: l(portal.telemetry.title), description: l(portal.telemetry.description) },
      { href: to(routes.portal, "#simulator"), label: l(portal.simulator.title), description: l(portal.simulator.description) },
    ],
    about: [
      { href: to(routes.about), label: l(about.intro.eyebrow), description: l(about.seo.description) },
      { href: to(routes.carriers), label: l(carriers.intro.eyebrow), description: l(carriers.seo.description) },
      { href: to(routes.careers), label: l(careers.intro.eyebrow), description: l(careers.seo.description) },
      { href: to(routes.faq), label: l(faq.intro.eyebrow), description: l(faq.seo.description) },
    ],
  };
}
