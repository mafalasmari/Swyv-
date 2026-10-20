import { cn } from "@/lib/cn";

export type Card = { id?: string; title: string; body: string; tag?: string };

/** Bordered data grid of cards with mono indices. Cells share hairlines, no gaps. */
export function CardGrid({ cards, columns = 3, muted }: { cards: Card[]; columns?: 2 | 3 | 4; muted?: boolean }) {
  return (
    <ul
      className={cn(
        "grid border-t border-s border-line sm:grid-cols-2",
        columns === 3 && "lg:grid-cols-3",
        columns === 4 && "lg:grid-cols-4",
      )}
    >
      {cards.map((card, i) => (
        <li
          key={card.title}
          id={card.id}
          className={cn(
            "group flex scroll-mt-24 flex-col gap-3 border-e border-b border-line p-6 transition-colors hover:bg-panel sm:p-7",
            muted && "text-concrete/80",
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="num text-xs text-steel group-hover:text-red">{String(i + 1).padStart(2, "0")}</span>
            {card.tag && (
              <span className="border border-line px-2 py-0.5 font-mono text-[10px] tracking-widest text-steel uppercase">
                {card.tag}
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold">{card.title}</h3>
          <p className="text-sm leading-relaxed text-steel">{card.body}</p>
        </li>
      ))}
    </ul>
  );
}
