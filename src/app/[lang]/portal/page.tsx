import { PageHero } from "@/components/sections/PageHero";
import { PortalPreview } from "@/components/sections/PortalPreview";
import { DecisionSimulator } from "@/components/tools/lazy";
import { TelemetryDashboard } from "@/components/tools/lazy";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { portal } from "@/content/portal";
import { routes } from "@/content/site";
import { href } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/portal">) {
  return pageMetadata(await getLocale(params), routes.portal, portal.seo);
}

export default async function PortalPage({ params }: PageProps<"/[lang]/portal">) {
  const locale = await getLocale(params);
  const c = localize(portal, locale);

  return (
    <>
      <PageHero
        eyebrow={c.intro.eyebrow}
        title={c.intro.title}
        actions={
          <>
            <Button href={href(locale, routes.login)} size="lg">
              {c.intro.login}
            </Button>
            <Button href={href(locale, routes.contact)} variant="secondary" size="lg">
              {c.intro.demo}
            </Button>
          </>
        }
        aside={<PortalPreview locale={locale} />}
      />

      {/* Fully dark page: the intro is a single floating light card, not a full section. */}
      <Section tone="dark" divided>
        <div className="section-light p-6 sm:p-10">
          <SectionHeader index="01" eyebrow={c.featuresTitle} title={c.featuresTitle} className="mb-10" />
          <dl className="grid border-t border-s border-rule sm:grid-cols-2 lg:grid-cols-4">
            {c.features.map((f, i) => (
              <div key={f.name} className="flex flex-col gap-3 border-e border-b border-rule p-6">
                <dt className="flex items-center gap-3 font-semibold">
                  <span className="num text-xs text-red">{String(i + 1).padStart(2, "0")}</span>
                  {f.name}
                </dt>
                <dd className="text-sm leading-relaxed text-muted">{f.body}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-col gap-2 border-s-2 border-delivered bg-delivered/5 p-5 sm:flex-row sm:items-center sm:gap-6">
            <span className="font-mono text-xs tracking-[0.16em] text-fg uppercase">{c.security.title}</span>
            <p className="text-sm text-fg/90">{c.security.body}</p>
          </div>
        </div>
      </Section>

      <Section tone="dark" divided id="telemetry" className="scroll-mt-16">
        <SectionHeader
          index="02"
          eyebrow={c.telemetry.eyebrow}
          title={c.telemetry.title}
          description={c.telemetry.description}
          className="mb-10"
        />
        <TelemetryDashboard locale={locale} />
      </Section>

      {/* Flat Asphalt band: a visual pause between the two dark tools, no notch. */}
      <Section tone="muted" spacing="sm" id="simulator" className="scroll-mt-16">
        <SectionHeader
          index="03"
          eyebrow={c.simulator.eyebrow}
          title={c.simulator.title}
          description={c.simulator.description}
        />
      </Section>
      <Section tone="dark">
        <DecisionSimulator locale={locale} />
      </Section>
    </>
  );
}
