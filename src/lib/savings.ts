export type SavingsInput = {
  branches: number;
  deliveriesPerWeek: number;
  returnPickupsPerMonth: number;
  costPerTrip: number;
};

/** Per-stop fee for collecting returns on the delivery trip (illustrative, from the company profile). */
export const RETURN_STOP_FEE = 40;
const WEEKS_PER_MONTH = 52 / 12;

/**
 * Each separate returns trip is replaced by a stop on a delivery run that already
 * visits the branch. Savings = trips removed × (their cost − the stop fee).
 */
export function estimateSavings(input: SavingsInput) {
  const deliveryVisits = input.branches * input.deliveriesPerWeek * WEEKS_PER_MONTH;
  const tripsSaved = Math.max(0, Math.min(input.returnPickupsPerMonth, Math.floor(deliveryVisits)));
  const monthly = Math.max(0, tripsSaved * (input.costPerTrip - RETURN_STOP_FEE));
  return { tripsSaved, monthly, annual: monthly * 12 };
}
