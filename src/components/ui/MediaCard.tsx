import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";
import { SmartImage } from "./SmartImage";

type MediaCardProps = {
  image: string;
  imageAlt?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  footer?: ReactNode;
  className?: string;
  imageClassName?: string;
};

/** Image-topped card used for product paths, case studies and blog posts. */
export function MediaCard({
  image,
  imageAlt = "",
  eyebrow,
  title,
  description,
  footer,
  className,
  imageClassName,
}: MediaCardProps) {
  return (
    <article className={cn("flex h-full flex-col overflow-hidden rounded-md", className)}>
      <div className={cn("relative aspect-[16/10] overflow-hidden", imageClassName)}>
        <SmartImage
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {eyebrow && <Eyebrow className="opacity-70">{eyebrow}</Eyebrow>}
        <h3 className="text-xl font-semibold text-balance">{title}</h3>
        {description && <p className="leading-relaxed opacity-75">{description}</p>}
        {footer && <div className="mt-auto pt-4">{footer}</div>}
      </div>
    </article>
  );
}
