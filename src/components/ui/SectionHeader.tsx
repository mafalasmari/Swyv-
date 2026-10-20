import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

type SectionHeaderProps = {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  /** Right-aligned slot (in LTR) for a link or action. */
  action?: ReactNode;
};

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  as: Heading = "h2",
  className,
  action,
}: SectionHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="flex max-w-3xl flex-col gap-4">
        {eyebrow && <Eyebrow index={index}>{eyebrow}</Eyebrow>}
        <Heading
          className={cn(
            "font-semibold tracking-tight text-balance",
            Heading === "h1" ? "text-4xl leading-[1.1] sm:text-5xl lg:text-6xl" : "text-3xl leading-tight sm:text-4xl",
          )}
        >
          {title}
        </Heading>
        {description && <p className="text-base leading-relaxed text-pretty text-steel sm:text-lg">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
