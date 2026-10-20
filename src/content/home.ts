import { t } from "@/i18n/localize";

export const home = {
  seo: {
    title: t(
      "سوايف | عبور ليلي وتوزيع للفروع وسحب المرتجعات في الرياض",
      "SWYV | Night cross-dock, branch delivery and returns pickup in Riyadh",
    ),
    description: t(
      "رحلة واحدة تصل بضاعتك إلى فروعك في الرياض وتعيد مرتجعاتك موثّقة ومفروزة، دون مخالفة أوقات منع الشاحنات.",
      "One trip delivers to your Riyadh branches and brings your returns back documented and sorted, without breaking truck-ban hours.",
    ),
  },
  hero: {
    eyebrow: t("العبور · التوزيع · المرتجعات", "Cross-dock · Delivery · Returns"),
    title: t("رحلة واحدة. توصيل لفروعك، ومرتجعاتك تعود إليك.", "One trip. Delivered to your branches, returns back to you."),
    description: t(
      "شاحناتك تفرّغ ليلاً على طرف الرياض، وفاناتنا تسلّم فروعك نهاراً وتعود بمرتجعاتك مفحوصة وموقّعة.",
      "Your trucks unload at night on the edge of Riyadh. Our vans deliver to your branches by day and return with your returns inspected and signed.",
    ),
    primary: t("اطلب تجربة 30 يوماً", "Request a 30-day pilot"),
    secondary: t("احسب توفيرك", "Calculate your savings"),
  },
  /** Illustrative live board shown in the hero (sample identifiers, not real operations). */
  board: {
    title: t("نقطة العبور · اليوم", "Cross-dock · Today"),
    sample: t("بيانات توضيحية", "Sample data"),
    inbound: t("وارد", "Inbound"),
    returns: t("مرتجع", "Return"),
    rows: [
      { id: "TR-1042", route: t("الدمام ← نقطة العبور", "Dammam → Cross-dock"), meta: t("24 طبلية", "24 pallets"), status: t("فحص", "Checking"), tone: "warn", dir: "down" },
      { id: "TR-1043", route: t("جدة ← نقطة العبور", "Jeddah → Cross-dock"), meta: t("18 طبلية", "18 pallets"), status: t("في الطريق", "En route"), tone: "info", dir: "down" },
      { id: "VN-2210", route: t("نقطة العبور ← فروع الملقا", "Cross-dock → Al Malqa branches"), meta: t("6 نقاط · مرتجعات", "6 stops · returns"), status: t("تحميل", "Loading"), tone: "bad", dir: "down" },
      { id: "VN-2211", route: t("فروع العليا ← نقطة العبور", "Al Olaya branches → Cross-dock"), meta: t("9 نقاط · صناديق", "9 stops · crates"), status: t("مكتمل", "Done"), tone: "ok", dir: "up" },
    ],
  },
  problem: {
    eyebrow: t("المشكلة", "The problem"),
    title: t("ثلاث تكاليف تدفعها كل يوم دون أن تراها", "Three costs you pay every day without seeing them"),
    cards: [
      {
        title: t("ساعات المنع", "Ban hours"),
        body: t(
          "الشاحنات الثقيلة ممنوعة داخل الرياض في ساعات النهار، فتنتظر أو تخالف.",
          "Heavy trucks are banned inside Riyadh during the day, so they wait or break the rule.",
        ),
      },
      {
        title: t("رحلة العودة الفارغة", "The empty return trip"),
        body: t(
          "فاناتك تعود فارغة، ثم ترسل رحلة أخرى لسحب المرتجعات.",
          "Your vans return empty, then you send another trip to collect returns.",
        ),
      },
      {
        title: t("مرتجعات عالقة", "Stuck returns"),
        body: t(
          "المرتجعات تبقى في الفروع حتى تنتهي صلاحيتها، ولا أحد يوثّق سببها.",
          "Returns sit in branches until they expire, and no one records why.",
        ),
      },
    ],
    timeline: {
      label: t("دخول الشاحنات الثقيلة للرياض", "Heavy-truck entry, Riyadh"),
      banned: t("ساعات النهار: ممنوع", "Daytime: banned"),
      allowed: t("الليل: مسموح", "Night: allowed"),
      note: t(
        "توضيح عام. نتحقق من الجدول الرسمي المعتمد قبل التشغيل.",
        "General illustration. We verify the current official schedule before operating.",
      ),
    },
  },
  loop: {
    eyebrow: t("كيف نعمل", "How it works"),
    title: t("الحلقة المغلقة في أربع خطوات", "The closed loop in four steps"),
    steps: [
      { title: t("عبور ليلي", "Night cross-dock"), body: t("نستقبل شاحناتك ليلاً ونطابق الحمولة.", "We receive your trucks at night and match the load."), dir: "down" },
      { title: t("توزيع نهاري", "Day delivery"), body: t("نسلّم فروعك داخل نافذة الاستلام.", "We deliver within each branch's receiving window."), dir: "down" },
      { title: t("سحب المرتجعات", "Returns pickup"), body: t("الفان نفسه يعود بالمرتجعات والعبوات.", "The same van brings back returns and crates."), dir: "up" },
      { title: t("فحص وفرز", "Inspect & sort"), body: t("نموذج موقّع لكل صنف، ثم نسلّم حسب تعليماتك.", "A signed form for every item, then delivered as you instruct."), dir: "up" },
    ],
    link: t("تفاصيل كيف نعمل", "How it works"),
  },
  services: {
    eyebrow: t("الخدمات", "Services"),
    title: t("ما نقدمه اليوم", "What we offer today"),
    link: t("كل الخدمات", "All services"),
  },
  sectors: {
    eyebrow: t("القطاعات", "Industries"),
    title: t("لمن يملك فروعاً ويستقبل مرتجعات", "For businesses with branches and returns"),
  },
  portal: {
    eyebrow: t("البوابة", "The portal"),
    title: t("كل رحلة وكل مرتجع أمامك", "Every trip and every return in front of you"),
    description: t(
      "تتبع شحناتك، واطّلع على نماذج الفحص الموقعة بالصور، وحمّل تقاريرك وفواتيرك من مكان واحد.",
      "Track shipments, view photo-signed audit forms, and download your reports and invoices in one place.",
    ),
    button: t("تعرّف على البوابة", "Explore the portal"),
  },
  calculator: {
    eyebrow: t("حاسبة التوفير", "Savings calculator"),
    title: t("كم توفّر رحلة العودة؟", "How much does the return trip save?"),
  },
  principle: {
    eyebrow: t("مبدأنا", "Our principle"),
  },
};
