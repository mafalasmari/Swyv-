"use client";

import { useEffect, useMemo, useState } from "react";
import { telemetryCopy } from "@/content/tools";
import type { Locale } from "@/i18n/config";
import { localize } from "@/i18n/localize";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Segmented, Select, TextInput } from "@/components/ui/controls";
import { Chevron, SortIcon } from "@/components/ui/icons";
import { Stat } from "@/components/ui/Stat";
import { StatusTag } from "@/components/ui/StatusTag";
import { cn } from "@/lib/cn";
import { duration, fmt } from "@/lib/format";
import {
  ASSET_STATUS,
  ASSET_TYPES,
  ZONES,
  dwellRatio,
  seedAssets,
  tick,
  type Asset,
  type AssetStatus,
  type AssetType,
  type Direction,
  type Zone,
} from "@/lib/telemetry";

type SortKey = "id" | "type" | "location" | "status" | "dwell" | "lastPing";
type Filters = {
  query: string;
  type: AssetType | "all";
  status: AssetStatus | "all";
  zone: Zone | "all";
  direction: Direction | "all";
  overOnly: boolean;
};

const INITIAL_FILTERS: Filters = { query: "", type: "all", status: "all", zone: "all", direction: "all", overOnly: false };
const TICK_MS = 2000;

export function TelemetryDashboard({ locale }: { locale: Locale }) {
  const copy = localize(telemetryCopy, locale);
  const l = (tx: { ar: string; en: string }) => tx[locale];

  const [assets, setAssets] = useState<Asset[]>(() => seedAssets());
  const [live, setLive] = useState(true);
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "dwell", dir: "desc" });

  // Simulated clock: every tick is one minute of dwell and two seconds since the last ping.
  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setAssets((prev) => tick(prev, 1, TICK_MS / 1000)), TICK_MS);
    return () => clearInterval(id);
  }, [live]);

  const active = assets.filter((a) => a.status !== "delivered");
  const kpis = {
    active: active.length,
    avgDwell: active.reduce((s, a) => s + a.dwell, 0) / Math.max(active.length, 1),
    over: active.filter((a) => dwellRatio(a) > 1).length,
    exceptions: assets.filter((a) => a.status === "exception").length,
  };

  const rows = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const filtered = assets.filter(
      (a) =>
        (!q || a.id.toLowerCase().includes(q) || a.location.ar.includes(q) || a.location.en.toLowerCase().includes(q)) &&
        (filters.type === "all" || a.type === filters.type) &&
        (filters.status === "all" || a.status === filters.status) &&
        (filters.zone === "all" || a.zone === filters.zone) &&
        (filters.direction === "all" || a.direction === filters.direction) &&
        (!filters.overOnly || dwellRatio(a) > 1),
    );
    const value = (a: Asset): string | number => {
      switch (sort.key) {
        case "dwell":
          return dwellRatio(a);
        case "lastPing":
          return a.lastPing;
        case "location":
          return a.location[locale];
        case "type":
          return ASSET_TYPES[a.type].label[locale];
        case "status":
          return ASSET_STATUS[a.status].label[locale];
        default:
          return a.id;
      }
    };
    return [...filtered].sort((a, b) => {
      const [x, y] = [value(a), value(b)];
      const cmp = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), locale);
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [assets, filters, sort, locale]);

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => setFilters((f) => ({ ...f, [key]: value }));
  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: key === "dwell" ? "desc" : "asc" }));
  const dirty = JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS);

  const columns: { key: SortKey; label: string; align?: "end" }[] = [
    { key: "id", label: copy.headers.id },
    { key: "type", label: copy.headers.type },
    { key: "location", label: copy.headers.location },
    { key: "status", label: copy.headers.status },
    { key: "dwell", label: copy.headers.dwell },
    { key: "lastPing", label: copy.headers.ping, align: "end" },
  ];

  return (
    <div className="border border-line">
      {/* Status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-panel px-4 py-3">
        <div className="flex items-center gap-3">
          <StatusTag tone={live ? "live" : "idle"} pulse={live}>
            {live ? copy.live : copy.paused}
          </StatusTag>
          <span className="font-mono text-[11px] tracking-wider text-steel uppercase">{copy.sample}</span>
        </div>
        <button
          type="button"
          onClick={() => setLive((v) => !v)}
          aria-pressed={!live}
          className="border border-line px-3 py-1.5 font-mono text-[11px] tracking-wider text-steel uppercase hover:border-steel hover:text-concrete"
        >
          {live ? copy.pause : copy.resume}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
        <Stat className="border-0" label={copy.kpis.active} value={<AnimatedNumber value={kpis.active} format={fmt} />} />
        <Stat className="border-0" label={copy.kpis.avgDwell} value={<AnimatedNumber value={kpis.avgDwell} format={duration} />} />
        <Stat className="border-0" label={copy.kpis.overSla} value={<AnimatedNumber value={kpis.over} format={fmt} />} accent={kpis.over > 0} />
        <Stat className="border-0" label={copy.kpis.exceptions} value={<AnimatedNumber value={kpis.exceptions} format={fmt} />} accent={kpis.exceptions > 0} />
      </div>

      {/* Filters */}
      <div className="grid gap-3 border-y border-line bg-night p-4 md:grid-cols-2 xl:grid-cols-[1.4fr_repeat(3,1fr)_1.2fr_auto]">
        <TextInput
          type="search"
          aria-label={copy.filters.search}
          placeholder={copy.filters.search}
          value={filters.query}
          onChange={(e) => setFilter("query", e.target.value)}
        />
        <Select
          aria-label={copy.filters.type}
          value={filters.type}
          onChange={(e) => setFilter("type", e.target.value as Filters["type"])}
          options={[
            { value: "all", label: `${copy.filters.type}: ${copy.filters.all}` },
            ...Object.entries(ASSET_TYPES).map(([value, v]) => ({ value, label: l(v.label) })),
          ]}
        />
        <Select
          aria-label={copy.filters.status}
          value={filters.status}
          onChange={(e) => setFilter("status", e.target.value as Filters["status"])}
          options={[
            { value: "all", label: `${copy.filters.status}: ${copy.filters.all}` },
            ...Object.entries(ASSET_STATUS).map(([value, v]) => ({ value, label: l(v.label) })),
          ]}
        />
        <Select
          aria-label={copy.filters.zone}
          value={filters.zone}
          onChange={(e) => setFilter("zone", e.target.value as Filters["zone"])}
          options={[
            { value: "all", label: `${copy.filters.zone}: ${copy.filters.all}` },
            ...Object.entries(ZONES).map(([value, v]) => ({ value, label: l(v) })),
          ]}
        />
        <Segmented<Filters["direction"]>
          label={copy.filters.direction}
          value={filters.direction}
          onChange={(v) => setFilter("direction", v)}
          options={[
            { value: "all", label: copy.filters.all },
            { value: "inbound", label: copy.filters.inbound },
            { value: "return", label: copy.filters.return },
          ]}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={filters.overOnly}
            onClick={() => setFilter("overOnly", !filters.overOnly)}
            className={cn(
              "h-11 border px-3 font-mono text-[11px] tracking-wider whitespace-nowrap uppercase transition-colors",
              filters.overOnly ? "border-red bg-red/15 text-error" : "border-line text-steel hover:text-concrete",
            )}
          >
            {copy.filters.overOnly}
          </button>
          {dirty && (
            <button
              type="button"
              onClick={() => setFilters(INITIAL_FILTERS)}
              className="h-11 px-2 text-xs whitespace-nowrap text-steel underline underline-offset-4 hover:text-concrete"
            >
              {copy.filters.reset}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="max-h-[560px] overflow-auto" data-lenis-prevent>
        <table className="w-full min-w-[760px] text-sm">
          <thead className="sticky top-0 z-10 bg-panel">
            <tr className="border-b border-line">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={sort.key === c.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                  className={cn("px-4 py-2.5 font-normal", c.align === "end" ? "text-end" : "text-start")}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(c.key)}
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-steel uppercase hover:text-concrete"
                  >
                    {c.label}
                    <SortIcon dir={sort.key === c.key ? sort.dir : null} className="size-2.5" />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const ratio = dwellRatio(a);
              const tone = a.status === "delivered" ? "bg-delivered" : ratio > 1 ? "bg-red" : ratio > 0.8 ? "bg-pending" : "bg-steel";
              return (
                <tr key={a.id} className="border-b border-line transition-colors odd:bg-surface even:bg-raised hover:bg-panel">
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2">
                      <Chevron
                        direction={a.direction === "return" ? "up" : "down"}
                        role="img"
                        aria-label={a.direction === "return" ? copy.filters.return : copy.filters.inbound}
                        className={cn("size-2", a.direction === "return" ? "text-pending" : "text-red")}
                      />
                      <span className="num text-concrete">{a.id}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-steel">{l(ASSET_TYPES[a.type].label)}</td>
                  <td className="px-4 py-2.5">
                    {l(a.location)}
                    <span className="block text-xs text-steel">{l(ZONES[a.zone])}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusTag tone={ASSET_STATUS[a.status].tone}>{l(ASSET_STATUS[a.status].label)}</StatusTag>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="relative h-1.5 w-24 shrink-0 bg-line" title={`${copy.limit} ${duration(a.sla)}`}>
                        <span className={cn("absolute inset-y-0 start-0", tone)} style={{ width: `${Math.min(100, ratio * 100)}%` }} />
                      </span>
                      <span className={cn("num text-xs", ratio > 1 && a.status !== "delivered" ? "text-error" : "text-concrete")}>
                        {duration(a.dwell)}
                      </span>
                      <span className="num text-[11px] text-steel">/ {duration(a.sla)}</span>
                    </div>
                  </td>
                  <td className="num px-4 py-2.5 text-end text-xs text-steel">
                    {a.lastPing === 0 ? (
                      <span className="text-delivered">● 0s</span>
                    ) : (
                      `${fmt(a.lastPing)}s`
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <p className="p-8 text-center text-sm text-steel">{copy.empty}</p>}
      </div>
      <p className="border-t border-line px-4 py-2.5 font-mono text-[11px] tracking-wider text-steel uppercase">
        {copy.showing} <span className="num">{rows.length}</span> {copy.of} <span className="num">{assets.length}</span>
      </p>
    </div>
  );
}
