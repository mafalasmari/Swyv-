import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SmartImage } from "./SmartImage";

type MediaTextProps = {
  image: string;
  imageAlt?: string;
  /** Places the image on the right on large screens. */
  reverse?: boolean;
  children: ReactNode;
  className?: string;
  imageClassName?: string;
};

/** Two-column image + copy row that stacks on mobile. */
export function MediaText({
  image,
  imageAlt = "",
  reverse,
  children,
  className,
  imageClassName,
}: MediaTextProps) {
  return (
    <div className={cn("grid items-center gap-10 lg:grid-cols-2 lg:gap-16", className)}>
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden rounded-md",
          reverse && "lg:order-last",
          imageClassName,
        )}
      >
        <SmartImage
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}
