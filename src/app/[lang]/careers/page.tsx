import { CheckList } from "@/components/sections/CheckList";
import { PageHero } from "@/components/sections/PageHero";
import { SchemaForm } from "@/components/forms/SchemaForm";
import { Button } from "@/components/ui/Button";
import { NotchSeparator } from "@/components/ui/NotchSeparator";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { careers } from "@/content/careers";
import { routes } from "@/content/site";
import { href } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/careers">) {
  return pageMetadata(await getLocale(params), routes.careers, careers.seo);
}

export default async function CareersPage({ params }: PageProps<"/[lang]/careers">) {
  const locale = await getLocale(params);
  const c = localize(careers, locale);

  return (
    <>
      <PageHero eyebrow={c.intro.eyebrow} title={c.intro.title} />
      <NotchSeparator from="dark" to="light" />
      <Section tone="light">
        <ul className="grid gap-px border border-rule bg-rule">
          {c.roles.map((role, i) => (
            <li
              key={role.id}
              id={role.id}
              className="grid scroll-mt-24 gap-8 bg-surface p-6 sm:p-8 lg:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <div className="flex flex-col gap-3">
                <span className="num text-xs text-red">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="text-xl font-semibold">{role.title}</h2>
                <p className="font-mono text-[11px] tracking-wider text-muted uppercase">
                  {c.labels.location}: {c.labels.riyadh}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-mono text-[11px] tracking-wider text-muted uppercase">
                  {c.labels.responsibilities}
                </h3>
                <CheckList items={role.responsibilities} className="text-sm" />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-mono text-[11px] tracking-wider text-muted uppercase">{c.labels.requirements}</h3>
                <CheckList items={role.requirements} className="text-sm" />
              </div>
              <Button href="#apply" variant="secondary" className="self-start">
                {c.labels.apply}
              </Button>
            </li>
          ))}
        </ul>
      </Section>
      <NotchSeparator from="light" to="dark" />
      {/* Forms stay dark; the form is this page's call to action. */}
      <Section tone="dark" id="apply" className="scroll-mt-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <SectionHeader index="04" eyebrow={c.formTitle} title={c.formTitle} className="self-start lg:sticky lg:top-24" />
          <SchemaForm formId="career" locale={locale} privacyHref={href(locale, routes.privacy)} />
        </div>
      </Section>
    </>
  );
}
