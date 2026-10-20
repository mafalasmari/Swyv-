import { t, type Tx } from "@/i18n/localize";
import { CATEGORIES, ROUTES, type Category, type ConditionCode, type Route } from "./returns";

export type ReturnItem = {
  category: Category;
  code: ConditionCode;
  unitValue: number;
  qty: number;
  /** Days of shelf life left; null when the product has no expiry date. */
  daysToExpiry: number | null;
  packagingIntact: boolean;
};

export type ClientRules = {
  /** Minimum days of shelf life for an item to go back on the shelf. */
  minShelfDays: number;
  supplierAcceptsReturns: boolean;
};

/** Relative importance of each goal. Values are normalized, so any scale works. */
export type Objectives = { value: number; speed: number; green: number };

export type RouteOption = {
  route: Route;
  feasible: boolean;
  blockers: Tx[];
  recoveryRate: number;
  cycleDays: number;
  netValue: number;
  co2Avoided: number;
  score: number;
};

export type Decision = {
  recommended: Route;
  options: RouteOption[];
  reasons: Tx[];
};

/** Longest cycle (supplier credit notes) — used to scale the speed score. */
const MAX_CYCLE_DAYS = 21;

/** Share of a unit's embodied carbon that each route keeps in use. */
const REUSE: Record<Route, number> = {
  restock: 1,
  refurbish: 0.85,
  liquidate: 0.7,
  supplier: 0.5,
  recycle: 0.15,
};

const CYCLE_DAYS: Record<Route, number> = {
  restock: 1,
  refurbish: 3,
  liquidate: 7,
  supplier: MAX_CYCLE_DAYS,
  recycle: 2,
};

const reason = {
  notSellable: t("الحالة لا تسمح بالبيع كما هو", "Condition does not allow selling as-is"),
  shortShelf: t("الصلاحية المتبقية أقل من حدّك للإعادة للرف", "Shelf life left is below your restock rule"),
  packaging: t("الغلاف متضرر", "Packaging is damaged"),
  expired: t("المنتج منتهي الصلاحية", "Product is expired"),
  notRepairable: t("لا يمكن تجديد هذا النوع إذا تلف", "This category can't be repaired once damaged"),
  noRepackNeeded: t("لا يحتاج تجديداً", "Does not need refurbishing"),
  supplierClosed: t("اتفاقية المورد لا تقبل المرتجعات", "Supplier agreement does not accept returns"),
  supplierCode: t("المورد لا يقبل هذه الحالة", "Supplier does not take this condition"),
};

/**
 * Evaluates every route for one returned line and recommends the best feasible one.
 * The model is rule-based and transparent on purpose: each blocker and score can be
 * explained to the client, who always makes the final call.
 */
export function decide(item: ReturnItem, rules: ClientRules, objectives: Objectives): Decision {
  const category = CATEGORIES[item.category];
  const expired =
    item.code === "expired" || (category.perishable && item.daysToExpiry !== null && item.daysToExpiry <= 0);
  const shelfOk = !category.perishable || item.daysToExpiry === null || item.daysToExpiry >= rules.minShelfDays;
  const days = item.daysToExpiry ?? Infinity;

  const evaluate = (route: Route): Omit<RouteOption, "netValue" | "co2Avoided" | "score" | "cycleDays"> => {
    const blockers: Tx[] = [];
    let rate = 0;

    switch (route) {
      case "restock": {
        if (!["ok", "dead"].includes(item.code)) blockers.push(reason.notSellable);
        if (expired) blockers.push(reason.expired);
        else if (!shelfOk) blockers.push(reason.shortShelf);
        if (!item.packagingIntact) blockers.push(reason.packaging);
        rate = item.code === "dead" ? 0.9 : 1; // dead stock moves to a branch that sells it
        break;
      }
      case "refurbish": {
        if (expired) blockers.push(reason.expired);
        else if (!shelfOk) blockers.push(reason.shortShelf);
        if (item.code === "damaged" && !category.repairable) blockers.push(reason.notRepairable);
        if (["ok", "dead"].includes(item.code) && item.packagingIntact) blockers.push(reason.noRepackNeeded);
        if (item.code === "near") blockers.push(reason.noRepackNeeded);
        rate = item.code === "damaged" ? 0.6 : item.code === "repack" ? 0.88 : 0.9;
        break;
      }
      case "liquidate": {
        if (expired) blockers.push(reason.expired);
        if (item.code === "damaged" && !category.repairable) blockers.push(reason.notSellable);
        if (item.code === "near") rate = days >= 14 ? 0.55 : days >= 7 ? 0.4 : 0.25;
        else if (item.code === "damaged") rate = 0.3;
        else if (item.code === "repack") rate = 0.45;
        else if (item.code === "dead") rate = 0.5;
        else rate = 0.6;
        break;
      }
      case "supplier": {
        if (!rules.supplierAcceptsReturns) blockers.push(reason.supplierClosed);
        if (["ok", "repack"].includes(item.code)) blockers.push(reason.supplierCode);
        rate = { near: 0.9, expired: 0.8, damaged: 0.75, dead: 0.7, ok: 0, repack: 0 }[item.code];
        break;
      }
      case "recycle": {
        rate = category.perishable ? 0 : 0.03; // material value only
        break;
      }
    }
    return { route, feasible: blockers.length === 0, blockers, recoveryRate: rate };
  };

  const weightSum = objectives.value + objectives.speed + objectives.green || 1;
  const w = {
    value: objectives.value / weightSum,
    speed: objectives.speed / weightSum,
    green: objectives.green / weightSum,
  };

  const options: RouteOption[] = ROUTES.map((route) => {
    const base = evaluate(route);
    const handling = handlingCost(route, item.unitValue);
    const netPerUnit = item.unitValue * base.recoveryRate - handling;
    const cycleDays = CYCLE_DAYS[route];
    const valueScore = item.unitValue > 0 ? Math.max(0, netPerUnit) / item.unitValue : 0;
    const speedScore = 1 - (cycleDays - 1) / (MAX_CYCLE_DAYS - 1);
    const score = w.value * valueScore + w.speed * speedScore + w.green * REUSE[route];
    return {
      ...base,
      cycleDays,
      netValue: netPerUnit * item.qty,
      co2Avoided: category.co2PerUnit * REUSE[route] * item.qty,
      score: base.feasible ? score : 0,
    };
  });

  const ranked = [...options].sort((a, b) => Number(b.feasible) - Number(a.feasible) || b.score - a.score);
  const best = ranked[0];

  return { recommended: best.route, options: ranked, reasons: explain(best, item, expired, shelfOk, w) };
}

function handlingCost(route: Route, unitValue: number) {
  switch (route) {
    case "restock":
      return 0.02 * unitValue + 0.5;
    case "refurbish":
      return 0.08 * unitValue + 2;
    case "liquidate":
      return 0.04 * unitValue + 1;
    case "supplier":
      return 0.05 * unitValue + 1.5;
    case "recycle":
      return 0.6;
  }
}

function explain(
  best: RouteOption,
  item: ReturnItem,
  expired: boolean,
  shelfOk: boolean,
  w: Objectives,
): Tx[] {
  const out: Tx[] = [];
  const pct = Math.round(best.recoveryRate * 100);
  if (expired) out.push(t("المنتج منتهي فلا يعود للبيع", "Expired, so it cannot be sold again"));
  else if (!shelfOk) out.push(t("الصلاحية المتبقية لا تكفي لإعادته للرف", "Not enough shelf life left to restock"));
  if (!item.packagingIntact) out.push(t("الغلاف متضرر ويحتاج معالجة", "Packaging is damaged and needs work"));
  out.push(t(`يسترد نحو ${pct}% من قيمة الصنف`, `Recovers about ${pct}% of item value`));
  out.push(t(`دورة الإغلاق نحو ${best.cycleDays} يوم`, `Closes in about ${best.cycleDays} day(s)`));
  const top = (Object.entries(w) as [keyof Objectives, number][]).sort((a, b) => b[1] - a[1])[0][0];
  out.push(
    {
      value: t("الأولوية الحالية: أعلى قيمة مستردة", "Current priority: highest recovered value"),
      speed: t("الأولوية الحالية: أسرع إغلاق", "Current priority: fastest close"),
      green: t("الأولوية الحالية: أقل أثر بيئي", "Current priority: lowest environmental impact"),
    }[top],
  );
  return out;
}
