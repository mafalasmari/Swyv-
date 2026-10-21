import { CardGrid } from "@/components/sections/CardGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { NotchSeparator } from "@/components/ui/NotchSeparator";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { about } from "@/content/about";
import { routes, site } from "@/content/site";
import { href } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">) {
  return pageMetadata(await getLocale(params), routes.about, about.seo);
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const locale = await getLocale(params);
  const c = localize(about, locale);
  const s = localize(site.pilotCta, locale);

  return (
    <>
      <PageHero eyebrow={c.intro.eyebrow} title={c.intro.title} />

      <NotchSeparator from="dark" to="light" />
      <Section tone="light">
        <p className="max-w-4xl text-2xl leading-relaxed font-medium text-pretty sm:text-3xl sm:leading-relaxed">
          {c.story}
        </p>
      </Section>

      <NotchSeparator from="light" to="muted" />
      <Section tone="muted">
        <div className="grid border-t border-s border-rule md:grid-cols-2">
          {[c.vision, c.mission].map((block, i) => (
            <div key={block.title} className="flex flex-col gap-4 border-e border-b border-rule p-8 sm:p-10">
              <span className="num text-xs text-red">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="font-mono text-xs tracking-[0.16em] text-muted uppercase">{block.title}</h2>
              <p className="text-2xl leading-snug font-medium text-balance">{block.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <NotchSeparator from="muted" to="light" />
      <Section tone="light">
        <SectionHeader index="03" eyebrow={c.principlesTitle} title={c.principlesTitle} className="mb-12" />
        <CardGrid cards={c.principles} columns={3} />
      </Section>

      <NotchSeparator from="light" to="dark" />
      <CtaBand
        tone="dark"
        title={s.title}
        description={s.description}
        button={s.button}
        href={href(locale, routes.pilot)}
      />
    </>
  );
}
