import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Small uppercase label that sits above section titles. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-xs tracking-[0.18em] uppercase", className)}>{children}</p>
  );
}
