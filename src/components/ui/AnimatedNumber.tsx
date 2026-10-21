"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { observeOnce } from "@/lib/observeOnce";

type AnimatedNumberProps = {
  value: number;
  /** Roll duration in ms. */
  duration?: number;
  /** Turns the value into the displayed text; digits roll, everything else stays put. */
  format?: (n: number) => string;
};

const DIGITS = "0123456789";
/** Latin digits, matching fmt() in lib/format and the brand sheet's numerals. */
const latin = (n: number) => new Intl.NumberFormat("en-US").format(n);

/**
 * Odometer: every digit is a 0–9 reel that rolls to its value when the number
 * first scrolls into view, and again whenever the value changes (only the reels
 * whose digit changed move). The real text sits underneath in transparent ink, so
 * layout, baseline and screen readers see exactly the formatted value; once a roll
 * ends the real text is shown and the reels hidden, so the resting number is
 * pixel-identical to plain text.
 */
export function AnimatedNumber({ value, duration = 1200, format = latin }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  const [settledText, setSettledText] = useState<string | null>(null);
  const text = format(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => setOn(true), 0.5);
  }, []);

  useEffect(() => {
    if (!on) return;
    const id = setTimeout(() => setSettledText(text), duration + 50);
    return () => clearTimeout(id);
  }, [on, text, duration]);

  // Reels are keyed from the right so units stay units when the length changes.
  const chars = [...text];
  return (
    <span
      ref={ref}
      className="odo"
      data-on={on || undefined}
      data-settled={(on && settledText === text) || undefined}
      style={{ "--odo-duration": `${duration}ms` } as CSSProperties}
    >
      <span className="odo-ghost">{text}</span>
      <span aria-hidden="true" className="odo-reel">
        {chars.map((ch, i) => {
          const key = chars.length - i;
          const d = DIGITS.indexOf(ch);
          return d < 0 ? (
            <span key={key}>{ch}</span>
          ) : (
            <span key={key} className="odo-col">
              <span className="odo-stack" style={{ "--d": d } as CSSProperties}>
                {[...DIGITS].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
