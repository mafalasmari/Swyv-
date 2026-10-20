export type YardInputs = {
  gates: number;
  shiftsPerDay: number;
  daysPerWeek: number;
  spottersPerShift: number;
  checkInsPerDay: number;
  hourlyWage: number;
  /** 1 (low) – 10 (high) */
  demurrageLevel: number;
};

export type YardSavings = {
  labor: number;
  spotters: number;
  demurrage: number;
  total: number;
  percent: number;
};

export const defaultYardInputs: YardInputs = {
  gates: 2,
  shiftsPerDay: 3,
  daysPerWeek: 6,
  spottersPerShift: 3,
  checkInsPerDay: 45,
  hourlyWage: 28,
  demurrageLevel: 4,
};

const HOURS_PER_SHIFT = 8;
const WEEKS_PER_YEAR = 52;

/**
 * Illustrative savings model. The original site computes this in a closed
 * script, so these coefficients are tuned to reproduce its published default
 * result (~$641k / 23%) rather than taken from Terminal's real model.
 */
const COEFFICIENTS = {
  gateLaborPerGate: 0.5, // FTE share removed per gate per staffed hour
  checkInLaborDivisor: 200, // extra FTE share per check-in
  spotterWageShare: 0.3,
  spotterLeasePerHour: 0.2,
  demurragePerCheckIn: 3.434, // $ per check-in per demurrage level
  baselineDemurragePerCheckIn: 22,
};

export function estimateYardSavings(input: YardInputs): YardSavings {
  const staffedHours = input.shiftsPerDay * HOURS_PER_SHIFT * input.daysPerWeek * WEEKS_PER_YEAR;
  const checkInsPerYear = input.checkInsPerDay * input.daysPerWeek * WEEKS_PER_YEAR;
  const c = COEFFICIENTS;

  const labor =
    staffedHours *
    input.hourlyWage *
    (input.gates * c.gateLaborPerGate + input.checkInsPerDay / c.checkInLaborDivisor);

  const spotters =
    input.spottersPerShift *
    staffedHours *
    (input.hourlyWage * c.spotterWageShare + c.spotterLeasePerHour);

  const demurrage = checkInsPerYear * input.demurrageLevel * c.demurragePerCheckIn;

  const total = labor + spotters + demurrage;

  const baseline =
    staffedHours *
      input.hourlyWage *
      (input.gates * 2 + input.spottersPerShift + input.checkInsPerDay / 100) +
    checkInsPerYear * input.demurrageLevel * c.baselineDemurragePerCheckIn;

  return {
    labor,
    spotters,
    demurrage,
    total,
    percent: baseline > 0 ? Math.round((total / baseline) * 100) : 0,
  };
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(value));
