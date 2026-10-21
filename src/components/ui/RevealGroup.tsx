"use client";

import { Children, useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { observeOnce } from "@/lib/observeOnce";
import { REVEAL_MAX, revealItem } from "@/lib/reveal";

type RevealGroupProps = {
  children: ReactNode;
  /** Delay between items, in ms. */
  stagger?: number;
  /** Items after this many share the last delay, so long lists never lag. */
  max?: number;
  className?: string;
  as?: ElementType;
  /**
   * By default each child is wrapped in a div.reveal-item. Lists (ul/ol) pass false
   * and give their own <li> the reveal-item class and --i index (see revealItem),
   * so the list markup stays valid.
   */
  wrap?: boolean;
};

/** Reveals its children one after another when the group scrolls into view. */
export function RevealGroup({
  children,
  stagger = 70,
  max = REVEAL_MAX,
  className,
  as: Tag = "div",
  wrap = true,
}: RevealGroupProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observeOnce(el, () => el.classList.add("is-revealed"));
  }, []);

  return (
    <Tag ref={ref} data-reveal-group className={className} style={{ "--stagger": `${stagger}ms` } as CSSProperties}>
      {wrap ? Children.map(children, (child, i) => <div {...revealItem(i, max)}>{child}</div>) : children}
    </Tag>
  );
}
