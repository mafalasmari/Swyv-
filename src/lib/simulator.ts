import { t, type Tx } from "@/i18n/localize";
import { decide, type Objectives } from "./disposition";
import { CONDITION_CODES, ROUTES, type Category, type ConditionCode, type Route } from "./returns";

export type Sector = "fmcg" | "ecommerce" | "retail";

export const SECTORS: Record<Sector, { label: Tx; category: Category; mix: Record<ConditionCode, number> }> = {
  fmcg: {
    label: t("مواد استهلاكية", "FMCG"),
    category: "fmcg",
    mix: { ok: 0.3, near: 0.3, expired: 0.12, damaged: 0.1, repack: 0.08, dead: 0.1 },
  },
  ecommerce: {
    label: t("تجارة إلكترونية", "E-commerce"),
    category: "apparel",
    mix: { ok: 0.55, near: 0, expired: 0, damaged: 0.1, repack: 0.25, dead: 0.1 },
  },
  retail: {
    label: t("سلاسل تجزئة", "Retail chains"),
    category: "electronics",
    mix: { ok: 0.4, near: 0, expired: 0, damaged: 0.15, repack: 0.2, dead: 0.25 },
  },
};

/** Preset priority profiles for the decision model. */
export const STRATEGIES: Record<string, { label: Tx; objectives: Objectives }> = {
  balanced: { label: t("متوازن", "Balanced"), objectives: { value: 40, speed: 30, green: 30 } },
  value: { label: t("أعلى قيمة", "Max value"), objectives: { value: 80, speed: 10, green: 10 } },
  speed: { label: t("أسرع إغلاق", "Fastest"), objectives: { value: 20, speed: 70, green: 10 } },
  green: { label: t("أقل انبعاثات", "Greenest"), objectives: { value: 20, speed: 10, green: 70 } },
};

export type SimulationInput = {
  sector: Sector;
  monthlyUnits: number;
  avgUnitValue: number;
  branches: number;
  /** Returns ride back on the delivery van instead of separate pickup trips. */
  backhaul: boolean;
  supplierAcceptsReturns: boolean;
  objectives: Objectives;
};

export type SimulationResult = {
  allocation: Record<Route, number>;
  recovered: number;
  baselineRecovered: number;
  cycleDays: number;
  baselineCycleDays: number;
  co2Avoided: number;
  tripsSaved: number;
  /** Cumulative net recovered value by month, 12 points each. */
  series: { month: number; baseline: number; swyv: number }[];
};

/** Representative item per condition code, so each slice can be routed once. */
const SAMPLE_DAYS: Record<ConditionCode, number> = { ok: 120, near: 10, expired: -1, damaged: 90, repack: 90, dead: 60 };

/** Today, unsorted returns sit in branches; this is the share of value that still comes back. */
const BASELINE_RECOVERY: Record<ConditionCode, number> = { ok: 0.7, near: 0.15, expired: 0, damaged: 0.1, repack: 0.2, dead: 0.2 };
const BASELINE_CYCLE_DAYS = 30;
/** One separate weekly pickup per branch when returns don't ride the delivery van. */
const PICKUPS_PER_BRANCH_MONTH = 4.3;
/** kg CO2e for a ~40 km urban van round trip. */
const CO2_PER_TRIP = 11;

export function simulate(input: SimulationInput): SimulationResult {
  const sector = SECTORS[input.sector];
  const allocation = Object.fromEntries(ROUTES.map((r) => [r, 0])) as Record<Route, number>;
  let recovered = 0;
  let baselineRecovered = 0;
  let weightedDays = 0;
  let co2 = 0;

  for (const code of CONDITION_CODES) {
    const units = input.monthlyUnits * sector.mix[code];
    if (units <= 0) continue;
    const decision = decide(
      {
        category: sector.category,
        code,
        unitValue: input.avgUnitValue,
        qty: units,
        daysToExpiry: SAMPLE_DAYS[code],
        packagingIntact: code !== "repack",
      },
      { minShelfDays: 30, supplierAcceptsReturns: input.supplierAcceptsReturns },
      input.objectives,
    );
    const chosen = decision.options.find((o) => o.route === decision.recommended)!;
    allocation[chosen.route] += units;
    recovered += chosen.netValue;
    weightedDays += chosen.cycleDays * units;
    co2 += chosen.co2Avoided;
    baselineRecovered += units * input.avgUnitValue * BASELINE_RECOVERY[code];
  }

  const tripsSaved = input.backhaul ? Math.round(input.branches * PICKUPS_PER_BRANCH_MONTH) : 0;
  co2 += tripsSaved * CO2_PER_TRIP;

  // Faster cycles release cash sooner: value arrives after the cycle, not instantly.
  const lag = (days: number) => Math.min(1, 30 / Math.max(days, 1));
  const cycleDays = input.monthlyUnits ? weightedDays / input.monthlyUnits : 0;
  const series = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const ramp = (m: number, days: number) => (m - 1 + lag(days)) / m;
    return {
      month,
      baseline: baselineRecovered * month * ramp(month, BASELINE_CYCLE_DAYS),
      swyv: recovered * month * ramp(month, cycleDays),
    };
  });

  return {
    allocation,
    recovered,
    baselineRecovered,
    cycleDays,
    baselineCycleDays: BASELINE_CYCLE_DAYS,
    co2Avoided: co2,
    tripsSaved,
    series,
  };
}
