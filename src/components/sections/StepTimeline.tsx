import type { ReactNode } from "react";
import { Chevron } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type Step = { title: string; body: string; dir?: string; extra?: ReactNode };

/**
 * Numbered process list. The chevron marks the flow direction:
 * down = inbound goods, up = returns.
 */
export function StepTimeline({ steps, columns = false }: { steps: Step[]; columns?: boolean }) {
  return (
    <ol className={cn("grid border-t border-s border-rule", columns && "sm:grid-cols-2 lg:grid-cols-4")}>
      {steps.map((step, i) => (
        <li key={step.title} className="flex flex-col gap-4 border-e border-b border-rule p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="num text-sm text-red">{String(i + 1).padStart(2, "0")}</span>
            {step.dir && (
              <Chevron
                direction={step.dir === "up" ? "up" : "down"}
                className={cn("size-3", step.dir === "up" ? "text-pending" : "text-red")}
              />
            )}
          </div>
          <h3 className="text-xl font-semibold">{step.title}</h3>
          <p className="leading-relaxed text-muted">{step.body}</p>
          {step.extra}
        </li>
      ))}
    </ol>
  );
}
