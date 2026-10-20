import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "lime"
  | "orange"
  | "dark"
  | "light"
  | "outline-light"
  | "outline-dark"
  | "link";

export type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const variants: Record<ButtonVariant, string> = {
  lime: "bg-terminal-lime text-terminal-green hover:bg-white",
  orange: "bg-optoro-orange text-white hover:bg-optoro-graphite",
  dark: "bg-terminal-green text-white hover:bg-black",
  light: "bg-white text-optoro-orange hover:bg-optoro-mist",
  "outline-light": "border border-white/40 text-white hover:border-white hover:bg-white/10",
  "outline-dark": "border border-current hover:bg-black/5",
  link: "h-auto! px-0! underline-offset-4 hover:underline",
};

const sizes = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** One button style for links and form actions alike. */
export function Button({
  href,
  children,
  variant = "lime",
  size = "md",
  className,
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-medium whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current",
    sizes[size],
    variants[variant],
    className,
  );

  if (!href) {
    return (
      <button type={type} onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
