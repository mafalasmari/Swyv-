"use client";

import { useRef, useState } from "react";
import { compact, sar } from "@/lib/format";

export type LineSeries = { key: string; label: string; color: string; values: number[] };

type LineChartProps = {
  series: LineSeries[];
  xLabels: string[];
  xTitle: string;
  height?: number;
  ariaLabel: string;
};

const PAD = { top: 16, right: 92, bottom: 32, left: 52 };
const WIDTH = 720;

/** Small dependency-free SVG line chart with a crosshair tooltip and direct end labels. */
export function LineChart({ series, xLabels, xTitle, height = 280, ariaLabel }: LineChartProps) {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const max = Math.max(1, ...series.flatMap((s) => s.values));
  const niceMax = niceCeil(max);
  const innerW = WIDTH - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const n = xLabels.length;
  const x = (i: number) => PAD.left + (n === 1 ? 0 : (i / (n - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - (v / niceMax) * innerH;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * niceMax);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const i = Math.round(((px - PAD.left) / innerW) * (n - 1));
    setHover(Math.min(n - 1, Math.max(0, i)));
  };

  // Keep end labels from overlapping when lines finish close together.
  const ends = series
    .map((s) => ({ s, y: y(s.values[n - 1]) }))
    .sort((a, b) => a.y - b.y)
    .map((e, i, arr) => (i > 0 && e.y - arr[i - 1].y < 16 ? { ...e, y: arr[i - 1].y + 16 } : e));

  return (
    <div dir="ltr" className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${height}`}
        role="img"
        aria-label={ariaLabel}
        className="w-full touch-none select-none"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-steel font-mono text-[10px]">
              {compact(t)}
            </text>
          </g>
        ))}
        {xLabels.map((label, i) =>
          i % 2 === 0 || i === n - 1 ? (
            <text key={label} x={x(i)} y={height - 10} textAnchor="middle" className="fill-steel font-mono text-[10px]">
              {label}
            </text>
          ) : null,
        )}
        <text x={WIDTH - PAD.right} y={height - 10} dx={12} className="fill-steel font-mono text-[10px]">
          {xTitle}
        </text>

        {hover !== null && (
          <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} stroke="var(--color-steel)" strokeDasharray="3 3" />
        )}

        {series.map((s) => (
          <g key={s.key}>
            <polyline
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
            />
            {hover !== null && (
              <circle cx={x(hover)} cy={y(s.values[hover])} r={4.5} fill={s.color} stroke="var(--color-panel)" strokeWidth={2} />
            )}
          </g>
        ))}

        {ends.map(({ s, y: ly }) => (
          <text key={s.key} x={WIDTH - PAD.right + 8} y={ly} dy="0.32em" className="fill-concrete text-[11px]">
            {s.label}
          </text>
        ))}

        {/* Wide transparent hit area */}
        <rect x={PAD.left} y={PAD.top} width={innerW} height={innerH} fill="transparent" />
      </svg>

      {hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-40 border border-line bg-night/95 px-3 py-2 text-xs shadow-lg"
          style={{
            left: `${(x(hover) / WIDTH) * 100}%`,
            transform: hover > n / 2 ? "translateX(calc(-100% - 12px))" : "translateX(12px)",
          }}
        >
          <p className="mb-1.5 font-mono text-steel">
            {xTitle} {xLabels[hover]}
          </p>
          {series.map((s) => (
            <p key={s.key} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span aria-hidden className="h-0.5 w-3" style={{ background: s.color }} />
                {s.label}
              </span>
              <span className="num text-concrete">{sar(s.values[hover])}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function niceCeil(v: number) {
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const f = v / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}
