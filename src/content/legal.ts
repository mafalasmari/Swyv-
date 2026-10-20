import { t } from "@/i18n/localize";

export const legal = {
  reviewNote: t(
    "يُراجع النص النهائي قانونياً وفق نظام حماية البيانات الشخصية قبل النشر. ما يلي هيكل الوثيقة والنقاط المعتمدة حتى الآن.",
    "The final text is subject to legal review under the Personal Data Protection Law before publication. Below is the document structure and the points confirmed so far.",
  ),
  pending: t("يُستكمل بعد المراجعة القانونية.", "To be completed after legal review."),
  privacy: {
    seo: {
      title: t("سياسة الخصوصية | سوايف", "Privacy policy | SWYV"),
      description: t("كيف تجمع سوايف بياناتك وتستخدمها وتحميها.", "How SWYV collects, uses and protects your data."),
    },
    title: t("سياسة الخصوصية", "Privacy policy"),
    sections: [
      { title: t("من نحن", "Who we are"), points: [t("شركة سوايف للخدمات اللوجستية، الرياض، المملكة العربية السعودية.", "SWYV Logistics Services Co., Riyadh, Kingdom of Saudi Arabia.")] },
      {
        title: t("البيانات التي نجمعها", "Data we collect"),
        points: [
          t("بيانات النماذج", "Form submissions"),
          t("بيانات العملاء في البوابة", "Client data in the portal"),
          t("الصور والتوقيعات في نماذج الفحص", "Photos and signatures in audit forms"),
          t("بيانات التصفح وملفات الارتباط", "Browsing data and cookies"),
        ],
      },
      { title: t("لماذا نجمعها والأساس النظامي", "Why we collect it and the legal basis"), points: [] },
      {
        title: t("مع من نشاركها", "Who we share it with"),
        points: [
          t("الناقلون المتعاقدون بقدر ما تحتاجه الرحلة فقط.", "Contracted carriers, only as much as the trip requires."),
          t("الجهات الحكومية عند الطلب النظامي.", "Government authorities on lawful request."),
          t("لا نبيع البيانات.", "We do not sell data."),
        ],
      },
      { title: t("أين تُحفظ ومدة الاحتفاظ", "Where it is stored and for how long"), points: [] },
      {
        title: t("حقوقك", "Your rights"),
        points: [t("الاطلاع", "Access"), t("التصحيح", "Correction"), t("الإتلاف", "Deletion"), t("سحب الموافقة", "Withdrawing consent")],
      },
      { title: t("ملفات الارتباط", "Cookies"), points: [] },
      { title: t("التعديلات وتاريخ آخر تحديث", "Changes and last updated date"), points: [] },
    ],
  },
  terms: {
    seo: {
      title: t("الشروط والأحكام | سوايف", "Terms | SWYV"),
      description: t("شروط استخدام موقع سوايف وبوابة العملاء.", "Terms of use for the SWYV website and client portal."),
    },
    title: t("الشروط والأحكام", "Terms"),
    sections: [
      { title: t("استخدام الموقع", "Use of the site"), points: [] },
      { title: t("الحسابات في البوابة", "Portal accounts"), points: [] },
      { title: t("حدود الخدمة", "Service limits"), points: [t("لا ننقل المواد الخطرة أو المبرّدة أو الممنوعة.", "We do not move hazardous, refrigerated or prohibited goods.")] },
      { title: t("المسؤولية", "Liability"), points: [t("تحكمها اتفاقية الخدمة الموقّعة مع كل عميل.", "Governed by the service agreement signed with each client.")] },
      { title: t("الملكية الفكرية", "Intellectual property"), points: [] },
      { title: t("القانون الحاكم", "Governing law"), points: [t("أنظمة المملكة العربية السعودية.", "The laws of the Kingdom of Saudi Arabia.")] },
    ],
  },
};
