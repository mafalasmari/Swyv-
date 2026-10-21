"use client";

import { useMemo, useState } from "react";
import { engineCopy } from "@/content/tools";
import type { Locale } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { FieldLabel, NumberInput, Select, Slider, Toggle } from "@/components/ui/controls";
import { StatusTag } from "@/components/ui/StatusTag";
import { cn } from "@/lib/cn";
import { decide, type ClientRules, type Objectives, type ReturnItem } from "@/lib/disposition";
import { fmt, pct, sar } from "@/lib/format";
import { CATEGORIES, CONDITIONS, CONDITION_CODES, ROUTE_META, ROUTES, type Category, type Route } from "@/lib/returns";

/** Sample audit-form lines (illustrative SKUs from the portal demo). */
const BATCH: (ReturnItem & { sku: { ar: string; en: string } })[] = [
  { sku: { ar: "منظف سائل 3 لتر", en: "Liquid detergent 3 L" }, category: "fmcg", code: "ok", qty: 24, unitValue: 24, daysToExpiry: 210, packagingIntact: true },
  { sku: { ar: "عصير برتقال 1 لتر", en: "Orange juice 1 L" }, category: "beverage", code: "near", qty: 120, unitValue: 7, daysToExpiry: 9, packagingIntact: true },
  { sku: { ar: "أرز بسمتي 5 كجم", en: "Basmati rice 5 kg" }, category: "fmcg", code: "damaged", qty: 8, unitValue: 46, daysToExpiry: 300, packagingIntact: false },
  { sku: { ar: "حليب طويل الأجل 1 لتر", en: "UHT milk 1 L" }, category: "beverage", code: "expired", qty: 60, unitValue: 6, daysToExpiry: -3, packagingIntact: true },
  { sku: { ar: "مناديل × 10", en: "Tissues × 10" }, category: "personal_care", code: "repack", qty: 30, unitValue: 21, daysToExpiry: null, packagingIntact: false },
  { sku: { ar: "قهوة مطحونة 500 جم", en: "Ground coffee 500 g" }, category: "fmcg", code: "dead", qty: 18, unitValue: 38, daysToExpiry: 150, packagingIntact: true },
];

export function DispositionEngine({ locale }: { locale: Locale }) {
  const copy = localize(engineCopy, locale);
  const l = (tx: { ar: string; en: string }) => tx[locale];

  const [item, setItem] = useState<ReturnItem>({
    category: "fmcg",
    code: "near",
    unitValue: 24,
    qty: 40,
    daysToExpiry: 18,
    packagingIntact: true,
  });
  const [rules, setRules] = useState<ClientRules>({ minShelfDays: 30, supplierAcceptsReturns: true });
  const [weights, setWeights] = useState<Objectives>({ value: 50, speed: 25, green: 25 });

  const decision = useMemo(() => decide(item, rules, weights), [item, rules, weights]);
  const batch = useMemo(
    () => BATCH.map((line) => ({ line, decision: decide(line, rules, weights) })),
    [rules, weights],
  );
  const perishable = CATEGORIES[item.category].perishable;
  const best = decision.options[0];
  const set = <K extends keyof ReturnItem>(key: K, value: ReturnItem[K]) => setItem((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid grid-cols-1 gap-px border border-line bg-line">
      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        {/* Inputs */}
        <div className="flex flex-col gap-6 bg-night p-6 sm:p-8">
          <PanelTitle>{copy.inputTitle}</PanelTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldLabel label={copy.category}>
              <Select
                value={item.category}
                onChange={(e) => {
                  const category = e.target.value as Category;
                  setItem((prev) => ({
                    ...prev,
                    category,
                    daysToExpiry: CATEGORIES[category].perishable ? (prev.daysToExpiry ?? 30) : null,
                  }));
                }}
                options={Object.entries(CATEGORIES).map(([value, c]) => ({ value, label: l(c.label) }))}
              />
            </FieldLabel>
            <FieldLabel label={copy.condition}>
              <Select
                value={item.code}
                onChange={(e) => set("code", e.target.value as ReturnItem["code"])}
                options={CONDITION_CODES.map((code) => ({
                  value: code,
                  label: l(CONDITIONS[code].label),
                }))}
              />
            </FieldLabel>
            <FieldLabel label={copy.unitValue}>
              <NumberInput min={0} value={item.unitValue} onChange={(e) => set("unitValue", Math.max(0, Number(e.target.value) || 0))} />
            </FieldLabel>
            <FieldLabel label={copy.qty}>
              <NumberInput min={1} value={item.qty} onChange={(e) => set("qty", Math.max(1, Number(e.target.value) || 1))} />
            </FieldLabel>
            <FieldLabel label={copy.daysToExpiry} hint={perishable ? undefined : copy.noExpiry}>
              <NumberInput
                disabled={!perishable}
                value={item.daysToExpiry ?? ""}
                onChange={(e) => set("daysToExpiry", Number(e.target.value))}
                className="disabled:opacity-40"
              />
            </FieldLabel>
            <div className="flex items-end">
              <div className="w-full">
                <Toggle checked={item.packagingIntact} onChange={(v) => set("packagingIntact", v)} label={copy.packaging} />
              </div>
            </div>
          </div>

          <PanelTitle>{copy.rulesTitle}</PanelTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldLabel label={copy.minShelf}>
              <NumberInput
                min={0}
                value={rules.minShelfDays}
                onChange={(e) => setRules((r) => ({ ...r, minShelfDays: Math.max(0, Number(e.target.value) || 0) }))}
              />
            </FieldLabel>
            <div className="flex items-end">
              <div className="w-full">
                <Toggle
                  checked={rules.supplierAcceptsReturns}
                  onChange={(v) => setRules((r) => ({ ...r, supplierAcceptsReturns: v }))}
                  label={copy.supplier}
                />
              </div>
            </div>
          </div>

          <PanelTitle>{copy.priorityTitle}</PanelTitle>
          <div className="grid gap-4">
            {(["value", "speed", "green"] as const).map((key) => (
              <Slider
                key={key}
                label={copy.weights[key]}
                min={0}
                max={100}
                step={5}
                value={weights[key]}
                onChange={(v) => setWeights((w) => ({ ...w, [key]: v }))}
              />
            ))}
          </div>
        </div>

        {/* Decision */}
        <div className="flex flex-col gap-6 bg-panel p-6 sm:p-8" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PanelTitle>{copy.recommended}</PanelTitle>
            <StatusTag tone={CONDITIONS[item.code].tone}>
              {l(CONDITIONS[item.code].label)}
            </StatusTag>
          </div>

          <div className="flex items-stretch gap-4 border border-line bg-night p-5">
            <span aria-hidden className="w-1.5 shrink-0" style={{ background: ROUTE_META[best.route].color }} />
            <div className="flex flex-1 flex-col gap-1">
              <p className="text-2xl font-semibold sm:text-3xl">{l(ROUTE_META[best.route].label)}</p>
              <p className="text-sm text-steel">{l(ROUTE_META[best.route].detail)}</p>
            </div>
            <div className="text-end">
              <p className="num text-2xl text-concrete">{sar(best.netValue)}</p>
              <p className="num text-xs text-steel">{fmt(best.co2Avoided, 1)} kg CO₂</p>
            </div>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs tracking-[0.14em] text-steel uppercase">{copy.why}</p>
            <ul className="grid gap-2 text-sm">
              {decision.reasons.map((r) => (
                <li key={r.en} className="flex gap-2">
                  <span aria-hidden className="text-red">›</span>
                  {l(r)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 font-mono text-xs tracking-[0.14em] text-steel uppercase">{copy.options}</p>
            <div className="overflow-x-auto" data-lenis-prevent>
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-line text-start font-mono text-[11px] tracking-wider text-steel uppercase">
                    <th className="py-2 text-start font-normal">{copy.headers.route}</th>
                    <th className="py-2 text-start font-normal">{copy.headers.score}</th>
                    <th className="py-2 text-end font-normal">{copy.headers.recovery}</th>
                    <th className="py-2 text-end font-normal">{copy.headers.net}</th>
                    <th className="py-2 text-end font-normal">{copy.headers.days}</th>
                  </tr>
                </thead>
                <tbody>
                  {decision.options.map((o) => (
                    <tr key={o.route} className={cn("border-b border-line", !o.feasible && "text-steel/70")}>
                      <td className="py-2.5">
                        <span className="flex items-center gap-2">
                          <span aria-hidden className={cn("size-2.5", ROUTE_META[o.route].swatch, !o.feasible && "opacity-30")} />
                          {l(ROUTE_META[o.route].label)}
                        </span>
                        {!o.feasible && <span className="block ps-4.5 text-xs">{o.blockers.map(l).join(" · ")}</span>}
                      </td>
                      <td className="py-2.5">
                        {o.feasible ? (
                          <span className="flex items-center gap-2">
                            <span className="h-1.5 w-20 bg-line">
                              <span className="block h-full bg-concrete" style={{ width: `${Math.round(o.score * 100)}%` }} />
                            </span>
                            <span className="num text-xs">{o.score.toFixed(2)}</span>
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] uppercase">{copy.blocked}</span>
                        )}
                      </td>
                      <td className="num py-2.5 text-end">{pct(o.recoveryRate)}</td>
                      <td className="num py-2.5 text-end">{sar(o.netValue)}</td>
                      <td className="num py-2.5 text-end">{o.cycleDays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-auto text-xs text-steel">{copy.decisionNote}</p>
        </div>
      </div>

      {/* Batch run */}
      <div className="bg-night p-6 sm:p-8">
        <div className="mb-5 flex flex-col gap-1">
          <PanelTitle>{copy.batchTitle}</PanelTitle>
          <p className="text-sm text-steel">{copy.batchDescription}</p>
        </div>
        <div className="overflow-x-auto" data-lenis-prevent>
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-line font-mono text-[11px] tracking-wider text-steel uppercase">
                <th className="py-2 text-start font-normal">{copy.batchHeaders.sku}</th>
                <th className="py-2 text-start font-normal">{copy.batchHeaders.code}</th>
                <th className="py-2 text-end font-normal">{copy.batchHeaders.qty}</th>
                <th className="py-2 text-start font-normal ps-6">{copy.batchHeaders.route}</th>
                <th className="py-2 text-end font-normal">{copy.batchHeaders.net}</th>
              </tr>
            </thead>
            <tbody>
              {batch.map(({ line, decision: d }) => {
                const chosen = d.options[0];
                return (
                  <tr key={line.sku.en} className="border-b border-line">
                    <td className="py-2.5">{l(line.sku)}</td>
                    <td className="py-2.5">
                      <StatusTag tone={CONDITIONS[line.code].tone}>
                        {l(CONDITIONS[line.code].label)}
                      </StatusTag>
                    </td>
                    <td className="num py-2.5 text-end">{line.qty}</td>
                    <td className="py-2.5 ps-6">
                      <span className="flex items-center gap-2">
                        <span aria-hidden className={cn("size-2.5", ROUTE_META[d.recommended].swatch)} />
                        {l(ROUTE_META[d.recommended].label)}
                      </span>
                    </td>
                    <td className="num py-2.5 text-end">{sar(chosen.netValue)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="pt-3 font-mono text-xs tracking-wider text-steel uppercase">
                  {copy.batchTotal}
                </td>
                <td className="num pt-3 text-end text-concrete">
                  {sar(batch.reduce((sum, b) => sum + b.decision.options[0].netValue, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <RouteLegend locale={locale} routes={ROUTES} />
      </div>
    </div>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="font-mono text-xs tracking-[0.16em] text-concrete uppercase">{children}</h3>;
}

export function RouteLegend({ locale, routes }: { locale: Locale; routes: Route[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-steel">
      {routes.map((r) => (
        <li key={r} className="flex items-center gap-2">
          <span aria-hidden className={cn("size-2.5", ROUTE_META[r].swatch)} />
          {ROUTE_META[r].label[locale]}
        </li>
      ))}
    </ul>
  );
}
