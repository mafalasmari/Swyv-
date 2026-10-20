import { LegalDocument } from "@/components/sections/LegalDocument";
import { PageHero } from "@/components/sections/PageHero";
import { legal } from "@/content/legal";
import { routes } from "@/content/site";
import { localize } from "@/i18n/localize";
import { getLocale } from "@/lib/params";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">) {
  return pageMetadata(await getLocale(params), routes.privacy, legal.privacy.seo);
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const locale = await getLocale(params);
  const c = localize(legal, locale);
  return (
    <>
      <PageHero eyebrow="Legal" title={c.privacy.title} />
      <LegalDocument note={c.reviewNote} pending={c.pending} sections={c.privacy.sections} />
    </>
  );
}
