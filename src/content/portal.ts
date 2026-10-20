import { t } from "@/i18n/localize";

export const portal = {
  seo: {
    title: t("بوابة SWYV | التتبع ونماذج الفحص والتقارير والفواتير", "SWYV Portal | Tracking, audit forms, reports and invoices"),
    description: t(
      "كل رحلة وكل مرتجع أمامك، من الحجز حتى الفاتورة.",
      "Every trip and every return in front of you, from booking to invoice.",
    ),
  },
  intro: {
    eyebrow: t("بوابة SWYV", "SWYV Portal"),
    title: t("كل رحلة وكل مرتجع أمامك، من الحجز حتى الفاتورة.", "Every trip and every return in front of you, from booking to invoice."),
    login: t("دخول العملاء", "Client login"),
    demo: t("اطلب عرضاً للبوابة", "Request a demo"),
  },
  featuresTitle: t("ما في البوابة", "What's inside"),
  features: [
    { name: t("الحجز", "Booking"), body: t("احجز شحنة في دقيقة، مع تقدير السعر من قائمة أسعارك", "Book in a minute, with a price estimate from your price list") },
    { name: t("التتبع", "Tracking"), body: t("مطلوبة ← مجدولة ← في نقطة العبور ← في الطريق ← مسلّمة", "Requested → scheduled → at hub → out → delivered") },
    { name: t("إثبات التسليم", "Proof of delivery"), body: t("اسم المستلم وتوقيعه وصورة ووقت", "Receiver name, signature, photo and time") },
    { name: t("نماذج الفحص", "Audit forms"), body: t("كل نموذج موقّع بالصور، وقابل للتحميل PDF", "Every signed form with photos, downloadable as PDF") },
    { name: t("التقارير", "Reports"), body: t("أسباب الإرجاع وقيمتها لكل فرع، وأداء التسليم", "Return reasons and value by branch, delivery performance") },
    { name: t("الفواتير", "Invoices"), body: t("فاتورة شهرية وكشف تفصيلي", "Monthly invoice and detailed statement") },
    { name: t("الصلاحيات", "Roles"), body: t("مدير، ومالية، ومسؤول فرع، كلٌّ يرى ما يخصه", "Admin, finance, branch officer, each sees their own") },
    { name: t("اللغة", "Language"), body: t("عربي وإنجليزي", "Arabic and English") },
  ],
  security: {
    title: t("الأمان", "Security"),
    body: t(
      "بياناتك معزولة عن أي عميل آخر، والصور والتوقيعات محفوظة بشكل خاص.",
      "Your data is isolated from other clients; photos and signatures are stored privately.",
    ),
  },
  telemetry: {
    eyebrow: t("عرض حي", "Live demo"),
    title: t("تتبّع الأصول وزمن البقاء", "Asset telemetry & dwell time"),
    description: t(
      "كل طبلية وقفص وفان في الشبكة، وكم بقي في مكانه مقارنة بالحد المسموح. البيانات هنا توضيحية.",
      "Every pallet, cage and van in the network, and how long it has stayed put against its limit. Data shown is illustrative.",
    ),
  },
  simulator: {
    eyebrow: t("ذكاء القرار", "Decision intelligence"),
    title: t("محاكي القرار الذكي", "AI decision simulator"),
    description: t(
      "غيّر حجم المرتجعات ومزيجها وأولوياتك، وشاهد أثر قرار التوجيه على القيمة المستردة والسرعة والانبعاثات.",
      "Change your return volume, mix and priorities, and see how routing decisions move recovered value, speed and emissions.",
    ),
  },
};
