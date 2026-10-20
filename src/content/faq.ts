import { t } from "@/i18n/localize";

export const faq = {
  seo: {
    title: t("الأسئلة الشائعة | سوايف", "FAQ | SWYV"),
    description: t(
      "إجابات عن الأصول والمناطق والأسعار والمرتجعات وأمان البيانات في سوايف.",
      "Answers on SWYV's assets, coverage, pricing, returns and data security.",
    ),
  },
  intro: { eyebrow: t("الأسئلة الشائعة", "FAQ"), title: t("أسئلة يطرحها العملاء قبل البدء", "Questions clients ask before starting") },
  items: [
    { q: t("هل تملكون شاحنات؟", "Do you own trucks?"), a: t("لا. نتعاقد مع ناقلين مرخّصين ونديرهم بمعاييرنا، ومشرفنا حاضر في كل تسليم.", "No. We contract licensed carriers, manage them to our standards, and our inspector attends every delivery.") },
    { q: t("ما المناطق التي تخدمونها؟", "Which areas do you serve?"), a: t("نبدأ بشمال الرياض، ونتوسع حياً بعد حي.", "We start in North Riyadh and expand district by district.") },
    { q: t("هل تشترون المرتجعات أو تبيعونها؟", "Do you buy or sell returns?"), a: t("لا. نفحص ونوثّق ونسلّم البضاعة حيث تحدد أنت، وتبقى ملكك دائماً.", "No. We inspect, document and deliver your goods wherever you decide. They always remain yours.") },
    { q: t("كيف تُحسب الأسعار؟", "How is pricing calculated?"), a: t("حسب الطبلية أو القفص أو الرحلة المخصصة، مع رسم لكل نقطة سحب مرتجعات. نعطيك عرضاً بعد معرفة فروعك وحجمك.", "Per pallet, cage or dedicated trip, plus a fee per returns stop. We quote once we know your branches and volume.") },
    { q: t("هل تنقلون بضائع مبرّدة؟", "Do you move refrigerated goods?"), a: t("ليس حالياً.", "Not at this stage.") },
    { q: t("هل توصلون طروداً للمستهلكين؟", "Do you deliver parcels to consumers?"), a: t("لا. نعمل بالطبلية والقفص بين المستودعات والفروع ومراكز الشحن.", "No. We move pallets and cages between warehouses, branches and courier hubs.") },
    { q: t("ماذا يحدث إن تلفت البضاعة أثناء النقل؟", "What if goods are damaged in transit?"), a: t("كل طبلية تُعدّ وتُصوّر عند الاستلام والتسليم، وتُعالج المطالبات وفق اتفاقية الخدمة.", "Every pallet is counted and photographed at pickup and delivery; claims are handled under the service agreement.") },
    { q: t("هل بياناتي آمنة؟", "Is my data secure?"), a: t("نعم. بياناتك معزولة عن العملاء الآخرين، ونعالجها وفق نظام حماية البيانات الشخصية.", "Yes. Your data is isolated from other clients and processed under the Personal Data Protection Law.") },
  ],
};
