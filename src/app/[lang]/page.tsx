import Link from "next/link";
import { CardGrid } from "@/components/sections/CardGrid";
import { CtaBand } from "@/components/sections/CtaBand";
import { OpsBoard } from "@/components/sections/OpsBoard";
import { PageHero } from "@/components/sections/PageHero";
import { PortalPreview } from "@/components/sections/PortalPreview";
import { StepTimeline } from "@/components/sections/StepTimeline";
import { TruckBanTimeline } from "@/components/sections/TruckBanTimeline";
import { SavingsCalculator } from "@/components/tools/SavingsCalculator";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { home } from "@/content/home";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { routes, site } from "@/content/site";
import { href } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  return pageMetadata(await getLocale(params), routes.home, home.seo);
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const locale = await getLocale(params);
  const c = localize(home, locale);
  const s = localize(site, locale);
  const svc = localize(services.available, locale);
  const sectors = localize(industries.sectors, locale);
  const to = (path: string) => href(locale, path);

  return (
    <>
      <PageHero
        size="lg"
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        description={c.hero.description}
        actions={
          <>
            <Button href={to(routes.pilot)} size="lg">
              {c.hero.primary}
            </Button>
            <Button href="#calculator" variant="secondary" size="lg">
              {c.hero.secondary}
            </Button>
          </>
        }
        aside={
          <OpsBoard
            title={c.board.title}
            sample={c.board.sample}
            rows={c.board.rows}
            inboundLabel={c.board.inbound}
            returnLabel={c.board.returns}
          />
        }
      />

      <Section>
        <SectionHeader index="01" eyebrow={c.problem.eyebrow} title={c.problem.title} className="mb-12" />
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <CardGrid cards={c.problem.cards} columns={3} />
          <TruckBanTimeline {...c.problem.timeline} />
        </div>
      </Section>

      <Section>
        <SectionHeader
          index="02"
          eyebrow={c.loop.eyebrow}
          title={c.loop.title}
          className="mb-12"
          action={
            <Button href={to(routes.howItWorks)} variant="link">
              {c.loop.link} <ArrowIcon className="size-4" />
            </Button>
          }
        />
        <StepTimeline steps={c.loop.steps} columns />
      </Section>

      <Section>
        <SectionHeader
          index="03"
          eyebrow={c.services.eyebrow}
          title={c.services.title}
          className="mb-12"
          action={
            <Button href={to(routes.services)} variant="link">
              {c.services.link} <ArrowIcon className="size-4" />
            </Button>
          }
        />
        <CardGrid cards={svc} columns={4} />
      </Section>

      <Section>
        <SectionHeader index="04" eyebrow={c.sectors.eyebrow} title={c.sectors.title} className="mb-12" />
        <ul className="grid grid-cols-2 border-t border-s border-line sm:grid-cols-3 lg:grid-cols-7">
          {sectors.map((sector) => (
            <li key={sector.code} className="border-e border-b border-line">
              <Link
                href={`${to(routes.industries)}#${sector.code.toLowerCase()}`}
                className="flex h-full flex-col gap-6 p-5 transition-colors hover:bg-panel"
              >
                <span className="num text-xs text-red">{sector.code}</span>
                <span className="text-sm leading-snug">{sector.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-8">
            <SectionHeader index="05" eyebrow={c.portal.eyebrow} title={c.portal.title} description={c.portal.description} />
            <Button href={to(routes.portal)} variant="secondary" className="self-start">
              {c.portal.button} <ArrowIcon className="size-4" />
            </Button>
          </div>
          <PortalPreview locale={locale} />
        </div>
      </Section>

      <Section id="calculator" className="scroll-mt-16">
        <SectionHeader index="06" eyebrow={c.calculator.eyebrow} title={c.calculator.title} className="mb-12" />
        <SavingsCalculator locale={locale} />
      </Section>

      <Section spacing="lg">
        <figure className="mx-auto max-w-4xl text-center">
          <p className="mb-8 font-mono text-xs tracking-[0.16em] text-red uppercase">{c.principle.eyebrow}</p>
          <blockquote className="text-2xl leading-snug font-medium text-balance sm:text-4xl">{s.principle}</blockquote>
        </figure>
      </Section>

      <CtaBand
        title={s.pilotCta.title}
        description={s.pilotCta.description}
        button={s.pilotCta.button}
        href={to(routes.pilot)}
      />
    </>
  );
}
