import { LegalDocument } from "@/components/sections/LegalDocument";
import { PageHero } from "@/components/sections/PageHero";
import { legal } from "@/content/legal";
import { routes } from "@/content/site";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">) {
  return pageMetadata(await getLocale(params), routes.terms, legal.terms.seo);
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const locale = await getLocale(params);
  const c = localize(legal, locale);
  return (
    <>
      <PageHero eyebrow="Legal" title={c.terms.title} />
      <LegalDocument note={c.reviewNote} pending={c.pending} sections={c.terms.sections} />
    </>
  );
}
