"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { observeOnce } from "@/lib/observeOnce";

type RevealProps = {
  children: ReactNode;
  /** Extra delay in ms before the element rises in. */
  delay?: number;
  /** Reveal only the first time (default). With false, it hides again when it leaves. */
  once?: boolean;
  threshold?: number;
  className?: string;
  as?: ElementType;
  id?: string;
};

/**
 * Rises and fades an element in when it scrolls into view (IntersectionObserver).
 * Hidden only when scripts run and motion is allowed; see .reveal in globals.css.
 */
export function Reveal({
  children,
  delay,
  once = true,
  threshold = 0.15,
  className,
  as: Tag = "div",
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (once) return observeOnce(el, () => el.classList.add("is-revealed"), threshold);
    const io = new IntersectionObserver(([entry]) => el.classList.toggle("is-revealed", entry.isIntersecting), {
      threshold,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold]);

  const style = delay ? ({ transitionDelay: `${delay}ms` } as CSSProperties) : undefined;
  return (
    <Tag ref={ref} id={id} className={cn("reveal", className)} style={style}>
      {children}
    </Tag>
  );
}
