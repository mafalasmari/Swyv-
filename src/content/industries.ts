import { t } from "@/i18n/localize";

export const industries = {
  seo: {
    title: t("القطاعات التي نخدمها | سوايف", "Industries we serve | SWYV"),
    description: t(
      "لمن يملك فروعاً ويستقبل مرتجعات: المواد الاستهلاكية، والتجارة الإلكترونية، وموردو المقاهي، والمياه، والتجزئة، والصيدليات، وقطع الغيار.",
      "For businesses with branches and returns: FMCG, e-commerce, HORECA suppliers, water, retail, pharmacies and spare parts.",
    ),
  },
  intro: {
    eyebrow: t("القطاعات", "Industries"),
    title: t("لمن يملك فروعاً ويستقبل مرتجعات", "For businesses with branches and returns"),
  },
  headers: {
    sector: t("القطاع", "Sector"),
    deliver: t("ما نوصله", "What we deliver"),
    return: t("ما نعيده", "What we bring back"),
  },
  sectors: [
    { code: "FMCG", name: t("المواد الاستهلاكية", "FMCG"), deliver: t("توريد يومي للفروع", "Daily branch replenishment"), back: t("قريب الانتهاء، والتالف، والفائض", "Near-expiry, damaged, overstock") },
    { code: "ECOM", name: t("التجارة الإلكترونية", "E-commerce"), deliver: t("من مركز التنفيذ إلى المتاجر المظلمة ونقاط الاستلام، وشحنات مستودعات المنصات", "FC to dark stores and pickup points, marketplace inbound"), back: t("مرتجعات الطرود بالقفص والطبلية من مراكز الشحن", "Parcel returns by cage or pallet from courier hubs") },
    { code: "HRCA", name: t("موردو المقاهي والمطاعم", "HORECA suppliers"), deliver: t("توصيلات صباحية صغيرة", "Small morning deliveries"), back: t("الصناديق والطبليات وقريب الانتهاء", "Crates, pallets, near-expiry") },
    { code: "BEV", name: t("المياه والمشروبات", "Water & beverages"), deliver: t("توريد للفروع والمنافذ", "Branch and outlet supply"), back: t("العبوات والصناديق المرتجعة", "Returnable bottles and crates") },
    { code: "RTL", name: t("سلاسل التجزئة", "Retail chains"), deliver: t("توريد الفروع والنقل بينها", "Branch supply and transfers"), back: t("مرتجعات العملاء والراكد الموسمي", "Customer returns, seasonal dead stock") },
    { code: "PHRM", name: t("الصيدليات والعناية الشخصية (غير المبرّدة)", "Pharmacies & personal care (non-refrigerated)"), deliver: t("توريد الفروع", "Branch supply"), back: t("قريب الانتهاء والمسحوب", "Near-expiry, recalls") },
    { code: "PRTS", name: t("قطع الغيار", "Spare parts"), deliver: t("توصيلات عاجلة للمناطق الصناعية", "Urgent deliveries to industrial areas"), back: t("مرتجعات الضمان والقطع الخاطئة", "Warranty returns, wrong parts") },
  ],
  cta: {
    title: t("قطاعك ليس هنا؟ أخبرنا بما تحتاج.", "Not listed? Tell us what you need."),
    button: t("تواصل معنا", "Contact us"),
  },
};
