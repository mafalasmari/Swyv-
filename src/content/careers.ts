import { t } from "@/i18n/localize";

export const careers = {
  seo: {
    title: t("الوظائف | سوايف", "Careers | SWYV"),
    description: t(
      "انضم لفريق يبني اللوجستيات العكسية في الرياض.",
      "Join the team building reverse logistics in Riyadh.",
    ),
  },
  intro: {
    eyebrow: t("الوظائف", "Careers"),
    title: t("انضم لفريق يبني اللوجستيات العكسية في الرياض", "Join the team building reverse logistics in Riyadh"),
  },
  labels: {
    responsibilities: t("المسؤوليات", "Responsibilities"),
    requirements: t("المتطلبات", "Requirements"),
    location: t("الموقع", "Location"),
    riyadh: t("الرياض", "Riyadh"),
    apply: t("قدّم الآن", "Apply"),
  },
  // Draft role outlines drawn from the operating model; review before publishing.
  roles: [
    {
      id: "field-inspector",
      title: t("مشرف ميداني (وردية ليلية / نهارية)", "Field inspector (night / day shift)"),
      responsibilities: [
        t("عدّ الطبليات ومطابقتها مع قائمة التعبئة في نقطة العبور", "Count pallets and match them to the packing list at the cross-dock"),
        t("تعبئة نموذج فحص المرتجعات بالصور قبل التحميل", "Complete the photo-backed returns audit form before loading"),
        t("الحصول على توقيع مسؤول الفرع وتسجيل الاستثناءات", "Get the branch officer's signature and log exceptions"),
      ],
      requirements: [
        t("دقة في التوثيق وانضباط بالمواعيد", "Accurate documentation and punctuality"),
        t("القدرة على العمل بورديات ليلية أو نهارية", "Able to work night or day shifts"),
        t("استخدام الجهاز اللوحي والتطبيقات", "Comfortable with a tablet and apps"),
      ],
    },
    {
      id: "operations-manager",
      title: t("مدير عمليات", "Operations manager"),
      responsibilities: [
        t("إدارة الناقلين المتعاقدين ومعايير التسليم", "Manage contracted carriers and delivery standards"),
        t("تخطيط المسارات ونوافذ الاستلام", "Plan routes and receiving windows"),
        t("متابعة مؤشرات التسليم في الموعد والاستثناءات", "Track on-window delivery and exceptions"),
      ],
      requirements: [
        t("خبرة في العمليات اللوجستية داخل المدن", "Experience in urban logistics operations"),
        t("قيادة فرق ميدانية", "Leading field teams"),
        t("التعامل مع البيانات والتقارير", "Working with data and reports"),
      ],
    },
    {
      id: "b2b-sales",
      title: t("مدير مبيعات للشركات", "B2B sales manager"),
      responsibilities: [
        t("بناء علاقات مع الموزعين وسلاسل التجزئة في الرياض", "Build relationships with distributors and retail chains in Riyadh"),
        t("قيادة تجارب الثلاثين يوماً حتى التعاقد", "Lead 30-day pilots through to contract"),
        t("إعداد العروض بناءً على تكلفة العميل الفعلية", "Prepare proposals from the client's measured cost"),
      ],
      requirements: [
        t("خبرة في مبيعات الخدمات اللوجستية أو سلاسل الإمداد", "Experience selling logistics or supply chain services"),
        t("شبكة علاقات في قطاع التجزئة أو المواد الاستهلاكية", "A network in retail or FMCG"),
        t("مهارة عرض الأرقام والتكلفة", "Strong with numbers and cost cases"),
      ],
    },
  ],
  formTitle: t("نموذج التقديم", "Application form"),
};
