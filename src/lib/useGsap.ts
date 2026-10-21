"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, type DependencyList, type RefObject } from "react";

/**
 * Runs GSAP / ScrollTrigger setup scoped to an element and reverts it on cleanup.
 * Skipped entirely for prefers-reduced-motion. When Next hides a page (Activity),
 * React runs this cleanup, so its triggers are killed with it.
 */
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: (context: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }) => void,
  deps: DependencyList = [],
) {
  useEffect(() => {
    if (!scope.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => setup({ gsap, ScrollTrigger }), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
