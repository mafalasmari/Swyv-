import { CardGrid } from "@/components/sections/CardGrid";
import { CheckList } from "@/components/sections/CheckList";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { NotchSeparator } from "@/components/ui/NotchSeparator";
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

      <NotchSeparator from="dark" to="light" />
      <Section tone="light">
        <SectionHeader index="01" eyebrow={c.availableTitle} title={c.availableTitle} className="mb-12" />
        <CardGrid cards={c.available} columns={3} />
      </Section>

      <NotchSeparator from="light" to="muted" />
      <Section tone="muted">
        <SectionHeader index="02" eyebrow={c.soonTitle} title={c.soonTitle} className="mb-12" />
        <CardGrid cards={c.soon.map((card) => ({ ...card, tag: c.soonTag }))} columns={3} muted />
      </Section>

      <NotchSeparator from="muted" to="light" />
      <Section tone="light">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <SectionHeader index="03" eyebrow={c.notOfferedTitle} title={c.notOfferedTitle} />
          <CheckList items={c.notOffered} negative className="border-t border-rule pt-6 text-lg text-muted" />
        </div>
      </Section>

      <NotchSeparator from="light" to="red" />
      <CtaBand title={c.cta.title} button={c.cta.button} href={href(locale, routes.contact)} />
    </>
  );
}
