import { t, type Tx } from "@/i18n/localize";
import type { Tone } from "@/components/ui/StatusTag";

/** The six condition codes from the SWYV Returns Audit Form. */
export type ConditionCode = "ok" | "near" | "expired" | "damaged" | "repack" | "dead";

export const CONDITION_CODES: ConditionCode[] = ["ok", "near", "expired", "damaged", "repack", "dead"];

export const CONDITIONS: Record<ConditionCode, { letter: string; label: Tx; tone: Tone }> = {
  ok: { letter: "ص", label: t("صالح", "Sellable"), tone: "ok" },
  near: { letter: "ق", label: t("قريب الانتهاء", "Near expiry"), tone: "warn" },
  expired: { letter: "م", label: t("منتهي", "Expired"), tone: "bad" },
  damaged: { letter: "ت", label: t("تالف", "Damaged"), tone: "bad" },
  repack: { letter: "د", label: t("يحتاج تدوير", "Needs repack"), tone: "info" },
  dead: { letter: "ر", label: t("راكد", "Dead stock"), tone: "idle" },
};

/** Where a return can be sent after inspection. */
export type Route = "restock" | "refurbish" | "liquidate" | "recycle" | "supplier";

export const ROUTES: Route[] = ["restock", "refurbish", "liquidate", "recycle", "supplier"];

export const ROUTE_META: Record<Route, { label: Tx; detail: Tx; color: string; swatch: string }> = {
  restock: {
    label: t("إعادة تخزين", "Restock"),
    detail: t("للمخزون أو لفرع يبيعه", "Back to stock or a branch that sells it"),
    color: "var(--color-route-restock)",
    swatch: "bg-route-restock",
  },
  refurbish: {
    label: t("تجديد", "Refurbish"),
    detail: t("إعادة تغليف أو إصلاح ثم للمخزون", "Repack or repair, then back to stock"),
    color: "var(--color-route-refurbish)",
    swatch: "bg-route-refurbish",
  },
  liquidate: {
    label: t("تصفية", "Liquidate"),
    detail: t("قناة تصفية يحددها العميل", "A clearance channel the client chooses"),
    color: "var(--color-route-liquidate)",
    swatch: "bg-route-liquidate",
  },
  recycle: {
    label: t("إعادة تدوير", "Recycle"),
    detail: t("تدوير أو إتلاف موثق", "Recycling or certified disposal"),
    color: "var(--color-route-recycle)",
    swatch: "bg-route-recycle",
  },
  supplier: {
    label: t("إرجاع للمورد", "Return to supplier"),
    detail: t("مطالبة أو إشعار دائن", "Claim or credit note"),
    color: "var(--color-route-supplier)",
    swatch: "bg-route-supplier",
  },
};

export type Category = "fmcg" | "beverage" | "personal_care" | "electronics" | "apparel" | "spare_parts";

export const CATEGORIES: Record<
  Category,
  { label: Tx; perishable: boolean; repairable: boolean; co2PerUnit: number }
> = {
  // co2PerUnit: rough embodied kg CO2e of one unit, used only for relative comparison.
  fmcg: { label: t("مواد استهلاكية", "FMCG"), perishable: true, repairable: false, co2PerUnit: 0.9 },
  beverage: { label: t("مياه ومشروبات", "Water & beverages"), perishable: true, repairable: false, co2PerUnit: 0.6 },
  personal_care: { label: t("عناية شخصية", "Personal care"), perishable: true, repairable: false, co2PerUnit: 1.2 },
  electronics: { label: t("إلكترونيات", "Electronics"), perishable: false, repairable: true, co2PerUnit: 30 },
  apparel: { label: t("أزياء", "Apparel"), perishable: false, repairable: true, co2PerUnit: 8 },
  spare_parts: { label: t("قطع غيار", "Spare parts"), perishable: false, repairable: true, co2PerUnit: 6 },
};
