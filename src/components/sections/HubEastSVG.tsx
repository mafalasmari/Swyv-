/**
 * The Hub East cross-dock as dimmed line art: gate, road, two dock doors, a parked
 * truck and pallets. A static backdrop for the scroll hero, mirrored in RTL.
 */
export function HubEastSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      strokeWidth="1.5"
    >
      {/* Line art, dimmed so it stays behind the title. */}
      <g opacity="0.5">
        {/* Road and its near lane */}
        <path d="M0 400H800" stroke="currentColor" />
        <path d="M0 476H800" stroke="var(--swyv-steel)" strokeDasharray="10 12" opacity="0.6" />

        {/* Gate: two posts and a raised barrier */}
        <g stroke="currentColor">
          <path d="M80 400V300M200 400V300" />
          <path d="M80 318L176 286" />
        </g>

        {/* Hub building with two dock doors and the dock platform */}
        <g stroke="currentColor">
          <path d="M420 400V210L590 170L760 210V400" />
          <rect x="460" y="290" width="70" height="80" />
          <rect x="590" y="290" width="70" height="80" />
          <path d="M440 370H760" />
        </g>

        {/* Four pallets on the platform */}
        <g stroke="currentColor">
          <rect x="684" y="346" width="30" height="24" />
          <rect x="718" y="346" width="30" height="24" />
          <rect x="684" y="322" width="30" height="24" />
          <rect x="718" y="322" width="30" height="24" />
        </g>

        {/* Parked truck at the first dock */}
        <g stroke="currentColor" fill="var(--surface)">
          <rect x="470" y="334" width="120" height="54" />
          <path d="M590 350H618L630 366V388H590Z" />
          <circle cx="495" cy="392" r="8" />
          <circle cx="610" cy="392" r="8" />
        </g>
      </g>
    </svg>
  );
}
