import { cn } from "@/lib/cn";
import { Chevron } from "./icons";

type LogoProps = {
  className?: string;
  /** Show the "Logistics Services Co." line under the wordmark. */
  withTagline?: boolean;
};

/** Swyv wordmark: Poppins ExtraBold in SWYV Red with the V chevron. */
export function Logo({ className, withTagline }: LogoProps) {
  return (
    <span dir="ltr" className={cn("inline-flex flex-col leading-none", className)}>
      <span className="inline-flex items-end gap-0.5 font-brand text-[1.75em] font-extrabold tracking-[-0.045em] text-red">
        Swyv
        <Chevron direction="down" className="mb-[0.18em] size-[0.42em]" />
      </span>
      {withTagline && (
        <span className="mt-1.5 font-brand text-[0.55em] font-medium tracking-[0.2em] text-fg uppercase">
          Logistics Services Co.
        </span>
      )}
    </span>
  );
}
