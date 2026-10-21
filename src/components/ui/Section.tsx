import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import type { SectionTone } from "./NotchSeparator";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  containerClassName?: string;
  spacing?: "sm" | "md" | "lg";
  /** Draws the hairline divider that separates stacked sections of the same tone. */
  divided?: boolean;
  /** Applies .section-dark / -light / -muted; toned sections are separated by NotchSeparator instead of a hairline. */
  tone?: Exclude<SectionTone, "red">;
};

const spacings = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-32",
};

export function Section({
  className,
  containerClassName,
  spacing = "md",
  divided,
  tone,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        spacings[spacing],
        tone && `section-${tone}`,
        (divided ?? !tone) && "border-t border-rule",
        className,
      )}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
