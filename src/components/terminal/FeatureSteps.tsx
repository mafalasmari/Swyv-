"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Step = {
  title: string;
  description: string;
  caption: string;
  video: string;
};

type FeatureStepsProps = {
  eyebrow: string;
  title: string;
  intro: string;
  steps: Step[];
};

/** Numbered benefit list paired with a video that follows the active step. */
export function FeatureSteps({ eyebrow, title, intro, steps }: FeatureStepsProps) {
  const [active, setActive] = useState(0);
  const go = (delta: number) => setActive((i) => (i + delta + steps.length) % steps.length);
  const current = steps[active];

  return (
    <Section className="bg-terminal-green text-white">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={intro}
        eyebrowClassName="text-terminal-lime"
        className="mb-12 lg:mb-16"
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ol className="flex flex-col gap-2">
          {steps.map((step, i) => (
            <li key={step.title}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-current={i === active}
                className={cn(
                  "flex w-full gap-5 rounded-md p-5 text-left transition-colors",
                  i === active ? "bg-white/10" : "opacity-60 hover:opacity-100",
                )}
              >
                <span className="font-mono text-sm text-terminal-lime">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex flex-col gap-2">
                  <span className="text-xl font-semibold">{step.title}</span>
                  <span
                    className={cn(
                      "leading-relaxed opacity-80",
                      i === active ? "block" : "hidden sm:block sm:line-clamp-1",
                    )}
                  >
                    {step.description}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ol>

        <figure className="flex flex-col gap-4">
          <div className="relative aspect-video overflow-hidden rounded-md bg-black">
            <video
              key={current.video}
              src={current.video}
              className="size-full animate-fade-up object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          </div>
          <figcaption className="flex items-center justify-between gap-4">
            <span className="text-sm opacity-80">{current.caption}</span>
            <span className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous step"
                className="grid size-10 place-items-center rounded-full border border-white/30 hover:border-white"
              >
                <ArrowLeftIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next step"
                className="grid size-10 place-items-center rounded-full border border-white/30 hover:border-white"
              >
                <ArrowRightIcon className="size-4" />
              </button>
            </span>
          </figcaption>
        </figure>
      </div>
    </Section>
  );
}
