import { CheckList } from "@/components/sections/CheckList";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { SchemaForm } from "@/components/forms/SchemaForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { NotchSeparator } from "@/components/ui/NotchSeparator";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { pilot } from "@/content/pilot";
import { routes, site } from "@/content/site";
import { href } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/pilot">) {
  return pageMetadata(await getLocale(params), routes.pilot, pilot.seo);
}

export default async function PilotPage({ params }: PageProps<"/[lang]/pilot">) {
  const locale = await getLocale(params);
  const c = localize(pilot, locale);
  const cta = localize(site.pilotCta, locale);

  return (
    <>
      <PageHero eyebrow={c.intro.eyebrow} title={c.intro.title} description={c.intro.description} />

      <NotchSeparator from="dark" to="light" />
      <Section tone="light">
        <SectionHeader index="01" eyebrow={c.timelineTitle} title={c.timelineTitle} className="mb-12" />
        <ol className="grid border-t border-s border-rule md:grid-cols-3">
          {c.timeline.map((week) => (
            <li key={week.week} className="flex flex-col gap-3 border-e border-b border-rule p-6 sm:p-8">
              <span className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
                {c.weekLabel} <span className="num text-2xl text-red">{week.week}</span>
              </span>
              <h3 className="text-xl font-semibold">{week.title}</h3>
              <p className="leading-relaxed text-muted">{week.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <Eyebrow index="02">{c.measureTitle}</Eyebrow>
            <CheckList items={c.measure} />
          </div>
          <div className="flex flex-col gap-5">
            <Eyebrow index="03">{c.needTitle}</Eyebrow>
            <CheckList items={c.need} />
          </div>
        </div>
      </Section>

      <NotchSeparator from="light" to="dark" />
      {/* Forms stay dark. */}
      <Section tone="dark" id="request" className="scroll-mt-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <SectionHeader index="04" eyebrow={c.formTitle} title={c.formTitle} className="self-start lg:sticky lg:top-24" />
          <SchemaForm formId="pilot" locale={locale} privacyHref={href(locale, routes.privacy)} />
        </div>
      </Section>

      {/* Short page: the red closing band stays here; its button jumps to the form above. */}
      <NotchSeparator from="dark" to="red" />
      <CtaBand title={cta.title} description={cta.description} button={cta.button} href="#request" />
    </>
  );
}
