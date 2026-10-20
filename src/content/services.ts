import { t } from "@/i18n/localize";

export const services = {
  seo: {
    title: t("خدمات سوايف | العبور والتوزيع وسحب المرتجعات وفحصها", "SWYV Services | Cross-dock, delivery, returns pickup and inspection"),
    description: t(
      "رحلة واحدة تصل بضاعتك إلى فروعك وتعيد مرتجعاتك إليك موثّقة ومفروزة.",
      "One trip delivers to your branches and brings your returns back to you, documented and sorted.",
    ),
  },
  intro: {
    eyebrow: t("الخدمات", "Services"),
    title: t("خدماتنا", "Our services"),
    description: t(
      "رحلة واحدة تصل بضاعتك إلى فروعك وتعيد مرتجعاتك إليك موثّقة ومفروزة.",
      "One trip delivers to your branches and brings your returns back to you, documented and sorted.",
    ),
  },
  availableTitle: t("متاح الآن", "Available now"),
  available: [
    {
      id: "night-cross-dock",
      title: t("العبور الليلي على طرف المدينة", "Night cross-dock on the city edge"),
      body: t(
        "تفرّغ شاحناتك ليلاً في نقطة العبور خارج أوقات المنع، ونفحص الحمولة ونطابقها قبل التوزيع.",
        "Your trucks unload at night at our city-edge cross-dock, outside ban hours. We check and match every load before dispatch.",
      ),
    },
    {
      id: "branch-delivery",
      title: t("التوزيع النهاري للفروع", "Daytime branch delivery"),
      body: t(
        "فانات خفيفة تسلّم لفروعك داخل نافذة الاستلام، مع إثبات تسليم بالصورة والتوقيع.",
        "Light vans deliver within each branch's receiving window, with photo and signature proof of delivery.",
      ),
    },
    {
      id: "returns-pickup",
      title: t("سحب المرتجعات في رحلة العودة", "Returns pickup on the way back"),
      body: t(
        "الفان نفسه يعود بمرتجعاتك وبضاعتك الراكدة، فلا تحتاج رحلة منفصلة.",
        "The same van brings back your returns and dead stock, with no separate trip.",
      ),
    },
    {
      id: "returns-inspection",
      title: t("فحص المرتجعات الموقّع والفرز", "Signed returns inspection & sorting"),
      body: t(
        "يسجّل مشرفنا كل صنف قبل التحميل برمز الحالة والسبب والصورة، ويوقّع مسؤول الفرع. ثم نفرز البضاعة ونسلّمها حسب تعليماتك: لمستودعك، أو لمورّدك، أو للإتلاف.",
        "Before loading, our inspector records each item with a condition code, reason and photo, and the branch officer signs. We then sort and deliver as you instruct: to your warehouse, to your supplier, or to disposal.",
      ),
    },
    {
      id: "crate-recovery",
      title: t("استرجاع العبوات والصناديق والطبليات", "Crate, bottle & pallet recovery"),
      body: t(
        "نجمع صناديقك وعبواتك الفارغة وطبلياتك من الفروع ونعدّها ونسلّمها لمستودعك.",
        "We collect your empty crates, bottles and pallets, count them and return them to your warehouse.",
      ),
    },
    {
      id: "reports",
      title: t("تقارير SWYV", "SWYV Reports"),
      body: t(
        "تقرير أسبوعي للتسليم والاستثناءات، وتقرير شهري لأسباب الإرجاع وقيمتها لكل فرع.",
        "A weekly delivery and exceptions report, and a monthly report of return reasons and value by branch.",
      ),
    },
    {
      id: "claims",
      title: t("استرداد المطالبات والإشعارات الدائنة", "Claims & credit-note recovery"),
      body: t(
        "نتابع مطالباتك لدى الموردين بنماذج فحص موقّعة حتى تُصرف. لا تدفع إلا مما يُسترد.",
        "We follow up your supplier claims with signed audit forms until they are paid. You pay only from what is recovered.",
      ),
    },
  ],
  soonTitle: t("قريباً", "Coming soon"),
  soonTag: t("قريباً", "Soon"),
  soon: [
    { title: t("الإتلاف الموثق", "Certified disposal"), body: t("إتلاف التالف والمنتهي عبر جهات مرخصة، مع محضر رسمي.", "Damaged and expired goods disposed of through licensed partners, with an official record.") },
    { title: t("شهادة المرتجع الموثق", "Verified return certificate"), body: t("شهادة محايدة بالصور يعتمدها المتجر والمورد معاً لتسوية المرتجعات بسرعة.", "A neutral, photo-backed certificate both retailer and supplier accept to settle returns faster.") },
    { title: t("تجهيز الشحنات لمستودعات المنصات", "Marketplace inbound prep"), body: t("ملصقات وتغليف ومطابقة قبل موعد التسليم في مستودع المنصة الإلكترونية.", "Labelling, packing and matching before your marketplace warehouse appointment.") },
    { title: t("موازنة المخزون بين الفروع", "Inter-branch stock balancing"), body: t("ننقل الصنف الراكد من فرع لا يبيعه إلى فرع يبيعه، بدل إرجاعه.", "We move slow stock from a branch that can't sell it to one that can, instead of returning it.") },
    { title: t("التخزين المؤقت القصير", "Short-term holding"), body: t("تخزين من 24 إلى 72 ساعة للطلبيات العاجلة أو الحمولة التي تنتظر نافذة الاستلام.", "24–72 hour holding for urgent orders or loads waiting for a receiving window.") },
    { title: t("تصنيف المرتجعات وإعادة تغليفها", "Returns grading & repacking"), body: t("نصنّف كل مرتجع حسب حالته وفق دليلك، ونعيد تغليف ما تضرر غلافه ليعود لمخزونك.", "We grade each return against your guidelines and repack damaged packaging so it returns to your stock.") },
    { title: t("ملصقات الأسعار وإعادة الملصقات", "Price & barcode labelling"), body: t("تسعير وملصقات باركود قبل التسليم للفروع أو لمستودعات المنصات.", "Price and barcode labelling before delivery to branches or marketplace warehouses.") },
    { title: t("تقارير الاستدامة وخفض الهدر", "Sustainability & waste reports"), body: t("كم أنقذت من الإتلاف بالفرز والإعادة للمخزون، وكم أُتلف بشكل موثق.", "How much you saved from disposal through sorting and restocking, and how much was disposed of with records.") },
    { title: t("تأمين الشحنات", "Cargo insurance"), body: t("تأمين على البضائع لكل رحلة عبر شركات تأمين مرخصة.", "Per-trip cargo cover through licensed insurers.") },
  ],
  notOfferedTitle: t("ما لا نقدمه حالياً", "What we don't offer yet"),
  notOffered: [
    t("النقل المبرّد", "Refrigerated transport"),
    t("توصيل الطرود الفردية للمستهلك", "Single-parcel delivery to consumers"),
    t("النقل الدولي", "Cross-border freight"),
  ],
  cta: {
    title: t("لا تجد ما تحتاجه؟ تواصل معنا.", "Need something else? Talk to us."),
    button: t("تواصل معنا", "Contact us"),
  },
};
