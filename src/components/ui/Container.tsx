import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
  size?: "md" | "lg" | "xl";
} & Omit<ComponentPropsWithoutRef<T>, "as">;

const sizes = {
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
};

export function Container<T extends ElementType = "div">({
  as,
  size = "xl",
  className,
  ...props
}: ContainerProps<T>) {
  const Component = as ?? "div";
  return (
    <Component
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)}
      {...props}
    />
  );
}
