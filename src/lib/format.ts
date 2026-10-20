/** Latin digits everywhere, matching the brand sheet's numerals. */
export const fmt = (n: number, digits = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const sar = (n: number) => `SAR ${fmt(Math.round(n))}`;

export const pct = (x: number, digits = 0) => `${(x * 100).toFixed(digits)}%`;

/** Minutes → "3h 05m" / "45m". */
export const duration = (minutes: number) => {
  const m = Math.max(0, Math.round(minutes));
  const h = Math.floor(m / 60);
  return h ? `${h}h ${String(m % 60).padStart(2, "0")}m` : `${m}m`;
};

/** Compact SAR: 12,400 → "12.4K". */
export const compact = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
