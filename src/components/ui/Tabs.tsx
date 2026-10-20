"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabItem = { id: string; label: string; content: ReactNode };

/** Accessible tab list; arrow keys follow the document direction. */
export function Tabs({ items, className }: { items: TabItem[]; className?: string }) {
  const [active, setActive] = useState(0);
  const baseId = useId();

  const focusTab = (index: number) => {
    const next = (index + items.length) % items.length;
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  return (
    <div className={className}>
      <div role="tablist" className="flex overflow-x-auto border-b border-line [scrollbar-width:none]">
        {items.map((item, i) => (
          <button
            key={item.id}
            id={`${baseId}-tab-${i}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${baseId}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
              if (e.key === "ArrowRight") focusTab(rtl ? i - 1 : i + 1);
              if (e.key === "ArrowLeft") focusTab(rtl ? i + 1 : i - 1);
            }}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-4 py-3 font-mono text-xs tracking-widest uppercase transition-colors",
              i === active ? "border-red text-concrete" : "border-transparent text-steel hover:text-concrete",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, i) => (
        <div
          key={item.id}
          id={`${baseId}-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${i}`}
          hidden={i !== active}
          className="animate-fade-up pt-8"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
