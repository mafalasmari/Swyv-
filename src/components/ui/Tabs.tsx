"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  variant?: "underline" | "pill";
  className?: string;
  listClassName?: string;
};

const tabStyles = {
  underline: {
    list: "gap-6 border-b border-current/15",
    tab: "-mb-px border-b-2 py-3",
    active: "border-current",
    idle: "border-transparent opacity-60 hover:opacity-100",
  },
  pill: {
    list: "flex-wrap gap-2",
    tab: "rounded-sm border px-4 py-2",
    active: "border-current bg-current/10",
    idle: "border-current/20 opacity-70 hover:opacity-100",
  },
};

/** Accessible tab list (arrow keys move between tabs). */
export function Tabs({
  items,
  variant = "underline",
  className,
  listClassName,
}: TabsProps) {
  const styles = tabStyles[variant];
  const [active, setActive] = useState(0);
  const baseId = useId();

  const focusTab = (index: number) => {
    const next = (index + items.length) % items.length;
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        className={cn("flex overflow-x-auto [scrollbar-width:none]", styles.list, listClassName)}
      >
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
              if (e.key === "ArrowRight") focusTab(i + 1);
              if (e.key === "ArrowLeft") focusTab(i - 1);
            }}
            className={cn(
              "shrink-0 font-mono text-xs tracking-widest uppercase transition",
              styles.tab,
              i === active ? styles.active : styles.idle,
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
          className="animate-fade-up"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
