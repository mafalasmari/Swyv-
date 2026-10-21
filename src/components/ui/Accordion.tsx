import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type AccordionItem = { id?: string; question: string; answer: ReactNode };

/** Native <details> accordion: accessible and works without JavaScript. */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  return (
    <div className={cn("border-t border-rule", className)}>
      {items.map((item, i) => (
        <details key={item.question} id={item.id} className="group border-b border-rule" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-start gap-4 py-5 text-start text-lg font-medium hover:text-accent">
            <span className="num mt-1 shrink-0 text-xs text-red">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex-1">{item.question}</span>
            <span aria-hidden className="mt-1 font-mono text-muted transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="max-w-3xl ps-9 pb-6 leading-relaxed text-muted">{item.answer}</div>
        </details>
      ))}
    </div>
  );
}
