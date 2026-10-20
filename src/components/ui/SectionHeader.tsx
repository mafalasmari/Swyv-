import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
  eyebrowClassName?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
  eyebrowClassName,
}: SectionHeaderProps) {
  return (
    <header
      className={cn(
        "flex max-w-3xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow className={eyebrowClassName}>{eyebrow}</Eyebrow>}
      <Heading className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
        {title}
      </Heading>
      {description && (
        <p className="text-base leading-relaxed text-pretty opacity-80 sm:text-lg">{description}</p>
      )}
    </header>
  );
}
