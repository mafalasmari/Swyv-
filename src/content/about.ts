import { t } from "@/i18n/localize";

export const about = {
  seo: {
    title: t("من نحن | سوايف للخدمات اللوجستية", "About | SWYV Logistics Services Co."),
    description: t(
      "أسسنا سوايف في الرياض لنبني رحلة واحدة تحل منع الشاحنات نهاراً واستلام الفروع نهاراً والمرتجعات العالقة.",
      "We founded SWYV in Riyadh to build one trip that solves daytime truck bans, daytime branch receiving and stuck returns.",
    ),
  },
  intro: { eyebrow: t("من نحن", "About"), title: t("قصتنا", "Our story") },
  story: t(
    "أسسنا سوايف في الرياض لحل مشكلة يعيشها كل من يوزّع لفروع داخل المدينة: الشاحنة ممنوعة نهاراً، والفرع يستلم نهاراً، والمرتجعات تبقى عالقة بلا من يسحبها أو يوثّقها. فبنينا رحلة واحدة تحل الثلاث.",
    "We founded SWYV in Riyadh to solve a problem every business delivering to city branches lives with: trucks are banned by day, branches receive by day, and returns sit with no one to collect or record them. So we built one trip that solves all three.",
  ),
  vision: {
    title: t("رؤيتنا", "Vision"),
    body: t(
      "أن نكون الشبكة الأكثر موثوقية لحركة البضائع وإعادتها داخل مدن المملكة.",
      "To be the most trusted network for moving goods in and out of the Kingdom's cities.",
    ),
  },
  mission: {
    title: t("رسالتنا", "Mission"),
    body: t("رحلة واحدة منضبطة، وكل مرتجع موثّق، وكل ريال واضح.", "One disciplined trip, every return documented, every riyal accounted for."),
  },
  principlesTitle: t("مبادئنا", "Principles"),
  principles: [
    { title: t("الحياد", "Neutrality"), body: t("لا نبيع المنتجات ولا نشتريها، فبضاعتك تبقى ملكك.", "We don't buy or sell products; your goods stay yours.") },
    { title: t("التوثيق", "Documentation"), body: t("لا يُحمَّل مرتجع دون نموذج موقّع.", "No return is loaded without a signed form.") },
    { title: t("الانضباط", "Discipline"), body: t("نافذة الاستلام موعد لا يُكسر.", "The receiving window is a promise.") },
    { title: t("الكثافة قبل الاتساع", "Density first"), body: t("نخدم حياً جيداً قبل أن ننتقل لغيره.", "We serve a district well before moving to the next.") },
    { title: t("الشفافية", "Transparency"), body: t("كل رحلة وصورة وفاتورة في بوابتك.", "Every trip, photo and invoice in your portal.") },
  ],
};
