import type { LogoAsset } from "@/lib/types";
import { cn } from "@/lib/cn";
import { SmartImage } from "./SmartImage";

type LogoMarqueeProps = {
  logos: LogoAsset[];
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
  logoClassName?: string;
};

/** Infinite, CSS-only scrolling strip of logos. Pauses on hover. */
export function LogoMarquee({ logos, duration = 40, className, logoClassName }: LogoMarqueeProps) {
  // The list is rendered twice so the -50% translate loops seamlessly.
  const track = [...logos, ...logos];

  return (
    <div
      className={cn(
        "group relative overflow-hidden mask-x-from-85% mask-x-to-100%",
        className,
      )}
      style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
    >
      <ul className="flex w-max animate-marquee items-center gap-12 group-hover:[animation-play-state:paused] sm:gap-16">
        {track.map((logo, i) => (
          <li key={`${logo.src}-${i}`} aria-hidden={i >= logos.length} className="shrink-0">
            <SmartImage
              src={logo.src}
              alt={logo.alt}
              width={160}
              height={64}
              className={cn("h-8 w-auto object-contain sm:h-10", logoClassName)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
