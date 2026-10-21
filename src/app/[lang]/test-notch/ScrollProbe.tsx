"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/useGsap";

/**
 * Test-only: one ScrollTrigger per toned section; writes each trigger's start/end
 * next to the section's real document offsets so tests can compare them.
 */
export function ScrollProbe() {
  const ref = useRef<HTMLDivElement>(null);

  useGsap(ref, ({ ScrollTrigger }) => {
    const out = ref.current!;
    const sections = [...document.querySelectorAll<HTMLElement>("main section[data-tone]")];
    const triggers = sections.map((el) => ScrollTrigger.create({ trigger: el, start: "top top", end: "bottom top" }));
    const report = () => {
      const rows = triggers.map((t, i) => {
        const r = sections[i].getBoundingClientRect();
        return { tone: sections[i].dataset.tone, start: Math.round(t.start), end: Math.round(t.end), top: Math.round(r.top + window.scrollY), bottom: Math.round(r.bottom + window.scrollY) };
      });
      out.dataset.report = JSON.stringify({ count: ScrollTrigger.getAll().length, rows });
    };
    ScrollTrigger.addEventListener("refresh", report);
    ScrollTrigger.refresh();
    report();
    return () => ScrollTrigger.removeEventListener("refresh", report);
  });

  return <div ref={ref} id="scroll-probe" hidden />;
}
