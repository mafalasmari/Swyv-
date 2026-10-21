"use client";

import { useEffect, useRef, useState } from "react";
import { InlineScript } from "./InlineScript";

const STORAGE_KEY = "swyv-intro-seen-v1";
/** Total length of the sequence; must match the CSS timeline in globals.css. */
const TOTAL_MS = 1900;

/**
 * Poppins ExtraBold outlines for "Swyv" (font units, baseline at y = 1050).
 * Inlined so the intro never waits for, or flashes, the web font.
 */
const GLYPHS = [
  {
    char: "S",
    advance: 620,
    d: "M35 831H244Q247 868 266 885Q285 902 315 902Q342 902 359.5 888.5Q377 875 377 851Q377 820 348 803Q319 786 254 765Q185 742 142.5 720.5Q100 699 68.5 657.5Q37 616 37 549Q37 481 71 432.5Q105 384 165 359Q225 334 301 334Q424 334 497.5 391.5Q571 449 576 553H363Q362 521 343.5 505Q325 489 296 489Q274 489 260 502Q246 515 246 539Q246 559 261.5 573.5Q277 588 300 598.5Q323 609 368 625Q435 648 478.5 670.5Q522 693 553.5 733.5Q585 774 585 836Q585 899 553.5 949Q522 999 462.5 1028Q403 1057 322 1057Q199 1057 120 998.5Q41 940 35 831Z",
  },
  { char: "w", advance: 885, d: "M885 489 742 1050H522L444 710L363 1050H144L2 489H197L260 861L343 489H553L639 862L701 489Z" },
  { char: "y", advance: 655, d: "M660 489 304 1317H91L225 1026L-5 489H213L331 807L445 489Z" },
  { char: "v", advance: 649, d: "M325 865 430 489H639L446 1050H202L9 489H218Z" },
];

/**
 * Glyph box: y 71–1320 (1249 units). Its centre (695.5) is the middle of the
 * letters' visible body, so the 50svh split runs through the logo's centre.
 */
const BOX_TOP = 71;
const BOX_HEIGHT = 1249;
/** Matches the wordmark's -0.045em tracking. */
const TRACKING = -45;

/** Decides play/skip before first paint and owns the timeline even before hydration. */
const BOOT = `(function(){var el=document.getElementById("swyv-intro");if(!el)return;var seen;try{seen=sessionStorage.getItem("${STORAGE_KEY}");sessionStorage.setItem("${STORAGE_KEY}","1")}catch(e){seen="1"}if(seen||matchMedia("(prefers-reduced-motion: reduce)").matches){el.setAttribute("data-intro","skip");return}el.setAttribute("data-intro","play");el.setAttribute("data-start",String(performance.now()));document.body.style.overflow="hidden";setTimeout(function(){if(el.getAttribute("data-intro")==="play"){el.setAttribute("data-intro","done");document.body.style.overflow=""}},${TOTAL_MS})})();`;

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
      <div ref={ref} id="swyv-intro" className="intro" data-intro="pending" aria-hidden suppressHydrationWarning>
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
