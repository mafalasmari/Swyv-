import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  containerClassName?: string;
  spacing?: "sm" | "md" | "lg";
};

const spacings = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-32",
};

/** Vertical rhythm + centered container for every page section. */
export function Section({
  className,
  containerClassName,
  spacing = "md",
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn(spacings[spacing], className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
