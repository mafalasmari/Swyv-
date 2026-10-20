"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type HeroProps = {
  headlines: string[];
  video: string;
  /** Milliseconds each headline stays on screen. */
  interval?: number;
};

export function Hero({ headlines, video, interval = 4000 }: HeroProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % headlines.length), interval);
    return () => clearInterval(id);
  }, [headlines.length, interval]);

  return (
    <section className="relative -mt-16 flex min-h-svh items-end overflow-hidden bg-terminal-green text-white lg:-mt-20">
      <video
        className="absolute inset-0 size-full object-cover opacity-60"
        src={video}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-terminal-green via-terminal-green/40 to-transparent" />

      <Container className="relative pt-32 pb-16 sm:pb-24">
        <h1 className="sr-only">{headlines.join(" ")}</h1>
        <div aria-hidden className="grid max-w-4xl">
          {headlines.map((headline, i) => (
            <p
              key={headline}
              className={cn(
                "col-start-1 row-start-1 text-4xl leading-[1.05] font-semibold tracking-tight text-balance transition-all duration-700 sm:text-6xl lg:text-7xl",
                i === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              {headline}
            </p>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="#contact" size="lg">
            Request a demo
          </Button>
          <Button href="#calculator" variant="outline-light" size="lg">
            Calculate your savings
          </Button>
        </div>

        <div className="mt-12 flex gap-2" aria-hidden>
          {headlines.map((headline, i) => (
            <span
              key={headline}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                i === index ? "w-10 bg-terminal-lime" : "w-4 bg-white/30",
              )}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
