import { CtaBand } from "@/components/sections/CtaBand";
import { IndustryGrid } from "@/components/sections/IndustryGrid";
import { PageHero } from "@/components/sections/PageHero";
import { Chevron } from "@/components/ui/icons";
import { NotchSeparator } from "@/components/ui/NotchSeparator";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { industries } from "@/content/industries";
import { routes, site } from "@/content/site";
import { href } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/industries">) {
  return pageMetadata(await getLocale(params), routes.industries, industries.seo);
}

export default async function IndustriesPage({ params }: PageProps<"/[lang]/industries">) {
  const locale = await getLocale(params);
  const c = localize(industries, locale);
  const pilot = localize(site.pilotCta, locale);

  return (
    <>
      <PageHero eyebrow={c.intro.eyebrow} title={c.intro.title} />

      <NotchSeparator from="dark" to="light" />
      <Section tone="light">
        {/* 4 × 2 grid: seven sectors plus a "not listed" card */}
        <IndustryGrid
          sectors={c.sectors.map((sector) => ({ ...sector, id: sector.code.toLowerCase() }))}
          cta={{ ...c.cta, href: href(locale, routes.contact) }}
          labels={{ deliver: c.headers.deliver, return: c.headers.return }}
          headingLevel="h2"
        />
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
          <span className="flex items-center gap-2">
            <Chevron direction="down" className="size-2 text-red" /> {c.headers.deliver}
          </span>
          <span className="flex items-center gap-2">
            <Chevron direction="up" className="size-2 text-pending" /> {c.headers.return}
          </span>
        </p>
      </Section>

      <NotchSeparator from="light" to="muted" />
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeader eyebrow={c.audience.eyebrow} title={c.audience.title} description={c.audience.lead} />
          <p className="self-end border-s-2 border-red ps-5 text-lg leading-relaxed">{c.audience.note}</p>
        </div>
      </Section>

      <NotchSeparator from="muted" to="dark" />
      <CtaBand tone="dark" title={pilot.title} description={pilot.description} button={pilot.button} href={href(locale, routes.pilot)} />
    </>
  );
}
