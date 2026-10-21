import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { StepTimeline } from "@/components/sections/StepTimeline";
import { DispositionEngine } from "@/components/tools/DispositionEngine";
import { NotchSeparator } from "@/components/ui/NotchSeparator";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusTag } from "@/components/ui/StatusTag";
import { howItWorks } from "@/content/howItWorks";
import { routes, site } from "@/content/site";
import { href } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { CONDITIONS, CONDITION_CODES } from "@/lib/returns";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/how-it-works">) {
  return pageMetadata(await getLocale(params), routes.howItWorks, howItWorks.seo);
}

export default async function HowItWorksPage({ params }: PageProps<"/[lang]/how-it-works">) {
  const locale = await getLocale(params);
  const c = localize(howItWorks, locale);
  const s = localize(site.pilotCta, locale);

  const codes = (
    <table className="mt-2 w-full text-sm">
      <caption className="mb-2 text-start font-mono text-[11px] tracking-wider text-muted uppercase">{c.codesTitle}</caption>
      <thead className="sr-only">
        <tr>
          <th>{c.codeHeaders.code}</th>
          <th>{c.codeHeaders.condition}</th>
        </tr>
      </thead>
      <tbody>
        {CONDITION_CODES.map((code) => (
          <tr key={code} className="border-t border-rule">
            <td className="w-10 py-2 font-arabic text-lg font-semibold text-fg">{CONDITIONS[code].letter}</td>
            <td className="py-2">
              <StatusTag tone={CONDITIONS[code].tone}>{CONDITIONS[code].label[locale]}</StatusTag>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      <PageHero eyebrow={c.intro.eyebrow} title={c.intro.title} />

      <NotchSeparator from="dark" to="light" />
      <Section tone="light">
        <StepTimeline
          columns
          steps={c.steps.map((step) => ({ ...step, extra: "codes" in step && step.codes ? codes : undefined }))}
        />
      </Section>

      <NotchSeparator from="light" to="dark" />
      {/* The engine stays dark until its restyle in phase 11. */}
      <Section tone="dark" id="engine" className="scroll-mt-16">
        <SectionHeader index="07" eyebrow={c.engine.eyebrow} title={c.engine.title} description={c.engine.description} className="mb-12" />
        <DispositionEngine locale={locale} />
      </Section>

      <NotchSeparator from="dark" to="muted" />
      <Section tone="muted">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeader index="08" eyebrow={c.assetLight.eyebrow} title={c.assetLight.title} />
          <p className="border-t border-rule pt-6 text-lg leading-relaxed text-muted">{c.assetLight.body}</p>
        </div>
      </Section>

      <NotchSeparator from="muted" to="red" />
      <CtaBand title={s.title} description={s.description} button={s.button} href={href(locale, routes.pilot)} />
    </>
  );
}
