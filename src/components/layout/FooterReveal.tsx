"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useGsap } from "@/lib/useGsap";
import { refreshScrollTriggers } from "./SmoothScrollProvider";

/** Wider than this, the footer is fixed and slides up; at or below, it is an ordinary block. */
const DESKTOP = "(width > 1024px)";

/**
 * Desktop: the footer is fixed to the bottom of the screen, under the page (main
 * sits above it), half pushed down (translateY 50%). As the spacer at the end of
 * the page scrolls in, the content slides off it and the footer rises to 0 at half
 * the scroll speed, so it is uncovered rather than scrolled in. The spacer takes the
 * footer's own height (--footer-h), so the page ends with the footer flush and no
 * empty band, even on short pages. Mobile, reduced motion and no-script: a normal
 * footer in the flow, no spacer (see .footer-sticky in globals.css).
 */
export function FooterReveal({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    // The trigger is measured against the spacer, so remeasure when its height
    // changes. Debounced: the first measurement lands during start-up, when the
    // provider refreshes anyway.
    let last = -1;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const sync = () => {
      const h = footer.offsetHeight;
      if (h === last) return;
      last = h;
      wrapRef.current?.style.setProperty("--footer-h", `${h}px`);
      clearTimeout(timer);
      timer = setTimeout(refreshScrollTriggers, 300);
    };
    const ro = new ResizeObserver(sync);
    ro.observe(footer);
    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useGsap(wrapRef, ({ gsap }) => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP, () => {
      gsap.fromTo(
        footerRef.current,
        // y: 0 drops the offset GSAP reads from the CSS start state, so only yPercent moves it.
        { y: 0, yPercent: 50 },
        {
          y: 0,
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: ".footer-spacer", start: "top bottom", end: "bottom bottom", scrub: true },
        },
      );
    });
    return () => mm.revert();
  });

  return (
    <div ref={wrapRef}>
      <div aria-hidden="true" className="footer-spacer" />
      <div ref={footerRef} className="footer-sticky">
        {children}
      </div>
    </div>
  );
}
