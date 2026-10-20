import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";

export type ButtonProps = {
  href?: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-red text-white hover:bg-red-bright",
  secondary: "border border-concrete/30 text-concrete hover:border-concrete hover:bg-concrete/5",
  ghost: "text-steel hover:text-concrete",
  link: "text-red underline-offset-4 hover:underline",
};

const sizes = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-6 text-base",
};

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Single button primitive for links and form actions. Corners stay sharp by design. */
export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
    variant !== "link" && sizes[size],
    variants[variant],
    className,
  );

  if (!href) {
    return (
      <button type={type} onClick={onClick} disabled={disabled} className={classes}>
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
