import type { Metadata } from "next";
import { CardGrid } from "@/components/sections/CardGrid";
import { CheckList } from "@/components/sections/CheckList";
import { StepTimeline } from "@/components/sections/StepTimeline";
import { TruckBanTimeline } from "@/components/sections/TruckBanTimeline";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { NotchSeparator } from "@/components/ui/NotchSeparator";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusTag } from "@/components/ui/StatusTag";
import { Tabs } from "@/components/ui/Tabs";
import { getLocale } from "@/lib/params";
import { ScrollProbe } from "./ScrollProbe";

// Temporary review page for phase 3: every converted component on each tone.
// Not linked, not in the sitemap, not indexed. Removed when phase 3 is approved.
export const metadata: Metadata = { title: "Component tones", robots: { index: false, follow: false } };

const TONES = ["dark", "light", "muted"] as const;

const COPY = {
  ar: {
    title: "رحلة واحدة. توصيل لفروعك، ومرتجعاتك تعود إليك.",
    body: "شاحناتك تفرّغ ليلاً على طرف الرياض، وفاناتنا تسلّم فروعك نهاراً.",
    eyebrow: "قسم تجريبي",
    primary: "اطلب تجربة 30 يوماً",
    secondary: "احسب توفيرك",
    ghost: "رابط ثانوي",
    link: "تفاصيل",
    tags: ["مُسلّمة", "قيد الانتظار", "ملاحظة", "في الطريق", "مجدولة"],
    cards: [
      { title: "ساعات المنع", body: "الشاحنات الثقيلة ممنوعة نهاراً." },
      { title: "رحلة العودة الفارغة", body: "فاناتك تعود فارغة." },
      { title: "مرتجعات عالقة", body: "المرتجعات تبقى في الفروع." },
    ],
    steps: [
      { title: "عبور ليلي", body: "نستقبل شاحناتك ليلاً.", dir: "down" },
      { title: "سحب المرتجعات", body: "الفان نفسه يعود بالمرتجعات.", dir: "up" },
    ],
    checks: ["التسليم داخل النافذة", "رحلات المرتجعات التي وفرتها"],
    faq: [{ question: "هل تملكون شاحنات؟", answer: "لا. نتعاقد مع ناقلين مرخّصين." }],
    tabs: ["الأول", "الثاني"],
    timeline: { label: "دخول الشاحنات الثقيلة", banned: "ممنوع", allowed: "مسموح", note: "توضيح عام." },
  },
  en: {
    title: "One trip. Delivered to your branches, returns back to you.",
    body: "Your trucks unload at night on the edge of Riyadh. Our vans deliver by day.",
    eyebrow: "Sample section",
    primary: "Request a 30-day pilot",
    secondary: "Calculate your savings",
    ghost: "Secondary link",
    link: "Details",
    tags: ["Delivered", "Pending", "Exception", "In transit", "Scheduled"],
    cards: [
      { title: "Ban hours", body: "Heavy trucks are banned by day." },
      { title: "The empty return trip", body: "Your vans return empty." },
      { title: "Stuck returns", body: "Returns sit in branches." },
    ],
    steps: [
      { title: "Night cross-dock", body: "We receive your trucks at night.", dir: "down" },
      { title: "Returns pickup", body: "The same van brings back returns.", dir: "up" },
    ],
    checks: ["On-window delivery", "Return trips saved"],
    faq: [{ question: "Do you own trucks?", answer: "No. We contract licensed carriers." }],
    tabs: ["First", "Second"],
    timeline: { label: "Heavy-truck entry", banned: "Banned", allowed: "Allowed", note: "General illustration." },
  },
};

export default async function ToneTestPage({ params }: PageProps<"/[lang]/test-notch">) {
  const locale = await getLocale(params);
  const c = COPY[locale];

  return (
    <>
      {TONES.map((tone, i) => (
        <div key={tone}>
          <Section tone={tone} data-tone={tone}>
            <p className="mb-6 font-mono text-xs text-muted">section-{tone}</p>
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="flex flex-col gap-6">
                <SectionHeader index="01" eyebrow={c.eyebrow} title={c.title} description={c.body} />
                <div className="flex flex-wrap items-center gap-3">
                  <Button>{c.primary}</Button>
                  <Button variant="secondary">{c.secondary}</Button>
                  <Button variant="ghost">{c.ghost}</Button>
                  <Button variant="link">{c.link}</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["ok", "warn", "bad", "info", "idle"] as const).map((tone, j) => (
                    <StatusTag key={tone} tone={tone}>
                      {c.tags[j]}
                    </StatusTag>
                  ))}
                </div>
                <CheckList items={c.checks} />
                <Accordion items={c.faq} />
                <Tabs
                  items={c.tabs.map((label, j) => ({ id: String(j), label, content: <p className="text-muted">{c.body}</p> }))}
                />
              </div>
              <div className="flex flex-col gap-6">
                <CardGrid cards={c.cards} columns={3} />
                <StepTimeline steps={c.steps} columns />
                <TruckBanTimeline {...c.timeline} />
              </div>
            </div>
          </Section>
          {i < TONES.length - 1 && <NotchSeparator from={tone} to={TONES[i + 1]} />}
        </div>
      ))}
      <ScrollProbe />
    </>
  );
}
