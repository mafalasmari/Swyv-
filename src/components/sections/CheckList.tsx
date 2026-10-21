import { CheckIcon, MinusIcon } from "@/components/ui/icons";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { cn } from "@/lib/cn";
import { revealItem } from "@/lib/reveal";

export function CheckList({ items, negative, className }: { items: string[]; negative?: boolean; className?: string }) {
  const Icon = negative ? MinusIcon : CheckIcon;
  return (
    <RevealGroup as="ul" wrap={false} className={cn("grid gap-3", className)}>
      {items.map((item, i) => (
        <li key={item} style={revealItem(i).style} className={cn(revealItem(i).className, "flex items-start gap-3")}>
          <Icon className={cn("mt-0.5 size-5 shrink-0", negative ? "text-muted" : "text-red")} />
          <span>{item}</span>
        </li>
      ))}
    </RevealGroup>
  );
}
