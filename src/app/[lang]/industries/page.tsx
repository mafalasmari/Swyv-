import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ArrowIcon, Chevron } from "@/components/ui/icons";
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
        <ul className="grid border-t border-s border-rule sm:grid-cols-2 lg:grid-cols-4">
          {c.sectors.map((sector) => (
            <li
              key={sector.code}
              id={sector.code.toLowerCase()}
              className="flex scroll-mt-24 flex-col gap-5 border-e border-b border-rule p-6 transition-colors hover:bg-raised"
            >
              <span className="num text-xs text-red">{sector.code}</span>
              <h2 className="text-lg leading-snug font-semibold">{sector.name}</h2>
              <dl className="mt-auto grid gap-3 text-sm">
                <div className="flex gap-2.5">
                  <dt className="mt-1.5 shrink-0">
                    <Chevron direction="down" className="size-2 text-red" />
                    <span className="sr-only">{c.headers.deliver}</span>
                  </dt>
                  <dd className="text-muted">{sector.deliver}</dd>
                </div>
                <div className="flex gap-2.5">
                  <dt className="mt-1.5 shrink-0">
                    <Chevron direction="up" className="size-2 text-pending" />
                    <span className="sr-only">{c.headers.return}</span>
                  </dt>
                  <dd className="text-muted">{sector.back}</dd>
                </div>
              </dl>
            </li>
          ))}
          <li className="border-e border-b border-rule">
            <Link
              href={href(locale, routes.contact)}
              className="group flex h-full flex-col justify-between gap-6 p-6 transition-colors hover:bg-raised"
            >
              <span className="text-lg leading-snug font-semibold">{c.cta.title}</span>
              <span className="flex items-center gap-2 text-sm text-red">
                {c.cta.button}
                <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </span>
            </Link>
          </li>
        </ul>
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
