import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** KPI cell: mono label on top, large tabular number, optional note. */
export function Stat({
  label,
  value,
  note,
  accent,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  note?: ReactNode;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2 border border-line bg-panel p-4 sm:p-5", className)}>
      <span className="font-mono text-[11px] tracking-[0.14em] text-steel uppercase">{label}</span>
      <span className={cn("num text-2xl font-medium sm:text-3xl", accent ? "text-red-bright" : "text-concrete")}>
        {value}
      </span>
      {note && <span className="text-xs text-steel">{note}</span>}
    </div>
  );
}
