import { PageHero } from "@/components/sections/PageHero";
import { SchemaForm } from "@/components/forms/SchemaForm";
import { Section } from "@/components/ui/Section";
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
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <dl className="flex flex-col gap-2 self-start border-t border-line pt-6">
            <dt className="font-mono text-xs tracking-[0.16em] text-steel uppercase">{c.location.label}</dt>
            <dd className="text-lg">{c.location.value}</dd>
          </dl>
          <SchemaForm formId="contact" locale={locale} privacyHref={href(locale, routes.privacy)} />
        </div>
      </Section>
    </>
  );
}
