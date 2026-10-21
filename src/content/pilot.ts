import { t } from "@/i18n/localize";

// 30 days per founder decision; brand PDF says 60 — outdated.
export const pilot = {
  seo: {
    title: t("برنامج التجربة 30 يوماً | سوايف", "30-day pilot program | SWYV"),
    description: t(
      "لا عقد طويل. نقيس، ونشغّل، ثم نعرض لك النتيجة بالأرقام.",
      "No long contract. We measure, we run, then we show you the result in numbers.",
    ),
  },
  intro: {
    eyebrow: t("برنامج التجربة", "Pilot program"),
    title: t("جرّبنا 30 يوماً على مسار واحد", "Try us for 30 days on one route"),
    description: t(
      "لا عقد طويل. نقيس، ونشغّل، ثم نعرض لك النتيجة بالأرقام.",
      "No long contract. We measure, we run, then we show you the result in numbers.",
    ),
  },
  timelineTitle: t("جدول التجربة", "Pilot timeline"),
  weekLabel: t("الأسبوع", "Week"),
  timeline: [
    { week: "1", title: t("الإعداد", "Setup"), body: t("نجمع قائمة الفروع ونوافذ الاستلام، ونقيس تكلفتك الحالية", "Branch list, receiving windows, baseline cost") },
    { week: "2–3", title: t("التشغيل", "Run"), body: t("عبور وتوزيع وسحب مرتجعات بنموذج فحص موقّع", "Cross-dock, delivery and returns pickup with signed forms") },
    { week: "4", title: t("المراجعة", "Review"), body: t("تقرير بالتكلفة ونسبة التسليم في الموعد والمرتجعات، ثم القرار", "Report on cost, on-window delivery and returns, then decide") },
  ],
  measureTitle: t("ما نقيسه", "What we measure"),
  measure: [
    t("التسليم داخل النافذة", "On-window delivery"),
    t("تكلفة الطبلية مقارنة بخط أساسك", "Cost per pallet vs your baseline"),
    t("رحلات المرتجعات التي وفرتها", "Return trips saved"),
    t("المرتجعات الموثّقة وقيمتها", "Documented returns and their value"),
  ],
  needTitle: t("ما نحتاجه منك", "What we need from you"),
  need: [
    t("قائمة الفروع المشمولة ونوافذ الاستلام", "Branch list and receiving windows"),
    t("اسم مسؤول في كل فرع", "A contact at each branch"),
    t("تكلفتك الحالية للرحلة", "Your current cost per trip"),
  ],
  formTitle: t("نموذج طلب التجربة", "Pilot request form"),
};
