import type { SocialLink } from "@/lib/types";
import { cn } from "@/lib/cn";
import { SocialIcon } from "./icons";

export function SocialLinks({ links, className }: { links: SocialLink[]; className?: string }) {
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {links.map(({ network, href }) => (
        <li key={network}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={network}
            className="flex size-10 items-center justify-center rounded-full border border-current/20 transition-colors hover:border-current"
          >
            <SocialIcon network={network} className="size-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
