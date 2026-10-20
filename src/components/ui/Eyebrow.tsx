import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Monospace index label, e.g. "01 · THE PROBLEM". */
export function Eyebrow({
  index,
  children,
  className,
}: {
  index?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("flex items-center gap-3 font-mono text-xs tracking-[0.16em] text-steel uppercase", className)}>
      {index && <span className="text-red">{index}</span>}
      {index && <span aria-hidden className="h-px w-6 bg-line" />}
      <span>{children}</span>
    </p>
  );
}
