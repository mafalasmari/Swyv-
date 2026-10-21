"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { CarouselScene, type SceneKey } from "./CarouselScenes";

export type CarouselCard = { number: string; title: string; body: string; href: string; scene: SceneKey };
type CarouselTab = { label: string; cards: CarouselCard[] };

/**
 * One row of three cards: the open one takes 60% of the row and shows its drawing,
 * copy and link; the others shrink to 20% and show their number and title. Below
 * 768px the row becomes a plain swipeable strip of full cards (no expanding), and
 * only then is it marked data-lenis-prevent so Lenis leaves the sideways scroll alone.
 */
function CardRow({ cards, more }: { cards: CarouselCard[]; more: string }) {
  // Each tab keeps its own open card: Tabs only hides inactive panels, so switching
  // away and back shows the card that was open (the first one until another is picked).
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  useEffect(() => {
    const mq = window.matchMedia("(width < 48rem)");
    const apply = () => listRef.current?.toggleAttribute("data-lenis-prevent", mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <ul ref={listRef} className="carousel-list">
      {cards.map((card, i) => {
        const open = i === active;
        return (
          <li key={card.number} className="carousel-card section-dark" data-expanded={open || undefined}>
            <div aria-hidden="true" className="card-bg">
              <CarouselScene scene={card.scene} className="size-full" />
            </div>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`${id}-${i}`}
              onClick={() => setActive(i)}
              className="card-collapsed"
            >
              <span className="num self-start text-sm text-accent">{card.number}</span>
              <span className="text-lg leading-snug font-semibold text-balance">{card.title}</span>
            </button>
            <div id={`${id}-${i}`} className="card-open">
              <CarouselScene scene={card.scene} className="h-44 w-full shrink-0 sm:h-48" />
              <span className="num self-start text-sm text-accent">{card.number}</span>
              <h3 className="text-2xl leading-tight font-semibold text-balance">{card.title}</h3>
              <p className="max-w-xl leading-relaxed text-pretty text-muted">{card.body}</p>
              <Button href={card.href} size="sm" className="mt-auto self-start">
                {more}
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Tabs above rows of expanding cards (see CardRow). */
export function ExpandableCarousel({ tabs, more }: { tabs: CarouselTab[]; more: string }) {
  return (
    <Tabs
      items={tabs.map((tab, i) => ({
        id: String(i),
        label: tab.label,
        content: <CardRow cards={tab.cards} more={more} />,
      }))}
    />
  );
}
