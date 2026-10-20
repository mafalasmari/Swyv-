import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Tone = "ok" | "warn" | "bad" | "info" | "idle" | "live";

const tones: Record<Tone, string> = {
  ok: "text-delivered border-delivered/40 bg-delivered/10",
  warn: "text-pending border-pending/40 bg-pending/10",
  bad: "text-red-bright border-red/50 bg-red/10",
  info: "text-route-restock border-route-restock/40 bg-route-restock/10",
  idle: "text-steel border-line bg-asphalt/40",
  live: "text-delivered border-delivered/40 bg-delivered/10",
};

/** Compact mono status chip. The dot pulses for live states. */
export function StatusTag({
  tone = "idle",
  children,
  pulse,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 border px-2 font-mono text-[11px] font-medium tracking-wider whitespace-nowrap uppercase",
        tones[tone],
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full bg-current", pulse && "animate-pulse-dot")} />
      {children}
    </span>
  );
}
