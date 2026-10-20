import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { Chevron } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { industries } from "@/content/industries";
import { routes } from "@/content/site";
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

  return (
    <>
      <PageHero eyebrow={c.intro.eyebrow} title={c.intro.title} />

      <Section>
        {/* Header row (desktop) */}
        <div className="hidden grid-cols-[5rem_1.2fr_1.5fr_1.5fr] border-b border-line pb-3 font-mono text-[11px] tracking-wider text-steel uppercase md:grid">
          <span />
          <span>{c.headers.sector}</span>
          <span className="flex items-center gap-2">
            <Chevron direction="down" className="size-2 text-red" /> {c.headers.deliver}
          </span>
          <span className="flex items-center gap-2">
            <Chevron direction="up" className="size-2 text-pending" /> {c.headers.return}
          </span>
        </div>
        <ul>
          {c.sectors.map((sector) => (
            <li
              key={sector.code}
              id={sector.code.toLowerCase()}
              className="grid scroll-mt-24 gap-3 border-b border-line py-6 transition-colors hover:bg-panel md:grid-cols-[5rem_1.2fr_1.5fr_1.5fr] md:gap-6"
            >
              <span className="num text-sm text-red">{sector.code}</span>
              <h2 className="text-lg font-semibold">{sector.name}</h2>
              <p className="flex gap-2 text-steel">
                <Chevron direction="down" className="mt-2 size-2 shrink-0 text-red md:hidden" />
                <span>
                  <span className="sr-only md:hidden">{c.headers.deliver}: </span>
                  {sector.deliver}
                </span>
              </p>
              <p className="flex gap-2 text-steel">
                <Chevron direction="up" className="mt-2 size-2 shrink-0 text-pending md:hidden" />
                <span>
                  <span className="sr-only md:hidden">{c.headers.return}: </span>
                  {sector.back}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand title={c.cta.title} button={c.cta.button} href={href(locale, routes.contact)} />
    </>
  );
}
