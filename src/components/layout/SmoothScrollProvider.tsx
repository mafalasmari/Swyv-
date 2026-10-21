"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

let registered = false;
const registerGsap = () => {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
};

/** True when the element sits inside a page Next has hidden (Activity, display: none) or is gone. */
const isHidden = (el: Element | null | undefined) =>
  !el || !el.isConnected || (el as HTMLElement).closest("[hidden]") !== null || el.getClientRects().length === 0;

/**
 * Kills ScrollTriggers whose trigger lives in a hidden or detached page, then
 * recalculates the rest. Next 16 keeps up to three previous routes in the DOM with
 * display: none; their triggers would otherwise measure zero-height boxes.
 */
export function refreshScrollTriggers() {
  if (!registered) return;
  ScrollTrigger.getAll().forEach((t) => {
    if (isHidden(t.trigger as Element | undefined)) t.kill();
  });
  ScrollTrigger.refresh();
}

/**
 * Smooth scrolling (Lenis) driven by GSAP's ticker, with ScrollTrigger kept in sync.
 * Never initialised for prefers-reduced-motion: the page keeps native scrolling.
 */
export function SmoothScrollProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION);
    let teardown: (() => void) | null = null;

    const setup = () => {
      registerGsap();
      const lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        autoRaf: false,
        stopInertiaOnNavigate: true,
        // Smooth in-page anchors (#calculator, #request…). Lenis honours each target's
        // scroll-margin-top (scroll-mt-16 = the 64px sticky header), so no extra offset.
        anchors: true,
      });

      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);

      // The intro and the mobile drawer lock scrolling with body overflow: hidden.
      // Lenis scrolls programmatically, so it has to stop while that lock is on.
      const syncLock = () => (document.body.style.overflow === "hidden" ? lenis.stop() : lenis.start());
      const lockObserver = new MutationObserver(syncLock);
      lockObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });
      syncLock();

      teardown = () => {
        lockObserver.disconnect();
        gsap.ticker.remove(raf);
        lenis.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    };

    const onPreferenceChange = () => {
      teardown?.();
      teardown = null;
      if (!media.matches) setup();
    };

    if (!media.matches) setup();
    media.addEventListener("change", onPreferenceChange);

    return () => {
      media.removeEventListener("change", onPreferenceChange);
      teardown?.();
    };
  }, []);

  // After every client-side navigation: drop triggers left in the hidden previous
  // page and remeasure the visible one once it has laid out.
  useEffect(() => {
    const id = requestAnimationFrame(() => refreshScrollTriggers());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
