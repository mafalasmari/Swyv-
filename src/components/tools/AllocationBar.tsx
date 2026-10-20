import { cn } from "@/lib/cn";
import { fmt, pct } from "@/lib/format";

export type Segment = { key: string; label: string; value: number; swatch: string };

/** 100% stacked bar with a 2px gap between segments and a labeled legend underneath. */
export function AllocationBar({ segments, unit }: { segments: Segment[]; unit: string }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const visible = segments.filter((s) => s.value > 0);

  return (
    <div>
      <div className="flex h-7 gap-0.5" role="img" aria-label={visible.map((s) => `${s.label} ${pct(s.value / total)}`).join(", ")}>
        {visible.map((s) => (
          <div
            key={s.key}
            title={`${s.label}: ${fmt(Math.round(s.value))} ${unit} (${pct(s.value / total)})`}
            className={cn("h-full transition-[width] duration-300 first:rounded-s-xs last:rounded-e-xs", s.swatch)}
            style={{ width: `${(s.value / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-3 lg:grid-cols-5">
        {segments.map((s) => (
          <li key={s.key} className={cn("flex items-center gap-2", s.value === 0 && "opacity-40")}>
            <span aria-hidden className={cn("size-2.5 shrink-0", s.swatch)} />
            <span className="text-steel">{s.label}</span>
            <span className="num ms-auto text-concrete">{pct(s.value / total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
