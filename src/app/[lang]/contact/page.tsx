import { PageHero } from "@/components/sections/PageHero";
import { SchemaForm } from "@/components/forms/SchemaForm";
import { NotchSeparator } from "@/components/ui/NotchSeparator";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { contact } from "@/content/contact";
import { routes } from "@/content/site";
import { href } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  return pageMetadata(await getLocale(params), routes.contact, contact.seo);
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const locale = await getLocale(params);
  const c = localize(contact, locale);

  return (
    <>
      <PageHero eyebrow={c.intro.eyebrow} title={c.intro.title} />
      <NotchSeparator from="dark" to="light" />
      <Section tone="light" spacing="sm">
        <dl className="flex flex-col gap-3">
          <dt className="font-mono text-xs tracking-[0.16em] text-muted uppercase">{c.location.label}</dt>
          <dd className="text-2xl font-medium sm:text-3xl">{c.location.value}</dd>
        </dl>
      </Section>

      <NotchSeparator from="light" to="dark" />
      {/* The form is the destination of this page: no closing CTA. */}
      <Section tone="dark">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <SectionHeader
            index="01"
            eyebrow={c.intro.eyebrow}
            title={c.formTitle}
            className="self-start lg:sticky lg:top-24"
          />
          <SchemaForm formId="contact" locale={locale} privacyHref={href(locale, routes.privacy)} />
        </div>
      </Section>
    </>
  );
}
