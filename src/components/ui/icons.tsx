import type { SVGProps } from "react";
import { cn } from "@/lib/cn";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
} as const;

/**
 * The V chevron is the system's graphic device:
 * inbound = down, returns = up.
 */
export const Chevron = ({
  direction = "down",
  className,
  ...props
}: IconProps & { direction?: "down" | "up" }) => (
  <svg viewBox="0 0 12 10" aria-hidden className={cn(direction === "up" && "rotate-180", className)} {...props}>
    <path d="M0 0h3.6L6 4.2 8.4 0H12L6 10z" fill="currentColor" />
  </svg>
);

export const ChevronDownIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/** Points to the reading direction's "forward" — flips automatically in RTL. */
export const ArrowIcon = ({ className, ...props }: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden className={cn("rtl:-scale-x-100", className)} {...stroke} {...props}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const MenuIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);

export const MinusIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
    <path d="M6 12h12" />
  </svg>
);

export const SortIcon = ({ dir, ...props }: IconProps & { dir: "asc" | "desc" | null }) => (
  <svg viewBox="0 0 12 12" aria-hidden {...props}>
    <path d="M6 1 9 5H3z" fill="currentColor" opacity={dir === "asc" ? 1 : 0.3} />
    <path d="M6 11 3 7h6z" fill="currentColor" opacity={dir === "desc" ? 1 : 0.3} />
  </svg>
);

export const GlobeIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z" />
  </svg>
);
