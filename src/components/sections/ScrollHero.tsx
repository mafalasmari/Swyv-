"use client";

import { useRef, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/cn";
import { useGsap } from "@/lib/useGsap";
import { HubEastSVG } from "./HubEastSVG";

type ScrollHeroProps = {
  title: string;
  locale: Locale;
  /** Replaces the Hub East drawing (photo or video later). */
  media?: ReactNode;
  eyebrow?: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/** Scroll progress at which each stage ends (the timeline is normalised to 0–1). */
const REVEAL_END = 0.65;
const SHIFT_START = 0.8;

/**
 * Latin titles split into letters, grouped per word so lines still break between
 * words. Arabic splits into words only: splitting letters would break their joining.
 */
function renderTitle(text: string, locale: Locale) {
  if (locale === "ar") {
    return text.split(/(\s+)/).map((seg, i) =>
      seg.trim() ? (
        <span key={i} className="sh-word inline-block">
          {seg}
        </span>
      ) : (
        seg
      ),
    );
  }
  return text.split(/(\s+)/).map((seg, i) =>
    seg.trim() ? (
      <span key={i} className="inline-block whitespace-nowrap">
        {[...seg].map((ch, j) => (
          <span key={j} className="sh-char-wrapper">
            <span className="sh-char">{ch}</span>
          </span>
        ))}
      </span>
    ) : (
      seg
    ),
  );
}

/**
 * Tall hero whose sticky stage reveals the title as the page scrolls: letters
 * (Latin) or words (Arabic) rise in by 65%, hold, then the title lifts 8% over
 * the last 20%. The <h1> holds the full text from the first render; with reduced
 * motion the hero is one screen tall and everything is shown at once.
 */
export function ScrollHero({
  title,
  locale,
  media,
  eyebrow,
  description,
  actions,
  className,
}: ScrollHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const restRef = useRef<HTMLDivElement>(null);

  useGsap(
    rootRef,
    ({ gsap }) => {
      const isAr = locale === "ar";
      const units = titleRef.current!.querySelectorAll(
        isAr ? ".sh-word" : ".sh-char",
      );
      if (!units.length) return;

      // Per-unit timing from the spec: 500ms each, 70ms (letters) or 45ms (words)
      // apart. The scrubbed timeline is then scaled so the reveal ends at 65%.
      const each = 0.5;
      const stagger = isAr ? 0.045 : 0.07;
      const reveal = each + stagger * (units.length - 1);
      const total = reveal / REVEAL_END;

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
      tl.fromTo(
        units,
        { opacity: 0, y: isAr ? 20 : "100%" },
        { opacity: 1, y: 0, duration: each, stagger },
        0,
      );
      if (restRef.current) {
        tl.fromTo(
          restRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: reveal * 0.25 },
          reveal * 0.75,
        );
      }
      tl.to(
        titleRef.current,
        { yPercent: -8, ease: "none", duration: total * (1 - SHIFT_START) },
        total * SHIFT_START,
      );

      // Tabbing into the still-hidden buttons scrolls to where they are fully shown.
      const rest = restRef.current;
      const onFocus = () => {
        const st = tl.scrollTrigger!;
        const shown = st.start + (st.end - st.start) * REVEAL_END;
        if (window.scrollY < shown) window.scrollTo({ top: shown });
      };
      rest?.addEventListener("focusin", onFocus);
      return () => rest?.removeEventListener("focusin", onFocus);
    },
    [locale, title],
  );

  return (
    <div
      ref={rootRef}
      data-scroll-hero
      className={cn(
        "section-dark relative h-[200svh] md:h-[300svh] motion-reduce:h-auto",
        className,
      )}
    >
      {/* pt-16 keeps the content clear of the 64px sticky header. */}
      <div className="sticky top-0 flex h-svh items-center overflow-hidden pt-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 text-muted"
        >
          {media ?? <HubEastSVG className="size-full rtl:-scale-x-100" />}
        </div>
        <Container className="relative z-10 flex flex-col gap-6">
          {eyebrow && <Eyebrow index="SWYV">{eyebrow}</Eyebrow>}
          <h1
            ref={titleRef}
            aria-label={title}
            className={cn(
              "sh-title max-w-6xl font-semibold tracking-tight text-balance",
              locale === "ar" ? "leading-[1.3]" : "leading-[1.02]",
            )}
          >
            <span aria-hidden="true">{renderTitle(title, locale)}</span>
          </h1>
          {(description || actions) && (
            <div ref={restRef} className="sh-rest flex flex-col gap-6">
              {description && (
                <p className="max-w-2xl text-lg leading-relaxed text-pretty text-muted">
                  {description}
                </p>
              )}
              {actions && (
                <div className="flex flex-col gap-3 sm:flex-row">{actions}</div>
              )}
            </div>
          )}
        </Container>
      </div>
    </div>
  );
}
