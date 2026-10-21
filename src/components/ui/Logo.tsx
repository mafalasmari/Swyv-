import { cn } from "@/lib/cn";
import { CHEVRON_PATH, GLYPHS, LETTER_X, WORDMARK_VIEWBOX } from "@/lib/wordmark";

type LogoProps = {
  /** Sets the rendered width (e.g. "w-[104px] xl:w-[140px]"); height follows the viewBox. */
  className?: string;
  /** Show the "Logistics Services Co." line under the wordmark. */
  withTagline?: boolean;
  taglineClassName?: string;
};

/** Swyv wordmark as a single SVG: Poppins ExtraBold outlines in SWYV Red with the V chevron. */
export function Logo({ className, withTagline, taglineClassName }: LogoProps) {
  return (
    <span dir="ltr" data-logo className={cn("inline-flex flex-col", className)}>
      <svg viewBox={WORDMARK_VIEWBOX} role="img" aria-label="Swyv" className="block h-auto w-full text-red">
        {GLYPHS.map((g, i) => (
          <path key={g.char} d={g.d} transform={`translate(${LETTER_X[i]} 0)`} fill="currentColor" />
        ))}
        <path d={CHEVRON_PATH} fill="currentColor" />
      </svg>
      {withTagline && (
        <span
          className={cn(
            "mt-[0.6em] font-brand font-medium tracking-[0.2em] whitespace-nowrap text-fg uppercase",
            taglineClassName,
          )}
        >
          Logistics Services Co.
        </span>
      )}
    </span>
  );
}
