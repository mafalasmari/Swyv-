import { CheckList } from "@/components/sections/CheckList";
import { PageHero } from "@/components/sections/PageHero";
import { SchemaForm } from "@/components/forms/SchemaForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { carriers } from "@/content/carriers";
import { routes } from "@/content/site";
import { href } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/carriers">) {
  return pageMetadata(await getLocale(params), routes.carriers, carriers.seo);
}

export default async function CarriersPage({ params }: PageProps<"/[lang]/carriers">) {
  const locale = await getLocale(params);
  const c = localize(carriers, locale);

  return (
    <>
      <PageHero eyebrow={c.intro.eyebrow} title={c.intro.title} description={c.intro.description} />
      <Section>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-5 border-t border-line pt-6">
            <Eyebrow index="01">{c.offerTitle}</Eyebrow>
            <CheckList items={c.offer} className="text-lg" />
          </div>
          <div className="flex flex-col gap-5 border-t border-line pt-6">
            <Eyebrow index="02">{c.requireTitle}</Eyebrow>
            <CheckList items={c.require} className="text-lg" />
          </div>
        </div>
      </Section>
      <Section id="register" className="scroll-mt-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <SectionHeader index="03" eyebrow={c.formTitle} title={c.formTitle} />
          <SchemaForm formId="carrier" locale={locale} privacyHref={href(locale, routes.privacy)} />
        </div>
      </Section>
    </>
  );
}
