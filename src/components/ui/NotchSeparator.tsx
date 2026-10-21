import { cn } from "@/lib/cn";

export type SectionTone = "dark" | "light" | "muted";

const TONE_COLOR: Record<SectionTone, string> = {
  dark: "var(--swyv-black)",
  light: "var(--swyv-concrete)",
  muted: "var(--swyv-asphalt)",
};

type NotchSeparatorProps = {
  /** Tone of the section above; its colour dips into the next section. */
  from: SectionTone;
  /** Tone of the section below. */
  to: SectionTone;
  className?: string;
};

/**
 * Curved hand-off between two sections of different tone: the upper section's
 * colour dips down in a smooth notch at the centre of the edge (~3rem deep).
 * The notch keeps a fixed width so the curve never stretches on wide screens,
 * and it is mirrored in RTL.
 */
export function NotchSeparator({ from, to, className }: NotchSeparatorProps) {
  return (
    <div
      aria-hidden="true"
      role="presentation"
      className={cn("relative flex h-12 justify-center overflow-hidden", className)}
      style={{ background: TONE_COLOR[to] }}
    >
      <svg
        viewBox="0 0 480 48"
        preserveAspectRatio="none"
        className="-mt-px h-[calc(100%+1px)] w-[min(30rem,72vw)] shrink-0 rtl:-scale-x-100"
      >
        {/* Overlaps 1px upward so no hairline shows between the sections. */}
        <path
          d="M0 -1 H480 V0 C412 0 388 48 316 48 H164 C92 48 68 0 0 0 Z"
          fill={TONE_COLOR[from]}
        />
      </svg>
    </div>
  );
}
