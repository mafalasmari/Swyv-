import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Shared control styling: flat, sharp, hairline border, red focus. */
export const controlClass =
  "h-11 w-full border border-line bg-ink px-3 text-sm text-concrete outline-none transition-colors placeholder:text-steel/70 hover:border-steel/60 focus:border-red aria-invalid:border-red";

export function FieldLabel({
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: ReactNode;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-2 text-sm", className)}>
      <span className="flex items-baseline justify-between gap-2 text-concrete/90">
        <span>
          {label}
          {required && (
            <span aria-hidden className="text-red">
              {" "}
              *
            </span>
          )}
        </span>
        {hint && <span className="num text-xs text-steel">{hint}</span>}
      </span>
      {children}
      {error && (
        <span role="alert" className="text-xs text-red-bright">
          {error}
        </span>
      )}
    </label>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClass, className)} {...props} />;
}

export function NumberInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      inputMode="decimal"
      dir="ltr"
      className={cn(controlClass, "num text-start", className)}
      {...props}
    />
  );
}

export function Select({
  className,
  options,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] }) {
  return (
    <select className={cn(controlClass, "cursor-pointer appearance-none pe-8", className)} {...props}>
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-panel">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea data-lenis-prevent className={cn(controlClass, "h-auto min-h-28 py-3", className)} {...props} />;
}

/** Range slider with a filled track in SWYV red. */
export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  display,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: ReactNode;
  display?: ReactNode;
}) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <label className="flex flex-col gap-3 text-sm">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-concrete/90">{label}</span>
        <span className="num text-concrete">{display ?? value}</span>
      </span>
      <input
        type="range"
        dir="ltr"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none accent-red [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-red"
        style={{ background: `linear-gradient(to right, var(--color-red) ${fill}%, var(--color-line) ${fill}%)` }}
      />
    </label>
  );
}

/** Switch-style checkbox. */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 border border-line bg-ink px-3 py-2.5 text-sm">
      <span className="text-concrete/90">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className="relative h-5 w-9 shrink-0 bg-line transition-colors peer-checked:bg-red peer-focus-visible:outline-2 peer-focus-visible:outline-red after:absolute after:top-0.5 after:start-0.5 after:size-4 after:bg-concrete after:transition-transform peer-checked:after:translate-x-4 rtl:peer-checked:after:-translate-x-4"
      />
    </label>
  );
}

/** Button group for picking one of a few options. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap border border-line">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 px-3 py-2 font-mono text-[11px] tracking-wider whitespace-nowrap uppercase transition-colors",
            o.value === value ? "bg-concrete text-night" : "text-steel hover:bg-panel hover:text-concrete",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
