import { PageHero } from "@/components/sections/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { NotchSeparator } from "@/components/ui/NotchSeparator";
import { Section } from "@/components/ui/Section";
import { CtaBand } from "@/components/sections/CtaBand";
import { href } from "@/i18n/config";
import { services } from "@/content/services";
import { faq } from "@/content/faq";
import { routes } from "@/content/site";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/faq">) {
  return pageMetadata(await getLocale(params), routes.faq, faq.seo);
}

export default async function FaqPage({ params }: PageProps<"/[lang]/faq">) {
  const locale = await getLocale(params);
  const c = localize(faq, locale);
  const cta = localize(services.cta, locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: c.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <PageHero eyebrow={c.intro.eyebrow} title={c.intro.title} />
      <NotchSeparator from="dark" to="muted" />
      <Section tone="muted">
        <Accordion items={c.items.map((item) => ({ question: item.q, answer: item.a }))} className="max-w-4xl" />
      </Section>
      <NotchSeparator from="muted" to="dark" />
      <CtaBand tone="dark" title={cta.title} button={cta.button} href={href(locale, routes.contact)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
