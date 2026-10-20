import { CheckIcon, MinusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function CheckList({ items, negative, className }: { items: string[]; negative?: boolean; className?: string }) {
  const Icon = negative ? MinusIcon : CheckIcon;
  return (
    <ul className={cn("grid gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <Icon className={cn("mt-0.5 size-5 shrink-0", negative ? "text-steel" : "text-red")} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
