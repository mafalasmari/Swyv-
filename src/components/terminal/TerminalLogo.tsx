import { cn } from "@/lib/cn";

export function TerminalLogo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 text-xl font-semibold tracking-tight", className)}>
      <span aria-hidden className="grid size-7 place-items-center rounded-sm bg-terminal-lime text-sm font-bold text-terminal-green">
        T
      </span>
      Terminal
    </span>
  );
}
