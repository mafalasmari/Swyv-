"use client";

import { useMemo, useState } from "react";
import { engineCopy, simulatorCopy } from "@/content/tools";
import type { Locale } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { Segmented, Slider, Toggle } from "@/components/ui/controls";
import { Stat } from "@/components/ui/Stat";
import { StatusTag } from "@/components/ui/StatusTag";
import type { Objectives } from "@/lib/disposition";
import { fmt, sar } from "@/lib/format";
import { ROUTE_META, ROUTES } from "@/lib/returns";
import { SECTORS, STRATEGIES, simulate, type Sector } from "@/lib/simulator";
import { AllocationBar } from "./AllocationBar";
import { LineChart } from "./LineChart";

const BASELINE_COLOR = "var(--color-steel)";
const SWYV_COLOR = "var(--color-red-bright)";

export function DecisionSimulator({ locale }: { locale: Locale }) {
  const copy = localize(simulatorCopy, locale);
  const weightLabels = localize(engineCopy.weights, locale);
  const l = (tx: { ar: string; en: string }) => tx[locale];

  const [sector, setSector] = useState<Sector>("fmcg");
  const [units, setUnits] = useState(12000);
  const [unitValue, setUnitValue] = useState(25);
  const [branches, setBranches] = useState(12);
  const [backhaul, setBackhaul] = useState(true);
  const [supplier, setSupplier] = useState(true);
  const [strategy, setStrategy] = useState("balanced");
  const [weights, setWeights] = useState<Objectives>(STRATEGIES.balanced.objectives);
  const [showTable, setShowTable] = useState(false);

  const result = useMemo(
    () =>
      simulate({
        sector,
        monthlyUnits: units,
        avgUnitValue: unitValue,
        branches,
        backhaul,
        supplierAcceptsReturns: supplier,
        objectives: weights,
      }),
    [sector, units, unitValue, branches, backhaul, supplier, weights],
  );

  const uplift = result.baselineRecovered > 0 ? result.recovered / result.baselineRecovered - 1 : 0;
  const months = result.series.map((p) => String(p.month));
  const series = [
    { key: "baseline", label: copy.baseline, color: BASELINE_COLOR, values: result.series.map((p) => p.baseline) },
    { key: "swyv", label: copy.withSwyv, color: SWYV_COLOR, values: result.series.map((p) => p.swyv) },
  ];

  return (
    <div className="grid grid-cols-1 gap-px border border-line bg-line lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)]">
      {/* Controls */}
      <div className="flex flex-col gap-6 bg-night p-6 sm:p-8">
        <div className="flex flex-col gap-2">
          <StatusTag tone="warn" className="self-start">
            {copy.sample}
          </StatusTag>
          <p className="text-xs leading-relaxed text-steel">{copy.model}</p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="text-concrete/90">{copy.inputs.sector}</span>
          <Segmented<Sector>
            label={copy.inputs.sector}
            value={sector}
            onChange={setSector}
            options={(Object.keys(SECTORS) as Sector[]).map((value) => ({ value, label: l(SECTORS[value].label) }))}
          />
        </div>
        <Slider label={copy.inputs.units} min={1000} max={50000} step={500} value={units} onChange={setUnits} display={fmt(units)} />
        <Slider label={copy.inputs.value} min={5} max={500} step={5} value={unitValue} onChange={setUnitValue} display={sar(unitValue)} />
        <Slider label={copy.inputs.branches} min={1} max={100} value={branches} onChange={setBranches} />
        <div className="grid gap-2">
          <Toggle checked={backhaul} onChange={setBackhaul} label={copy.inputs.backhaul} />
          <Toggle checked={supplier} onChange={setSupplier} label={copy.inputs.supplier} />
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <span className="text-concrete/90">{copy.inputs.strategy}</span>
          <Segmented
            label={copy.inputs.strategy}
            value={strategy}
            onChange={(v) => {
              setStrategy(v);
              setWeights(STRATEGIES[v].objectives);
            }}
            options={Object.entries(STRATEGIES).map(([value, s]) => ({ value, label: l(s.label) }))}
          />
        </div>
        <details className="group border border-line">
          <summary className="cursor-pointer list-none px-3 py-2.5 font-mono text-[11px] tracking-wider text-steel uppercase hover:text-concrete">
            {copy.inputs.weights} <span className="float-end group-open:rotate-45">+</span>
          </summary>
          <div className="grid gap-4 border-t border-line p-3">
            {(["value", "speed", "green"] as const).map((key) => (
              <Slider
                key={key}
                label={weightLabels[key]}
                min={0}
                max={100}
                step={5}
                value={weights[key]}
                onChange={(v) => {
                  setStrategy("custom");
                  setWeights((w) => ({ ...w, [key]: v }));
                }}
              />
            ))}
          </div>
        </details>
      </div>

      {/* Results */}
      <div className="flex min-w-0 flex-col gap-px bg-line">
        <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-3">
          <Stat
            className="border-0"
            label={copy.kpis.recovered}
            value={sar(result.recovered)}
            accent
            note={`${uplift >= 0 ? "+" : ""}${Math.round(uplift * 100)}% ${copy.kpis.uplift}`}
          />
          <Stat
            className="border-0"
            label={copy.kpis.cycle}
            value={`${result.cycleDays.toFixed(1)}d`}
            note={copy.kpis.cycleBaseline}
          />
          <Stat
            className="border-0"
            label={copy.kpis.co2}
            value={`${fmt(result.co2Avoided / 1000, 2)} t`}
            note={`${fmt(result.tripsSaved)} ${copy.kpis.trips}`}
          />
        </div>

        <div className="bg-panel p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-mono text-xs tracking-[0.16em] text-concrete uppercase">{copy.chartTitle}</h3>
            <ul className="flex gap-4 text-xs text-steel">
              {series.map((s) => (
                <li key={s.key} className="flex items-center gap-1.5">
                  <span aria-hidden className="h-0.5 w-4" style={{ background: s.color }} />
                  {s.label}
                </li>
              ))}
            </ul>
          </div>
          <LineChart series={series} xLabels={months} xTitle={copy.month} ariaLabel={copy.chartTitle} />
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            aria-expanded={showTable}
            className="mt-3 text-xs text-steel underline underline-offset-4 hover:text-concrete"
          >
            {copy.tableToggle}
          </button>
          {showTable && (
            <div className="mt-3 overflow-x-auto" data-lenis-prevent>
              <table className="w-full min-w-[420px] text-xs">
                <thead>
                  <tr className="border-b border-line text-steel">
                    <th className="py-1.5 text-start font-normal">{copy.month}</th>
                    {series.map((s) => (
                      <th key={s.key} className="py-1.5 text-end font-normal">
                        {s.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.series.map((p) => (
                    <tr key={p.month} className="border-b border-line">
                      <td className="num py-1.5">{p.month}</td>
                      <td className="num py-1.5 text-end">{sar(p.baseline)}</td>
                      <td className="num py-1.5 text-end">{sar(p.swyv)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-panel p-5 sm:p-6">
          <h3 className="mb-4 font-mono text-xs tracking-[0.16em] text-concrete uppercase">{copy.allocationTitle}</h3>
          <AllocationBar
            unit={copy.units}
            segments={ROUTES.map((r) => ({
              key: r,
              label: l(ROUTE_META[r].label),
              value: result.allocation[r],
              swatch: ROUTE_META[r].swatch,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
