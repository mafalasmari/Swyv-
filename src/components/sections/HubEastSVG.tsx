"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/useGsap";

/**
 * Line drawing of the Hub East cross-dock: gate, two dock doors, a parked truck,
 * a moving truck and four pallets. One motion only: the red truck drives between
 * the gate and the docks on an 8s loop, paused whenever its hero is off screen.
 * Mirrored in RTL so the truck still drives toward the reading direction.
 */
export function HubEastSVG({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const truckRef = useRef<SVGGElement>(null);

  useGsap(svgRef, ({ gsap }) => {
    const svg = svgRef.current!;
    gsap.to(truckRef.current, {
      x: 200,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "none",
      scrollTrigger: {
        // The drawing sits in a sticky layer, so its own box never scrolls away;
        // the scrolling hero around it decides when it is on screen.
        trigger: svg.closest("[data-scroll-hero]") ?? svg,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play pause resume pause",
      },
    });
  });

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      strokeWidth="1.5"
    >
      {/* Line art is dimmed; the moving truck keeps full SWYV red. */}
      <g opacity="0.5">
        {/* Road and the lane the trucks follow */}
        <path d="M0 400H800" stroke="currentColor" />
        <path
          d="M0 476H800"
          stroke="var(--swyv-steel)"
          strokeDasharray="10 12"
          opacity="0.6"
        />

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

      {/* Moving truck on the near lane, in front of the hub: flat line-art in a
          160×80 box (cab facing the direction of travel). */}
      <g ref={truckRef}>
        <g transform="translate(190 396)">
          {/* Trailer with chamfered ends and panel lines */}
          <path
            d="M6 8H104L108 12V58L104 62H6L2 58V12Z"
            fill="var(--swyv-asphalt)"
            stroke="var(--swyv-steel)"
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          <path
            d="M8 22H102M8 36H102M8 50H102"
            stroke="var(--swyv-steel)"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <rect x="6" y="62" width="102" height="3" fill="var(--swyv-black)" />
          <path d="M108 63H114" stroke="var(--swyv-steel)" strokeWidth="2" />

          {/* Cab: body, windshield, side window, door, bumper and two lamps */}
          <path
            d="M114 66V28Q114 22 120 22H138L152 40Q156 42 156 46V66Z"
            fill="var(--swyv-red)"
          />
          <path
            d="M137 27H139L149 40H137Z"
            fill="var(--swyv-steel)"
            fillOpacity="0.6"
          />
          <rect
            x="120"
            y="28"
            width="12"
            height="12"
            fill="var(--swyv-steel)"
            fillOpacity="0.6"
          />
          <path
            d="M134 44V62"
            stroke="var(--swyv-black)"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
          <rect x="112" y="64" width="44" height="3" fill="var(--swyv-black)" />
          <rect x="150" y="60" width="8" height="6" fill="var(--swyv-steel)" />
          <rect
            x="153"
            y="47"
            width="3"
            height="4"
            fill="var(--swyv-concrete)"
          />
          <rect
            x="153"
            y="54"
            width="3"
            height="3"
            fill="var(--swyv-pending)"
          />

          {/* Wheels: tyre and hub; trailer tandem, then the cab's drive and front axle */}
          <g
            fill="var(--swyv-black)"
            stroke="var(--swyv-steel)"
            strokeWidth="1"
          >
            <circle cx="22" cy="69" r="9" />
            <circle cx="42" cy="69" r="9" />
            <circle cx="122" cy="69" r="9" />
            <circle cx="146" cy="69" r="9" />
          </g>
          <g fill="var(--swyv-steel)">
            <circle cx="22" cy="69" r="3.5" />
            <circle cx="42" cy="69" r="3.5" />
            <circle cx="122" cy="69" r="3.5" />
            <circle cx="146" cy="69" r="3.5" />
          </g>

          {/* Shadow: two thin lines, no filters */}
          <path
            d="M8 79H154"
            stroke="var(--swyv-steel)"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
          <path
            d="M24 80H138"
            stroke="var(--swyv-steel)"
            strokeOpacity="0.2"
            strokeWidth="1"
          />
        </g>
      </g>
    </svg>
  );
}
