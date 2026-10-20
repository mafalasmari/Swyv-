import { t } from "@/i18n/localize";

/** Route paths without the locale prefix. */
export const routes = {
  home: "/",
  services: "/services",
  howItWorks: "/how-it-works",
  industries: "/industries",
  portal: "/portal",
  pilot: "/pilot",
  about: "/about",
  carriers: "/carriers",
  careers: "/careers",
  faq: "/faq",
  contact: "/contact",
  privacy: "/privacy",
  terms: "/terms",
  thankYou: "/thank-you",
} as const;

export type RouteKey = keyof typeof routes;

/**
 * Where "Client login" points. Set NEXT_PUBLIC_PORTAL_URL once the live portal
 * has a domain; until then it opens the portal page on this site.
 */
export const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL ?? "";

export const site = {
  name: t("سوايف للخدمات اللوجستية", "SWYV Logistics Services Co."),
  legalName: t("شركة سوايف للخدمات اللوجستية", "SWYV Logistics Services Co."),
  activities: t(
    "وساطة نقل البضائع · إدارة سلاسل الإمداد · المنصات اللوجستية",
    "Freight brokerage · Supply chain management · Logistics platforms",
  ),
  city: t("الرياض، المملكة العربية السعودية", "Riyadh, Kingdom of Saudi Arabia"),
  skipToContent: t("تخطَّ إلى المحتوى", "Skip to content"),
  nav: [
    { route: "services", label: t("الخدمات", "Services") },
    { route: "howItWorks", label: t("كيف نعمل", "How it works") },
    { route: "industries", label: t("القطاعات", "Industries") },
    { route: "portal", label: t("بوابة SWYV", "SWYV Portal") },
    { route: "about", label: t("من نحن", "About") },
    { route: "contact", label: t("تواصل معنا", "Contact") },
  ] satisfies { route: RouteKey; label: unknown }[],
  switchLanguage: t("English", "العربية"),
  switchLanguageLabel: t("التبديل إلى الإنجليزية", "Switch to Arabic"),
  clientLogin: t("دخول العملاء", "Client login"),
  primaryCta: t("اطلب تجربة 30 يوماً", "Request a 30-day pilot"),
  openMenu: t("فتح القائمة", "Open menu"),
  closeMenu: t("إغلاق القائمة", "Close menu"),
  status: t("الرياض · العمليات تعمل", "Riyadh · Operations live"),
  footer: {
    about: t(
      "شركة سوايف للخدمات اللوجستية. وساطة نقل البضائع · إدارة سلاسل الإمداد · المنصات اللوجستية.",
      "SWYV Logistics Services Co. Freight brokerage · Supply chain management · Logistics platforms.",
    ),
    servicesTitle: t("الخدمات", "Services"),
    services: [
      { route: "services", hash: "#night-cross-dock", label: t("العبور الليلي", "Night cross-dock") },
      { route: "services", hash: "#branch-delivery", label: t("التوزيع للفروع", "Branch delivery") },
      { route: "services", hash: "#returns-pickup", label: t("سحب المرتجعات", "Returns pickup") },
      { route: "services", hash: "#returns-inspection", label: t("فحص المرتجعات", "Returns inspection") },
      { route: "services", hash: "", label: t("جميع الخدمات", "All services") },
    ] satisfies { route: RouteKey; hash: string; label: unknown }[],
    companyTitle: t("الشركة", "Company"),
    company: [
      { route: "about", label: t("من نحن", "About") },
      { route: "carriers", label: t("انضم كناقل", "Become a carrier") },
      { route: "careers", label: t("الوظائف", "Careers") },
      { route: "faq", label: t("الأسئلة الشائعة", "FAQ") },
      { route: "contact", label: t("تواصل معنا", "Contact") },
    ] satisfies { route: RouteKey; label: unknown }[],
    copyright: t(
      "© 2026 شركة سوايف للخدمات اللوجستية. جميع الحقوق محفوظة.",
      "© 2026 SWYV Logistics Services Co. All rights reserved.",
    ),
    privacy: t("سياسة الخصوصية", "Privacy"),
    terms: t("الشروط والأحكام", "Terms"),
  },
  cookies: {
    text: t(
      "نستخدم ملفات ارتباط ضرورية لتشغيل الموقع، وملفات تحليلية فقط إذا وافقت عليها.",
      "We use essential cookies to run the site, and analytics cookies only if you allow them.",
    ),
    accept: t("موافقة", "Accept"),
    decline: t("الضرورية فقط", "Essential only"),
    more: t("سياسة الخصوصية", "Privacy policy"),
  },
  principle: t(
    "لا نبيع المنتجات ولا نشتريها. ننقل ونفحص ونوثّق، ونسلّم بضاعتك حيث تحدد أنت.",
    "We don't buy or sell products. We move, inspect and document, and deliver your goods wherever you decide.",
  ),
  pilotCta: {
    title: t("جرّبنا 30 يوماً على مسار واحد", "Try us for 30 days on one route"),
    description: t(
      "نقيس تكلفتك الحالية، ونشغّل، ثم نعرض لك الفرق بالأرقام.",
      "We measure your current cost, run the route, then show you the difference in numbers.",
    ),
    button: t("اطلب تجربة 30 يوماً", "Request a 30-day pilot"),
  },
};
