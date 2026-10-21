"use client";

import Link from "next/link";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { ArrowIcon, Chevron } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import { revealItem } from "@/lib/reveal";
import { IndustryIcon } from "./IndustryIcons";

export type IndustryCell = {
  code: string;
  name: string;
  /** Makes the whole cell a link (home); without it the cell lists what moves each way. */
  href?: string;
  id?: string;
  deliver?: string;
  back?: string;
};

type IndustryGridProps = {
  sectors: IndustryCell[];
  cta: { title: string; button: string; href: string };
  /** Screen-reader names for the delivery / returns lines. */
  labels: { deliver: string; return: string };
};

/** Same pseudo-random value on server and client, so the flicker never causes a hydration mismatch. */
const seeded = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Hairline frame for a cols × rows grid: fading segments along every inner edge
 * and a flickering "+" at every corner where cells meet.
 */
function GridFrame({ cols, rows, className }: { cols: number; rows: number; className: string }) {
  const segments: ReactNode[] = [];
  for (let c = 1; c < cols; c++)
    for (let r = 0; r < rows; r++)
      segments.push(
        <span
          key={`v${c}-${r}`}
          className="ig-line ig-line-v"
          style={{ insetInlineStart: `${(c / cols) * 100}%`, top: `${(r / rows) * 100}%`, height: `${100 / rows}%` }}
        />,
      );
  for (let r = 1; r < rows; r++)
    for (let c = 0; c < cols; c++)
      segments.push(
        <span
          key={`h${r}-${c}`}
          className="ig-line ig-line-h"
          style={{ top: `${(r / rows) * 100}%`, insetInlineStart: `${(c / cols) * 100}%`, width: `${100 / cols}%` }}
        />,
      );
  const crosses: ReactNode[] = [];
  for (let r = 0; r <= rows; r++)
    for (let c = 0; c <= cols; c++) {
      const i = r * (cols + 1) + c;
      const duration = 2 + seeded(i) * 3; // 2–5s
      crosses.push(
        <span
          key={`x${i}`}
          className="ig-cross"
          style={
            {
              insetInlineStart: `${(c / cols) * 100}%`,
              top: `${(r / rows) * 100}%`,
              animationDuration: `${duration.toFixed(2)}s`,
              animationDelay: `-${(seeded(i + 99) * duration).toFixed(2)}s`,
            } as CSSProperties
          }
        />,
      );
    }
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      {segments}
      {crosses}
    </div>
  );
}

const track = (e: MouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

/**
 * Seven sectors and a "not listed" cell on a 4 × 2 grid (2 columns below 1024px),
 * framed by fading hairlines and flickering "+" marks instead of solid borders.
 * A red glow follows the pointer inside the hovered cell.
 */
export function IndustryGrid({ sectors, cta, labels }: IndustryGridProps) {
  return (
    <div className="relative">
      {/* Equal rows, so the frame's hairlines (placed by percentage) sit on the cell edges. */}
      <RevealGroup as="ul" wrap={false} className="grid auto-rows-fr grid-cols-2 lg:grid-cols-4">
        {sectors.map((sector, i) => {
          const content = (
            <>
              <div className="flex items-start justify-between gap-3">
                <IndustryIcon code={sector.code} className="size-14 sm:size-16" />
                <span className="num text-xs text-accent">{sector.code}</span>
              </div>
              <h3 className="text-base leading-snug font-semibold sm:text-lg">{sector.name}</h3>
              {(sector.deliver || sector.back) && (
                <dl className="mt-auto grid gap-3 text-sm">
                  {sector.deliver && (
                    <div className="flex gap-2.5">
                      <dt className="mt-1.5 shrink-0">
                        <Chevron direction="down" className="size-2 text-red" />
                        <span className="sr-only">{labels.deliver}</span>
                      </dt>
                      <dd className="text-muted">{sector.deliver}</dd>
                    </div>
                  )}
                  {sector.back && (
                    <div className="flex gap-2.5">
                      <dt className="mt-1.5 shrink-0">
                        <Chevron direction="up" className="size-2 text-pending" />
                        <span className="sr-only">{labels.return}</span>
                      </dt>
                      <dd className="text-muted">{sector.back}</dd>
                    </div>
                  )}
                </dl>
              )}
            </>
          );
          const cell = "flex h-full flex-col gap-4 p-4 sm:gap-5 sm:p-6";
          return (
            <li
              key={sector.code}
              id={sector.id}
              onMouseMove={track}
              style={revealItem(i).style}
              className={cn(revealItem(i).className, "ig-cell")}
            >
              {sector.href ? (
                <Link href={sector.href} className={cell}>
                  {content}
                </Link>
              ) : (
                <div className={cell}>{content}</div>
              )}
            </li>
          );
        })}
        <li onMouseMove={track} style={revealItem(sectors.length).style} className={cn(revealItem(sectors.length).className, "ig-cell")}>
          <Link href={cta.href} className="group flex h-full flex-col justify-between gap-6 p-4 sm:p-6">
            <span className="text-base leading-snug font-semibold sm:text-lg">{cta.title}</span>
            <span className="flex items-center gap-2 text-sm text-accent">
              {cta.button}
              <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
            </span>
          </Link>
        </li>
      </RevealGroup>
      <GridFrame cols={4} rows={2} className="hidden lg:block" />
      <GridFrame cols={2} rows={4} className="lg:hidden" />
    </div>
  );
}
