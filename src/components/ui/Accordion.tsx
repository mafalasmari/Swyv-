import type { FaqItem } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ChevronDownIcon } from "./icons";

type AccordionProps = {
  items: FaqItem[];
  className?: string;
};

/** Native <details> accordion: accessible and works without JavaScript. */
export function Accordion({ items, className }: AccordionProps) {
  return (
    <div className={cn("divide-y divide-current/15 border-y border-current/15", className)}>
      {items.map((item, i) => (
        <details key={item.question} className="group py-5" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left text-lg font-medium">
            {item.question}
            <ChevronDownIcon className="mt-1 size-5 shrink-0 transition-transform duration-300 group-open:rotate-180" />
          </summary>
          <p className="mt-3 max-w-3xl leading-relaxed opacity-75">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
