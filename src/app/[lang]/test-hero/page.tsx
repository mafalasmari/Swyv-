import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { getLocale } from "@/lib/params";

// Temporary review page for phase 5: the scroll hero on its own, with sample copy.
// Not linked, not in the sitemap, not indexed.
export const metadata: Metadata = {
  title: "Scroll hero",
  robots: { index: false, follow: false },
};

const COPY = {
  ar: {
    eyebrow: "قسم تجريبي",
    title: "رحلة واحدة توصل بضاعتك نهاراً وتُرجِع لك المرتجعات كاش",
    body: "شاحناتك تفرّغ ليلاً على طرف الرياض، وفاناتنا تسلّم فروعك نهاراً وتعود بالمرتجعات.",
    action: "اطلب تجربة 30 يوماً",
    after: "محتوى بعد الهيرو — للتأكد من أن التمرير يكمل طبيعياً.",
  },
  en: {
    eyebrow: "Sample section",
    title: "One trip: daytime delivery to your branches, returns recovered on the way back",
    body: "Your trucks unload at night on the edge of Riyadh. Our vans deliver your branches by day and bring the returns back.",
    action: "Request a 30-day pilot",
    after: "Content after the hero, to check that scrolling carries on normally.",
  },
};

export default async function ScrollHeroTestPage({ params }: PageProps<"/[lang]/test-hero">) {
  const locale = await getLocale(params);
  const c = COPY[locale];

  return (
    <>
      <PageHero
        scroll
        locale={locale}
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.body}
        actions={
          <Button href="#after" size="lg">
            {c.action}
          </Button>
        }
      />
      <Section tone="light" id="after">
        <p className="min-h-[60svh] text-lg">{c.after}</p>
      </Section>
    </>
  );
}
