import { t } from "@/i18n/localize";

export const howItWorks = {
  seo: {
    title: t("كيف تعمل سوايف | من الشاحنة ليلاً إلى الفرع نهاراً والعودة بالمرتجعات", "How SWYV works | Truck at night, branch by day, returns on the way back"),
    description: t("رحلة واحدة تقوم بعملين: التوصيل والإرجاع.", "One trip does two jobs: delivery and returns."),
  },
  intro: {
    eyebrow: t("كيف نعمل", "How it works"),
    title: t("رحلة واحدة تقوم بعملين: التوصيل والإرجاع.", "One trip does two jobs: delivery and returns."),
  },
  steps: [
    {
      title: t("الحجز", "Booking"),
      body: t(
        "تحجز الشحنة من البوابة: نوعها، والفرع، والتاريخ، وعدد الطبليات، وهل تريد سحب مرتجعات.",
        "You book in the portal: shipment type, branch, date, number of pallets, and whether to collect returns.",
      ),
      dir: "down",
    },
    {
      title: t("العبور الليلي", "Night cross-dock"),
      body: t(
        "تصل شاحنتك إلى نقطة العبور على طرف الرياض، فنعدّ كل طبلية ونطابقها مع قائمة التعبئة ونصوّر أي ملاحظة.",
        "Your truck arrives at our cross-dock on the edge of Riyadh. We count each pallet against the packing list and photograph any issue.",
      ),
      dir: "down",
    },
    {
      title: t("التوزيع النهاري", "Day delivery"),
      body: t(
        "نحمّل الفانات حسب ترتيب التسليم، ونسلّم كل فرع داخل نافذة استلامه، مع اسم المستلم وتوقيعه وصورة.",
        "We load vans in delivery order and deliver each branch within its window, with receiver name, signature and photo.",
      ),
      dir: "down",
    },
    {
      title: t("فحص المرتجعات في الفرع", "Returns inspection at the branch"),
      body: t(
        "قبل التحميل، يسجّل المشرف كل صنف: رمزه، والكمية، والحالة، والسبب، وتاريخ الانتهاء، وصورة. ثم يوقّع مسؤول الفرع فيُقفل النموذج وتصلك نسخة.",
        "Before loading, the inspector records each item: SKU, quantity, condition, reason, expiry and photo. The branch officer signs, the form locks, and you receive a copy.",
      ),
      dir: "up",
      codes: true,
    },
    {
      title: t("الفرز والتسليم", "Sorting & handover"),
      body: t(
        "نفرز المرتجعات حسب الرمز، ونسلّمها حسب تعليماتك: لمستودعك، أو لمورّدك، أو للإتلاف الموثق.",
        "We sort returns by code and hand them over as you instruct: to your warehouse, to your supplier, or to certified disposal.",
      ),
      dir: "up",
    },
    {
      title: t("الفاتورة والتقرير", "Invoice & report"),
      body: t(
        "فاتورة شهرية واحدة بكل الرحلات والسحب والفرز، مع كشف تفصيلي وتقرير.",
        "One monthly invoice covering all trips, pickups and sorting, with a detailed statement and report.",
      ),
      dir: "up",
    },
  ],
  codesTitle: t("رموز الحالة", "Condition codes"),
  codeHeaders: { condition: t("الحالة", "Condition") },
  engine: {
    eyebrow: t("محرك التوجيه", "Disposition engine"),
    title: t("أين يذهب كل مرتجع؟", "Where should each return go?"),
    description: t(
      "بعد الفحص، يقترح المحرك وجهة كل صنف حسب حالته وصلاحيته وقيمته وقواعدك. القرار النهائي لك دائماً.",
      "After inspection, the engine proposes a destination for each item from its condition, shelf life, value and your rules. The final decision is always yours.",
    ),
  },
  assetLight: {
    eyebrow: t("نموذج التشغيل", "Operating model"),
    title: t("لماذا نحن خفيفو الأصول", "Why asset-light"),
    body: t(
      "لا نملك شاحنات. نتعاقد مع ناقلين مرخّصين ونديرهم بمعاييرنا، ومشرفنا حاضر في كل تسليم. هذا يمنحك مرونة السعة دون أن تدفع ثمن أسطول.",
      "We don't own trucks. We contract licensed carriers and manage them to our standards, with our inspector at every delivery. You get flexible capacity without paying for a fleet.",
    ),
  },
};
