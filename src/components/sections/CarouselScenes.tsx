import type { ReactNode } from "react";

/**
 * Line-art scenes for the expandable carousel, drawn like the Hub East truck:
 * asphalt bodies with thin steel outlines, SWYV red for the accent, a thin line
 * for the ground. No gradients, filters or images.
 */
export type SceneKey = "booking" | "crossdock" | "delivery" | "inspection" | "sorting" | "invoice";

const body = { fill: "var(--swyv-asphalt)", stroke: "var(--swyv-steel)", strokeWidth: 1 };
const line = { fill: "none", stroke: "var(--swyv-steel)", strokeWidth: 1 };
const ground = <path d="M0 170H320" stroke="var(--swyv-steel)" strokeOpacity="0.5" />;

const Wheel = ({ x, y }: { x: number; y: number }) => (
  <>
    <circle cx={x} cy={y} r="9" fill="var(--swyv-black)" stroke="var(--swyv-steel)" />
    <circle cx={x} cy={y} r="3.5" fill="var(--swyv-steel)" />
  </>
);

/** The Hub East truck (160 × 80), cab facing right. */
const Truck = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M6 8H104L108 12V58L104 62H6L2 58V12Z" {...body} strokeOpacity="0.5" />
    <path d="M8 22H102M8 36H102M8 50H102" {...line} strokeOpacity="0.35" />
    <path d="M114 66V28Q114 22 120 22H138L152 40Q156 42 156 46V66Z" fill="var(--swyv-red)" />
    <path d="M137 27H139L149 40H137Z" fill="var(--swyv-steel)" fillOpacity="0.6" />
    <rect x="120" y="28" width="12" height="12" fill="var(--swyv-steel)" fillOpacity="0.6" />
    <rect x="153" y="47" width="3" height="4" fill="var(--swyv-concrete)" />
    <Wheel x={22} y={69} />
    <Wheel x={42} y={69} />
    <Wheel x={122} y={69} />
    <Wheel x={146} y={69} />
  </g>
);

/** Delivery van (100 × 56), cab facing right. */
const Van = ({ x, y }: { x: number; y: number }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M0 46V8Q0 2 6 2H66L84 22Q90 24 90 30V46Z" fill="var(--swyv-red)" />
    <path d="M66 8H69L82 22H66Z" fill="var(--swyv-steel)" fillOpacity="0.6" />
    <path d="M40 8V44" stroke="var(--swyv-black)" strokeOpacity="0.4" />
    <rect x="86" y="32" width="3" height="4" fill="var(--swyv-concrete)" />
    <Wheel x={18} y={47} />
    <Wheel x={70} y={47} />
  </g>
);

const Pallet = ({ x, y, accent }: { x: number; y: number; accent?: boolean }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width="34" height="24" {...body} />
    {accent && <rect x="12" width="10" height="24" fill="var(--swyv-red)" />}
    <path d="M0 24H34V28H0Z" fill="var(--swyv-steel)" fillOpacity="0.6" />
  </g>
);

const SCENES: Record<SceneKey, ReactNode> = {
  // Booking in the portal: a screen of shipments with their status
  booking: (
    <>
      <rect x="70" y="24" width="180" height="120" {...body} />
      <rect x="70" y="24" width="180" height="16" fill="var(--swyv-red)" />
      {[56, 82, 108].map((y, i) => (
        <g key={y}>
          <path d={`M86 ${y}H190`} {...line} strokeOpacity="0.6" />
          <path d={`M86 ${y + 9}H160`} {...line} strokeOpacity="0.3" />
          <circle cx="226" cy={y + 4} r="4" fill={["var(--swyv-success)", "var(--swyv-pending)", "var(--swyv-red)"][i]} />
        </g>
      ))}
      <path d="M150 144V160M130 160H190" {...line} />
      {ground}
    </>
  ),
  // Night cross-dock: the truck passes the gate under the moon
  crossdock: (
    <>
      <path d="M268 34A16 16 0 1 0 284 56A12 12 0 1 1 268 34Z" fill="var(--swyv-steel)" fillOpacity="0.6" />
      <path d="M24 170V96M54 170V96" {...line} />
      <path d="M24 106L80 88" stroke="var(--swyv-red)" strokeWidth="3" />
      <Truck x={110} y={92} />
      {ground}
    </>
  ),
  // Day delivery: the van at the branch's door
  delivery: (
    <>
      <circle cx="56" cy="48" r="16" {...line} />
      <rect x="170" y="60" width="120" height="110" {...body} />
      <path d="M164 48H296L290 62H170Z" fill="var(--swyv-red)" />
      <rect x="186" y="80" width="44" height="34" fill="var(--swyv-steel)" fillOpacity="0.6" />
      <rect x="246" y="90" width="28" height="80" {...line} />
      <Van x={50} y={114} />
      {ground}
    </>
  ),
  // Returns inspection: cartons, one flagged, and the signed form
  inspection: (
    <>
      <Pallet x={40} y={118} />
      <Pallet x={78} y={118} accent />
      <Pallet x={59} y={90} />
      <rect x="170" y="40" width="96" height="124" fill="var(--swyv-concrete)" stroke="var(--swyv-steel)" />
      <rect x="198" y="34" width="40" height="12" fill="var(--swyv-asphalt)" />
      {[66, 88, 110].map((y) => (
        <g key={y}>
          <path d={`M184 ${y}L190 ${y + 6}L200 ${y - 4}`} fill="none" stroke="var(--swyv-red)" strokeWidth="2" />
          <path d={`M208 ${y + 2}H252`} stroke="var(--swyv-asphalt)" strokeOpacity="0.5" />
        </g>
      ))}
      <path d="M184 144Q200 132 214 144T246 140" fill="none" stroke="var(--swyv-asphalt)" />
      {ground}
    </>
  ),
  // Sorting & handover: racks, and three ways out
  sorting: (
    <>
      <path d="M30 170V40M150 170V40M30 80H150M30 124H150" {...line} />
      <Pallet x={44} y={52} />
      <Pallet x={96} y={52} accent />
      <Pallet x={44} y={96} accent />
      <Pallet x={96} y={140} />
      <path d="M172 106H214M214 106L270 56M214 106H290M214 106L270 156" fill="none" stroke="var(--swyv-steel)" />
      <path d="M262 52L274 52L270 64Z" fill="var(--swyv-red)" />
      <path d="M284 100L294 106L284 112Z" fill="var(--swyv-steel)" />
      <path d="M262 160L274 160L270 148Z" fill="var(--swyv-steel)" />
      {ground}
    </>
  ),
  // Invoice & report: one statement and the month's bars
  invoice: (
    <>
      <path d="M60 24H170L190 44V164H60Z" fill="var(--swyv-concrete)" stroke="var(--swyv-steel)" />
      <path d="M170 24V44H190" fill="none" stroke="var(--swyv-steel)" />
      {[52, 68, 84, 100].map((y) => (
        <path key={y} d={`M76 ${y}H${y === 52 ? 130 : 172}`} stroke="var(--swyv-asphalt)" strokeOpacity="0.5" />
      ))}
      <rect x="76" y="132" width="96" height="16" fill="var(--swyv-red)" />
      {[40, 70, 52, 96, 80].map((h, i) => (
        <rect key={i} x={214 + i * 18} y={170 - h} width="12" height={h} fill={i === 3 ? "var(--swyv-red)" : "var(--swyv-asphalt)"} stroke="var(--swyv-steel)" />
      ))}
      {ground}
    </>
  ),
};

export function CarouselScene({ scene, className }: { scene: SceneKey; className?: string }) {
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true" focusable="false" className={className}>
      {SCENES[scene]}
    </svg>
  );
}
