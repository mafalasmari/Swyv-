"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/FormField";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  defaultYardInputs,
  estimateYardSavings,
  formatCurrency,
  type YardInputs,
} from "@/lib/roi";

const fields: { key: Exclude<keyof YardInputs, "demurrageLevel">; label: string }[] = [
  { key: "gates", label: "Number of gates" },
  { key: "shiftsPerDay", label: "Shifts per day" },
  { key: "daysPerWeek", label: "Operating days per week" },
  { key: "spottersPerShift", label: "Spotters per shift" },
  { key: "checkInsPerDay", label: "Check-ins per day" },
  { key: "hourlyWage", label: "Blended hourly wage ($)" },
];

const limits: Partial<Record<keyof YardInputs, number>> = { daysPerWeek: 7, shiftsPerDay: 3 };

export function RoiCalculator() {
  const [inputs, setInputs] = useState<YardInputs>(defaultYardInputs);
  const [submitted, setSubmitted] = useState(false);
  const savings = useMemo(() => estimateYardSavings(inputs), [inputs]);

  const update = (key: keyof YardInputs, raw: string) => {
    const value = Math.max(0, Number(raw.replace(/[^\d.]/g, "")) || 0);
    const max = limits[key];
    setInputs((prev) => ({ ...prev, [key]: max ? Math.min(value, max) : value }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const breakdown = [
    { label: "Labor savings", hint: "Gate, traffic, dispatch, yard check", value: savings.labor },
    { label: "Spotter savings", hint: "Drivers and unit leases", value: savings.spotters },
    { label: "Detention & demurrage savings", value: savings.demurrage },
  ];
  const sliderFill = ((inputs.demurrageLevel - 1) / 9) * 100;

  return (
    <Section id="calculator" className="scroll-mt-20 bg-terminal-mist text-terminal-green">
      <SectionHeader eyebrow="Yard Efficiency Calculator" title="What's your yard costing you?" className="mb-12" />

      <div className="grid overflow-hidden rounded-md bg-white shadow-sm lg:grid-cols-2">
        <form className="flex flex-col gap-6 p-6 sm:p-10" onSubmit={(e) => e.preventDefault()}>
          <h3 className="text-2xl font-semibold">Tell us about your yard:</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map(({ key, label }) => (
              <InputField
                key={key}
                label={label}
                name={key}
                inputMode="decimal"
                value={String(inputs[key])}
                onChange={(e) => update(key, e.target.value)}
              />
            ))}
          </div>

          <label className="flex flex-col gap-3 text-sm">
            How significant are your annual detention and demurrage costs?
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={inputs.demurrageLevel}
              onChange={(e) => update("demurrageLevel", e.target.value)}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-terminal-green"
              style={{
                background: `linear-gradient(to right, var(--color-terminal-green) ${sliderFill}%, rgb(5 36 36 / 0.2) ${sliderFill}%)`,
              }}
            />
            <span className="flex justify-between font-mono text-xs opacity-70">
              <span>1 – Low</span>
              <span>5 – Medium</span>
              <span>10 – High</span>
            </span>
          </label>
        </form>

        <div className="flex flex-col gap-8 bg-terminal-green p-6 text-white sm:p-10">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase opacity-70">With Terminal your yard saves</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight text-terminal-lime sm:text-6xl" aria-live="polite">
              ${formatCurrency(savings.total)}
            </p>
            <p className="mt-2 text-sm opacity-80">Est. savings: {savings.percent}% per year</p>
          </div>

          <dl className="grid gap-4 border-t border-white/15 pt-6">
            {breakdown.map((item) => (
              <div key={item.label} className="flex items-baseline justify-between gap-4">
                <dt>
                  {item.label}
                  {item.hint && <span className="block text-xs opacity-60">{item.hint}</span>}
                </dt>
                <dd className="font-mono text-lg">${formatCurrency(item.value)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto border-t border-white/15 pt-6">
            {submitted ? (
              <p className="rounded-sm bg-white/10 p-4 text-sm">
                Thank you for submitting your data! A Terminal Yard Expert will be in touch within 1 business day to
                set up a cost savings consultation with you.
              </p>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <p className="font-semibold">Want to know more?</p>
                <p className="text-sm opacity-80">
                  Enter your work email below if you would like to run a custom ROI analysis with one of our yard
                  experts.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <InputField label="Work email" name="email" type="email" required className="flex-1" />
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs opacity-60">
        Figures are illustrative estimates based on industry averages, not a quote.
      </p>
    </Section>
  );
}
