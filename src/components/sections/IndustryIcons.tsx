import type { ReactNode } from "react";

/**
 * Sector icons in the Hub East truck's flat line-art style: asphalt bodies with a
 * thin steel outline, SWYV red for the one accent, a thin line for the shadow.
 * No gradients, filters or images; 6–10 shapes each on a 48 × 48 grid.
 */
const body = { fill: "var(--swyv-asphalt)", stroke: "var(--swyv-steel)", strokeWidth: 1 };
const line = { fill: "none", stroke: "var(--swyv-steel)", strokeWidth: 1 };
const shadow = <path d="M8 44H40" stroke="var(--swyv-steel)" strokeOpacity="0.35" strokeWidth="1" />;

const ICONS: Record<string, ReactNode> = {
  // FMCG: a crate of everyday goods
  FMCG: (
    <>
      <rect x="15" y="12" width="7" height="13" {...body} />
      <rect x="16.5" y="9" width="4" height="3" fill="var(--swyv-red)" />
      <rect x="24" y="16" width="7" height="9" fill="var(--swyv-steel)" fillOpacity="0.6" />
      <rect x="32" y="14" width="6" height="11" {...line} />
      <rect x="9" y="25" width="30" height="17" {...body} />
      <path d="M9 31H39M9 37H39" {...line} strokeOpacity="0.5" />
      {shadow}
    </>
  ),
  // E-commerce: a taped parcel with its label
  ECOM: (
    <>
      <path d="M10 18L16 11H38L32 18Z" {...line} />
      <rect x="10" y="18" width="22" height="24" {...body} />
      <path d="M32 18L38 11V35L32 42Z" {...body} />
      <rect x="18" y="18" width="6" height="24" fill="var(--swyv-red)" />
      <rect x="13" y="32" width="4" height="6" fill="var(--swyv-concrete)" />
      {shadow}
    </>
  ),
  // HORECA suppliers: a cup on its saucer in front of a delivery crate
  HRCA: (
    <>
      <rect x="22" y="14" width="18" height="28" {...body} strokeOpacity="0.5" />
      <path d="M10 24H26L24 38H12Z" fill="var(--swyv-red)" />
      <path d="M26 27H29Q31 27 31 30Q31 33 28 33H25" {...line} />
      <path d="M7 40H29" stroke="var(--swyv-steel)" strokeWidth="2" />
      <path d="M14 20Q12 17 14 14M20 20Q18 17 20 14" {...line} />
      {shadow}
    </>
  ),
  // Water & beverages: a five-gallon bottle and a small bottle
  BEV: (
    <>
      <rect x="18" y="7" width="6" height="3" fill="var(--swyv-red)" />
      <rect x="19" y="10" width="4" height="4" {...body} />
      <path d="M13 18Q13 14 18 14H24Q29 14 29 18V42H13Z" {...body} />
      <path d="M13 24H29M13 33H29" {...line} strokeOpacity="0.5" />
      <rect x="32" y="26" width="6" height="16" {...body} />
      <rect x="33.5" y="23" width="3" height="3" fill="var(--swyv-red)" />
      {shadow}
    </>
  ),
  // Retail chains: a storefront with its awning
  RTL: (
    <>
      <rect x="9" y="18" width="30" height="24" {...body} />
      <path d="M7 12H41L39 18H9Z" fill="var(--swyv-red)" />
      <path d="M15 12L14 18M24 12V18M33 12L34 18" stroke="var(--swyv-black)" strokeOpacity="0.4" strokeWidth="1" />
      <rect x="13" y="24" width="12" height="9" fill="var(--swyv-steel)" fillOpacity="0.6" />
      <rect x="28" y="24" width="7" height="18" {...line} />
      {shadow}
    </>
  ),
  // Pharmacies & personal care: a medicine box, a bottle and a capsule
  PHRM: (
    <>
      <rect x="8" y="16" width="20" height="26" {...body} />
      <path d="M16 23H20V27H24V31H20V35H16V31H12V27H16Z" fill="var(--swyv-red)" />
      <rect x="31" y="26" width="9" height="16" {...body} />
      <rect x="31" y="22" width="9" height="4" fill="var(--swyv-steel)" />
      <path d="M30 13H35V19H30Q27 19 27 16Q27 13 30 13Z" fill="var(--swyv-red)" />
      <path d="M35 13H40Q43 13 43 16Q43 19 40 19H35Z" fill="var(--swyv-concrete)" />
      {shadow}
    </>
  ),
  // Spare parts: a gear, a wrench and a bolt
  PRTS: (
    <>
      <path
        d="M33.8 19.2L36.6 19.9L36.6 26.1L33.8 26.8L33.6 27.2L35.1 29.7L30.7 34.1L28.2 32.6L27.8 32.8L27.1 35.6L20.9 35.6L20.2 32.8L19.8 32.6L17.3 34.1L12.9 29.7L14.4 27.2L14.2 26.8L11.4 26.1L11.4 19.9L14.2 19.2L14.4 18.8L12.9 16.3L17.3 11.9L19.8 13.4L20.2 13.2L20.9 10.4L27.1 10.4L27.8 13.2L28.2 13.4L30.7 11.9L35.1 16.3L33.6 18.8Z"
        {...body}
      />
      <circle cx="24" cy="23" r="5" fill="var(--swyv-red)" />
      <circle cx="24" cy="23" r="2" fill="var(--swyv-black)" />
      <path d="M33 34L40 41M37 31L43 37" stroke="var(--swyv-steel)" strokeWidth="2" />
      <path d="M8 38L10.5 36H13.5L16 38L13.5 40H10.5Z" fill="var(--swyv-steel)" />
      {shadow}
    </>
  ),
};

export function IndustryIcon({ code, className }: { code: string; className?: string }) {
  const icon = ICONS[code];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={className}>
      {icon}
    </svg>
  );
}
