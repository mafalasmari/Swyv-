"use client";

import { useState, type ReactNode } from "react";
import { savingsCopy } from "@/content/tools";
import type { Locale } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { FieldLabel, NumberInput } from "@/components/ui/controls";
import { fmt, sar } from "@/lib/format";
import { estimateSavings, type SavingsInput } from "@/lib/savings";

const FIELDS: { key: keyof SavingsInput; min: number; max: number }[] = [
  { key: "branches", min: 1, max: 500 },
  { key: "deliveriesPerWeek", min: 1, max: 14 },
  { key: "returnPickupsPerMonth", min: 0, max: 1000 },
  { key: "costPerTrip", min: 0, max: 10000 },
];

export function SavingsCalculator({ locale }: { locale: Locale }) {
  const copy = localize(savingsCopy, locale);
  const [input, setInput] = useState<SavingsInput>({
    branches: 12,
    deliveriesPerWeek: 3,
    returnPickupsPerMonth: 20,
    costPerTrip: 450,
  });
  const result = estimateSavings(input);

  const update = (key: keyof SavingsInput, raw: string, min: number, max: number) => {
    const value = Math.min(max, Math.max(min, Number(raw) || 0));
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid border border-line lg:grid-cols-[1fr_1.1fr]">
      <form className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8" onSubmit={(e) => e.preventDefault()}>
        {FIELDS.map(({ key, min, max }) => (
          <FieldLabel key={key} label={copy.inputs[key]}>
            <NumberInput
              name={key}
              min={min}
              max={max}
              value={input[key]}
              onChange={(e) => update(key, e.target.value, min, max)}
            />
          </FieldLabel>
        ))}
        <p className="text-xs leading-relaxed text-steel sm:col-span-2">{copy.formula}</p>
      </form>

      <div className="flex flex-col border-t border-line bg-panel lg:border-s lg:border-t-0" aria-live="polite">
        <Output label={copy.outputs.tripsSaved} value={<AnimatedNumber value={result.tripsSaved} format={fmt} />} />
        <Output label={copy.outputs.monthly} value={<AnimatedNumber value={result.monthly} format={sar} />} />
        <Output label={copy.outputs.annual} value={<AnimatedNumber value={result.annual} format={sar} />} accent />
        <p className="mt-auto p-6 text-xs text-steel sm:px-8">{copy.note}</p>
      </div>
    </div>
  );
}

function Output({ label, value, accent }: { label: string; value: ReactNode; accent?: boolean }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-6 py-5 sm:px-8">
      <span className="text-sm text-steel">{label}</span>
      <span className={accent ? "num text-3xl text-red-bright sm:text-4xl" : "num text-2xl text-concrete"}>{value}</span>
    </div>
  );
}
