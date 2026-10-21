"use client";

import { useEffect, useRef, useState } from "react";
import { GLYPHS, TRACKING } from "@/lib/wordmark";
import { InlineScript } from "./InlineScript";

/** Event that replays the intro (the header logo dispatches it). */
const REPLAY_EVENT = "swyv:intro";
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
 * Plays on every page load; only reduced motion skips it.
 */
const BOOT = `(function(){var el=document.getElementById("swyv-intro");if(!el)return;if(matchMedia("(prefers-reduced-motion: reduce)").matches){el.setAttribute("data-intro","skip");return}el.setAttribute("data-intro","play");el.setAttribute("data-start",String(performance.now()));document.body.style.overflow="hidden";setTimeout(function(){if(el.getAttribute("data-intro")==="play"){el.setAttribute("data-intro","done");document.body.style.overflow=""}},${TOTAL_MS})})();`;

/** Plays the intro again (no-op with reduced motion). */
export function replayIntro() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  window.dispatchEvent(new Event(REPLAY_EVENT));
}

/**
 * Opening sequence: the chevron draws, "Swyv" rises letter by letter, breathes,
 * then the screen splits in two along the middle of the logo.
 * Shown on every page load and again on each click of the header logo; skipped on
 * any click, Escape or Space, and never shown with prefers-reduced-motion. The page
 * underneath is fully loaded and never waits.
 */
export function IntroLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [removed, setRemoved] = useState(false);
  // Bumped by replayIntro(); each value mounts a fresh intro that plays at once.
  const [run, setRun] = useState(0);

  useEffect(() => {
    const replay = () => {
      setRemoved(false);
      setRun((n) => n + 1);
    };
    window.addEventListener(REPLAY_EVENT, replay);
    return () => window.removeEventListener(REPLAY_EVENT, replay);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (run > 0) {
      // Replays start here; the first run was started by BOOT before paint.
      el.setAttribute("data-intro", "play");
      el.setAttribute("data-start", String(performance.now()));
      document.body.style.overflow = "hidden";
    }

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
  }, [run]);

  if (removed) return null;

  return (
    <>
      <div
        key={run}
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
      {run === 0 && <InlineScript html={BOOT} />}
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
