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

      {/* Moving truck (red) on the near lane, in front of the hub */}
      <g ref={truckRef}>
        <rect x="200" y="414" width="110" height="48" fill="var(--swyv-red)" />
        <path d="M310 428H336L346 442V462H310Z" fill="var(--swyv-red)" />
        <circle
          cx="224"
          cy="466"
          r="8"
          fill="var(--surface)"
          stroke="currentColor"
        />
        <circle
          cx="330"
          cy="466"
          r="8"
          fill="var(--surface)"
          stroke="currentColor"
        />
      </g>
    </svg>
  );
}
