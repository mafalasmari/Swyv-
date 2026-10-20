import type { SVGProps } from "react";
import type { SocialNetwork } from "@/lib/types";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const ChevronDownIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ArrowRightIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...stroke} {...props}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
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

const socialPaths: Record<SocialNetwork, string> = {
  linkedin:
    "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4V21H3V9.75Zm6.5 0h3.83v1.54h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.13V21h-4v-4.98c0-1.19-.02-2.72-1.66-2.72-1.66 0-1.92 1.3-1.92 2.63V21h-4V9.75Z",
  x: "M17.75 3h3.07l-6.71 7.67L22 21h-6.18l-4.84-6.33L5.44 21H2.37l7.18-8.2L2 3h6.33l4.38 5.79L17.75 3Zm-1.08 16.2h1.7L7.4 4.72H5.57l11.1 14.48Z",
  youtube:
    "M23 7.2a3 3 0 0 0-2.1-2.12C19.04 4.5 12 4.5 12 4.5s-7.04 0-8.9.58A3 3 0 0 0 1 7.2 31.3 31.3 0 0 0 .5 12a31.3 31.3 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.12c1.86.58 8.9.58 8.9.58s7.04 0 8.9-.58A3 3 0 0 0 23 16.8a31.3 31.3 0 0 0 .5-4.8 31.3 31.3 0 0 0-.5-4.8ZM9.75 15.02V8.98L15.5 12l-5.75 3.02Z",
  instagram:
    "M12 2.2c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16Zm0 4.86a4.94 4.94 0 1 0 0 9.88 4.94 4.94 0 0 0 0-9.88Zm0 8.14a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.14-9.5a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z",
};

export const SocialIcon = ({ network, ...props }: IconProps & { network: SocialNetwork }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d={socialPaths[network]} />
  </svg>
);
