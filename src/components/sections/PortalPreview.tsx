import { StatusTag } from "@/components/ui/StatusTag";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";

const STEPS = {
  ar: ["مطلوبة", "مجدولة", "في نقطة العبور", "في الطريق", "مسلّمة"],
  en: ["Requested", "Scheduled", "At hub", "Out", "Delivered"],
};
const LABELS = {
  ar: { onTime: "التسليم في النافذة", forms: "نماذج موقّعة", recovered: "قيمة مستردة", waybill: "وثيقة الشحن", sample: "عرض توضيحي" },
  en: { onTime: "On-window delivery", forms: "Signed forms", recovered: "Value recovered", waybill: "Waybill", sample: "Preview" },
};

/** Static, illustrative portal frame for marketing pages. */
export function PortalPreview({ locale }: { locale: Locale }) {
  const l = LABELS[locale];
  const steps = STEPS[locale];
  const current = 3;
  return (
    <div className="border border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2 bg-line" />
          <span className="size-2 bg-line" />
          <span className="size-2 bg-red" />
        </span>
        <StatusTag tone="idle">{l.sample}</StatusTag>
      </div>
      <div className="grid grid-cols-3 gap-px border-b border-line bg-line">
        {[
          { label: l.onTime, value: "96.8%" },
          { label: l.forms, value: "142" },
          { label: l.recovered, value: "SAR 38,450" },
        ].map((k) => (
          <div key={k.label} className="bg-panel p-4">
            <p className="font-mono text-[10px] tracking-wider text-steel uppercase">{k.label}</p>
            <p className="num mt-1 text-lg text-concrete sm:text-xl">{k.value}</p>
          </div>
        ))}
      </div>
      <div className="p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-[11px] tracking-wider text-steel uppercase">{l.waybill}</span>
          <span className="num text-sm text-concrete">SWV-26-000184</span>
        </div>
        <ol className="grid grid-cols-5 gap-1">
          {steps.map((step, i) => (
            <li key={step} className="flex flex-col gap-2">
              <span className={cn("h-1", i < current ? "bg-red" : i === current ? "animate-pulse-dot bg-red" : "bg-line")} />
              <span className={cn("text-[10px] leading-tight sm:text-xs", i <= current ? "text-concrete" : "text-steel")}>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
