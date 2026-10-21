"use client";

import { useEffect, useRef, useState } from "react";
import { GLYPHS, TRACKING } from "@/lib/wordmark";
import { InlineScript } from "./InlineScript";

const STORAGE_KEY = "swyv-intro-seen-v1";
/** Total length of the sequence; must match the CSS timeline in globals.css. */
const TOTAL_MS = 2060;

/**
 * Glyph box: y 71–1320 (1249 units). Its centre (695.5) is the middle of the
 * letters' visible body, so the 50svh split runs through the logo's centre.
 */
const BOX_TOP = 71;
const BOX_HEIGHT = 1249;

/**
 * Decides play/skip before first paint and owns the timeline even before hydration.
 * Reduced motion skips without writing the session key, so turning it off later shows the intro.
 */
const BOOT = `(function(){var el=document.getElementById("swyv-intro");if(!el)return;if(matchMedia("(prefers-reduced-motion: reduce)").matches){el.setAttribute("data-intro","skip");return}var seen;try{seen=sessionStorage.getItem("${STORAGE_KEY}");sessionStorage.setItem("${STORAGE_KEY}","1")}catch(e){seen="1"}if(seen){el.setAttribute("data-intro","skip");return}el.setAttribute("data-intro","play");el.setAttribute("data-start",String(performance.now()));document.body.style.overflow="hidden";setTimeout(function(){if(el.getAttribute("data-intro")==="play"){el.setAttribute("data-intro","done");document.body.style.overflow=""}},${TOTAL_MS})})();`;

/**
 * Opening sequence: the chevron draws, "Swyv" rises letter by letter, breathes,
 * then the screen splits in two along the middle of the logo.
 * Shown once per session; skipped on any click, Escape or Space, and never shown
 * with prefers-reduced-motion. The page underneath is fully loaded and never waits.
 */
export function IntroLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finish = () => {
      el.setAttribute("data-intro", "done");
      document.body.style.overflow = "";
      setRemoved(true);
    };

    if (el.getAttribute("data-intro") !== "play") {
      const id = setTimeout(() => setRemoved(true), 0);
      return () => clearTimeout(id);
    }

    const started = Number(el.getAttribute("data-start")) || performance.now();
    const remaining = Math.max(0, TOTAL_MS - (performance.now() - started));
    const timer = setTimeout(finish, remaining);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener("pointerdown", finish, { once: true });
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", finish);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (removed) return null;

  return (
    <>
      <div
        ref={ref}
        id="swyv-intro"
        className="intro"
        data-intro="pending"
        role="presentation"
        aria-hidden="true"
        aria-live="off"
        suppressHydrationWarning
      >
        <div className="intro-half intro-half-top">
          <div className="intro-stage intro-stage-top">
            <Mark />
          </div>
        </div>
        <div className="intro-half intro-half-bottom">
          <div className="intro-stage intro-stage-bottom">
            <Mark />
          </div>
        </div>
      </div>
      <InlineScript html={BOOT} />
    </>
  );
}

/** One copy of the wordmark. The intro renders it twice, one per half. */
function Mark() {
  return (
    <div className="intro-mark" dir="ltr">
      {GLYPHS.map((g, i) => (
        <span
          key={g.char}
          className="char-wrapper"
          style={{
            width: `${(g.advance + 20) / 1000}em`,
            marginLeft: "-0.01em",
            marginRight: `${(TRACKING - 10) / 1000}em`,
          }}
        >
          <svg
            className="char"
            viewBox={`-10 ${BOX_TOP} ${g.advance + 20} ${BOX_HEIGHT}`}
            style={{ animationDelay: `${350 + i * 70}ms` }}
          >
            <path d={g.d} fill="currentColor" />
          </svg>
        </span>
      ))}
      <svg className="intro-chevron" viewBox="0 0 12 10">
        <path d="M1.6 1.6 6 8.4 10.4 1.6" pathLength={1} />
      </svg>
    </div>
  );
}
