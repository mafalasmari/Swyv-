import { StatusTag, type Tone } from "@/components/ui/StatusTag";
import { Chevron } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type BoardRow = { id: string; route: string; meta: string; status: string; tone: string; dir: string };

/** Compact operations board shown in the home hero (sample identifiers). */
export function OpsBoard({
  title,
  sample,
  rows,
  inboundLabel,
  returnLabel,
}: {
  title: string;
  sample: string;
  rows: BoardRow[];
  inboundLabel: string;
  returnLabel: string;
}) {
  return (
    <div className="border border-line bg-panel/90 backdrop-blur">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <span className="font-mono text-xs tracking-[0.14em] text-steel uppercase">{title}</span>
        <StatusTag tone="live" pulse>
          {sample}
        </StatusTag>
      </div>
      <ul>
        {rows.map((row) => (
          <li key={row.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line px-4 py-3.5 last:border-0">
            <Chevron
              direction={row.dir === "up" ? "up" : "down"}
              aria-label={row.dir === "up" ? returnLabel : inboundLabel}
              role="img"
              className={cn("size-2.5", row.dir === "up" ? "text-pending" : "text-red")}
            />
            <div className="min-w-0">
              <p className="num text-sm text-concrete">{row.id}</p>
              <p className="truncate text-xs text-steel">
                {row.route} · {row.meta}
              </p>
            </div>
            <StatusTag tone={row.tone as Tone}>{row.status}</StatusTag>
          </li>
        ))}
      </ul>
    </div>
  );
}
