import { PageHero } from "@/components/sections/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { Section } from "@/components/ui/Section";
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
      <Section>
        <Accordion items={c.items.map((item) => ({ question: item.q, answer: item.a }))} className="max-w-4xl" />
      </Section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
