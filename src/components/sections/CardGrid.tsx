import { RevealGroup } from "@/components/ui/RevealGroup";
import { cn } from "@/lib/cn";
import { revealItem } from "@/lib/reveal";

export type Card = { id?: string; title: string; body: string; tag?: string };

/** Bordered data grid of cards with mono indices. Cells share hairlines, no gaps. */
export function CardGrid({ cards, columns = 3, muted }: { cards: Card[]; columns?: 2 | 3 | 4; muted?: boolean }) {
  return (
    <RevealGroup
      as="ul"
      wrap={false}
      className={cn(
        "grid border-t border-s border-rule sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
      )}
    >
      {cards.map((card, i) => (
        <li
          key={card.title}
          id={card.id}
          style={revealItem(i).style}
          className={cn(
            revealItem(i).className,
            "group flex scroll-mt-24 flex-col gap-3 border-e border-b border-rule p-6 transition-colors hover:bg-raised sm:p-7",
            muted && "text-fg/80",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="num text-xs text-muted group-hover:text-accent">{String(i + 1).padStart(2, "0")}</span>
            {card.tag && (
              <span className="border border-rule px-2 py-0.5 font-mono text-[10px] tracking-widest text-muted uppercase">
                {card.tag}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold">{card.title}</h3>
          <p className="text-sm leading-relaxed text-muted">{card.body}</p>
        </li>
      ))}
    </RevealGroup>
  );
}
