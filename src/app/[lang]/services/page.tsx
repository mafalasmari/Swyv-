import { CardGrid } from "@/components/sections/CardGrid";
import { CheckList } from "@/components/sections/CheckList";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { services } from "@/content/services";
import { routes } from "@/content/site";
import { href } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">) {
  return pageMetadata(await getLocale(params), routes.services, services.seo);
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const locale = await getLocale(params);
  const c = localize(services, locale);

  return (
    <>
      <PageHero eyebrow={c.intro.eyebrow} title={c.intro.title} description={c.intro.description} />

      <Section>
        <SectionHeader index="01" eyebrow={c.availableTitle} title={c.availableTitle} className="mb-12" />
        <CardGrid cards={c.available} columns={3} />
      </Section>

      <Section>
        <SectionHeader index="02" eyebrow={c.soonTitle} title={c.soonTitle} className="mb-12" />
        <CardGrid cards={c.soon.map((card) => ({ ...card, tag: c.soonTag }))} columns={3} muted />
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeader index="03" eyebrow={c.notOfferedTitle} title={c.notOfferedTitle} />
          <CheckList items={c.notOffered} negative className="border-t border-line pt-6 text-lg text-steel" />
        </div>
      </Section>

      <CtaBand title={c.cta.title} button={c.cta.button} href={href(locale, routes.contact)} />
    </>
  );
}
