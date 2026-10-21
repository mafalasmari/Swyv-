"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useGsap } from "@/lib/useGsap";

/** Scene size (viewBox) and where the truck sits in it when it is not moving. */
const SCENE_W = 800;
const SCENE_H = 500;
const TRUCK_X = 140;
/** Truck width in scene units (240-unit drawing at 0.8). */
const TRUCK_W = 192;
/** Driving speed in scene units per second. */
const SPEED = 110;
/** Wheel radius in the truck's drawing units (scaled 0.8 in the scene). */
const WHEEL_R = 10;

/**
 * The Hub East cross-dock: gate, two dock doors, a parked truck and pallets drawn
 * as dimmed line art, and one detailed semi-truck that drives across the whole
 * scene, leaves it, and comes back in from the start in an endless loop, its
 * wheels turning with it. Paused whenever the hero is off screen; static with
 * reduced motion. Mirrored in RTL so the truck drives in the reading direction.
 */
export function HubEastSVG({ className, rtl }: { className?: string; rtl?: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const truckRef = useRef<SVGGElement>(null);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (name: string) => `${uid}-${name}`;

  // Rebuild the drive when the window is resized (the visible part of the scene changes).
  const [resizes, setResizes] = useState(0);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setResizes((n) => n + 1), 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, []);

  useGsap(svgRef, ({ gsap, ScrollTrigger }) => {
    const svg = svgRef.current!;
    const truck = truckRef.current!;
    // The scene is cropped to fill the hero (slice), so on narrow screens only its
    // middle shows. Each pass runs from just off the visible left edge to just off
    // the visible right one, so the truck is on screen the whole time.
    const visible = () => {
      const { width, height } = svg.getBoundingClientRect();
      const scale = Math.max(width / SCENE_W, height / SCENE_H) || 1;
      const half = Math.min(SCENE_W, width / scale) / 2;
      return [SCENE_W / 2 - half, SCENE_W / 2 + half];
    };
    const [left, right] = visible();
    const enter = left - TRUCK_X - TRUCK_W - 10;
    const exit = right - TRUCK_X + 10;
    const drive = gsap.fromTo(truck, { x: enter }, { x: exit, duration: (exit - enter) / SPEED, ease: "none", repeat: -1, paused: true });
    // One turn per wheel circumference travelled (the truck is drawn at 0.8 scale).
    const spin = gsap.to(truck.querySelectorAll("[data-wheel]"), {
      rotation: 360,
      transformOrigin: "50% 50%",
      duration: (2 * Math.PI * WHEEL_R * 0.8) / SPEED,
      ease: "none",
      repeat: -1,
      paused: true,
    });
    ScrollTrigger.create({
      // The drawing sits in a sticky layer, so its own box never scrolls away;
      // the scrolling hero around it decides when it is on screen.
      trigger: svg.closest("[data-scroll-hero]") ?? svg,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => [drive, spin].forEach((t) => (self.isActive ? t.play() : t.pause())),
    });
  }, [resizes]);

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

      <defs>
        <linearGradient id={id("trailer")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--swyv-concrete)" />
          <stop offset="0.7" stopColor="var(--swyv-concrete)" />
          <stop offset="1" stopColor="var(--swyv-steel)" />
        </linearGradient>
        <linearGradient id={id("cab")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--swyv-red)" />
          <stop offset="0.55" stopColor="var(--swyv-red)" />
          <stop offset="1" stopColor="var(--swyv-red-ink)" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--swyv-steel)" />
          <stop offset="0.45" stopColor="var(--swyv-asphalt)" />
          <stop offset="1" stopColor="var(--swyv-black)" />
        </linearGradient>
        <linearGradient id={id("chrome")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--swyv-concrete)" />
          <stop offset="0.5" stopColor="var(--swyv-steel)" />
          <stop offset="1" stopColor="var(--swyv-concrete)" />
        </linearGradient>
        <radialGradient id={id("rim")}>
          <stop offset="0" stopColor="var(--swyv-concrete)" />
          <stop offset="1" stopColor="var(--swyv-steel)" />
        </radialGradient>
        <radialGradient id={id("shadow")}>
          <stop offset="0" stopColor="var(--swyv-black)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--swyv-black)" stopOpacity="0" />
        </radialGradient>
        {/* One wheel: tyre, rim, hub and five wheel nuts (the nuts show it turning). */}
        <g id={id("wheel")}>
          <circle r="10" fill="var(--swyv-black)" />
          <circle r="8.6" fill="none" stroke="var(--swyv-asphalt)" strokeWidth="1.4" />
          <circle r="6" fill={`url(#${id("rim")})`} />
          <circle r="4.6" fill="none" stroke="var(--swyv-asphalt)" strokeOpacity="0.5" strokeWidth="0.6" />
          <circle r="2" fill="var(--swyv-asphalt)" />
          {[0, 72, 144, 216, 288].map((a) => (
            <circle
              key={a}
              cx={3.3 * Math.cos((a * Math.PI) / 180)}
              cy={3.3 * Math.sin((a * Math.PI) / 180)}
              r="0.7"
              fill="var(--swyv-asphalt)"
            />
          ))}
        </g>
      </defs>

      {/* Moving semi-truck on the near lane, cab facing the direction of travel.
          Drawn on a 240 × 88 grid, scaled 0.8, wheels touching the lane line. */}
      <g ref={truckRef}>
        <g transform="translate(140 406) scale(0.8)">
          {/* Soft ground shadow */}
          <ellipse cx="120" cy="87" rx="122" ry="4" fill={`url(#${id("shadow")})`} />

          {/* Trailer: ribbed box, rear doors, red stripe and the SWYV name */}
          <rect x="4" y="6" width="146" height="58" rx="1.5" fill={`url(#${id("trailer")})`} />
          <path
            d={Array.from({ length: 23 }, (_, i) => `M${16 + i * 6} 9V60`).join("")}
            stroke="var(--swyv-steel)"
            strokeOpacity="0.35"
            strokeWidth="0.6"
          />
          <path d="M4 9.5H150M4 60H150" stroke="var(--swyv-steel)" strokeOpacity="0.7" strokeWidth="0.8" />
          <rect x="4" y="6" width="9" height="58" fill="var(--swyv-steel)" fillOpacity="0.35" />
          <path d="M8.5 8V62" stroke="var(--swyv-asphalt)" strokeOpacity="0.5" strokeWidth="0.6" />
          <rect x="5" y="20" width="2" height="4" fill="var(--swyv-asphalt)" />
          <rect x="5" y="46" width="2" height="4" fill="var(--swyv-asphalt)" />
          <rect x="13" y="51" width="137" height="3.5" fill="var(--swyv-red)" />
          {/* In RTL the whole drawing is mirrored; flip the mark back about its centre (x 80.5) so it reads. */}
          <g transform={rtl ? "translate(161 0) scale(-1 1)" : undefined}>
            <text
              direction="ltr"
              x="44"
              y="40"
              fill="var(--swyv-red)"
              fontFamily="var(--font-poppins), sans-serif"
              fontWeight="800"
              fontSize="20"
              letterSpacing="-0.5"
            >
              Swyv
            </text>
            <path d="M101 29H106.5L109 33.5L111.5 29H117L109 41Z" fill="var(--swyv-red)" />
          </g>
          {[30, 70, 110, 146].map((x) => (
            <rect key={x} x={x} y="57" width="2.4" height="1.6" fill="var(--swyv-pending)" />
          ))}

          {/* Trailer chassis: rails, landing gear, rear guard, mud flap */}
          <rect x="10" y="64" width="142" height="3" fill="var(--swyv-black)" />
          <rect x="4" y="64" width="2" height="9" fill="var(--swyv-asphalt)" />
          <rect x="4" y="71" width="10" height="2" fill="var(--swyv-asphalt)" />
          <rect x="116" y="67" width="2.4" height="9" fill="var(--swyv-steel)" />
          <rect x="114" y="75.5" width="6.4" height="1.6" fill="var(--swyv-steel)" />
          <rect x="59" y="66" width="2" height="13" fill="var(--swyv-black)" />

          {/* Exhaust stack, behind the cab so only its top shows */}
          <rect x="175" y="4" width="3" height="28" fill={`url(#${id("chrome")})`} />
          <rect x="174.5" y="3" width="4" height="2" fill="var(--swyv-steel)" />

          {/* Cab with sleeper: body, roof fairing, windows, door, hood */}
          <path d="M150 70V62H154V70Z" fill="var(--swyv-black)" />
          <path
            d="M153 70V24Q153 19 158 19H196L208 41H224Q231 41 232.5 48V66Q232.5 70 228.5 70Z"
            fill={`url(#${id("cab")})`}
          />
          <path d="M156 19Q168 9 192 12L196 19Z" fill="var(--swyv-red-ink)" />
          <path d="M196.5 23.5L206 40H195Z" fill={`url(#${id("glass")})`} />
          <rect x="182" y="24" width="11" height="15" rx="1" fill={`url(#${id("glass")})`} />
          <rect x="159" y="27" width="16" height="8" rx="1" fill="var(--swyv-black)" fillOpacity="0.35" />
          <path d="M179 23V64M179 64H207V41" fill="none" stroke="var(--swyv-black)" strokeOpacity="0.35" strokeWidth="0.7" />
          <rect x="198" y="46" width="5" height="1.6" rx="0.8" fill="var(--swyv-black)" fillOpacity="0.5" />
          <path d="M208 41H224" stroke="var(--swyv-black)" strokeOpacity="0.25" strokeWidth="0.6" />
          {/* Mirror */}
          <path d="M207 31H211" stroke="var(--swyv-black)" strokeWidth="0.8" />
          <rect x="210" y="26" width="3" height="10" rx="1" fill="var(--swyv-asphalt)" />
          {/* Grille, headlight, indicator, bumper, step, fuel tank */}
          <rect x="228.5" y="50" width="4" height="13" fill="var(--swyv-asphalt)" />
          <path d="M229 53H232.5M229 56H232.5M229 59H232.5" stroke="var(--swyv-steel)" strokeOpacity="0.6" strokeWidth="0.5" />
          <rect x="228" y="44.5" width="4.5" height="4" rx="1" fill="var(--swyv-concrete)" />
          <rect x="226" y="45" width="1.8" height="3" fill="var(--swyv-pending)" />
          <rect x="224" y="64" width="11" height="5" rx="1" fill={`url(#${id("chrome")})`} />
          <rect x="182" y="68" width="10" height="2" fill="var(--swyv-steel)" />
          <rect x="185" y="58" width="20" height="9" rx="3" fill={`url(#${id("chrome")})`} />
          <path d="M190 58V67M200 58V67" stroke="var(--swyv-steel)" strokeWidth="0.5" />

          {/* Wheels: trailer tandem, drive tandem, steer axle */}
          {[
            [26, 76],
            [48, 76],
            [158, 76],
            [178, 76],
            [218, 76],
          ].map(([cx, cy]) => (
            <g key={cx} transform={`translate(${cx} ${cy})`}>
              <use href={`#${id("wheel")}`} data-wheel />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}
