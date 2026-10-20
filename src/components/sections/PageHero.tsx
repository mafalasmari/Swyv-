import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Optional technical panel shown beside the copy on large screens. */
  aside?: ReactNode;
  size?: "lg" | "md";
};

/** Top-of-page block on the hairline grid, shared by every page. */
export function PageHero({ eyebrow, title, description, actions, aside, size = "md" }: PageHeroProps) {
  return (
    <section className="bg-grid relative overflow-hidden border-b border-line">
      <div aria-hidden className="absolute inset-y-0 start-0 w-px bg-red/60" />
      <Container
        className={cn(
          "grid gap-12",
          size === "lg" ? "py-16 sm:py-24 lg:py-28" : "py-14 sm:py-20",
          Boolean(aside) && "lg:grid-cols-[1.1fr_1fr] lg:items-center",
        )}
      >
        <div className="flex flex-col gap-6">
          <Eyebrow index="SWYV">{eyebrow}</Eyebrow>
          <h1
            className={cn(
              "max-w-4xl font-semibold tracking-tight text-balance",
              size === "lg" ? "text-4xl leading-[1.08] sm:text-5xl lg:text-6xl" : "text-3xl leading-tight sm:text-5xl",
            )}
          >
            {title}
          </h1>
          {description && <p className="max-w-2xl text-lg leading-relaxed text-pretty text-steel">{description}</p>}
          {actions && <div className="mt-2 flex flex-col gap-3 sm:flex-row">{actions}</div>}
        </div>
        {aside}
      </Container>
    </section>
  );
}
