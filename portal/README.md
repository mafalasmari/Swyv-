# SWYV Portal (MVP)

Client portal and operations console for **SWYV Logistics Services Co.** (سوايف للخدمات اللوجستية) — an asset-light freight broker in Riyadh that combines cross-docking (night unload at the city edge, daytime van delivery to branches) with reverse logistics (returns collected on the same van's return trip, then sorted).

The app is bilingual (Arabic default, English via the top-bar button) and flips between RTL and LTR. This version is a front-end demo with deterministic sample data. Everything a viewer does is saved in their own browser (localStorage) and can be reset from Settings.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # normal multi-file build in dist/
npm run build:single # one self-contained dist/index.html (what the hosted demo uses)
```

## What's inside

| Area | Client view | Ops view |
|---|---|---|
| Overview | 30-day KPIs, alerts, today's shipments, weekly charts | — |
| Shipments | Filter, search, branch filter, detail drawer with steps + event log | Same list; drawer adds "advance status" and "flag exception" |
| Booking | Branch, origin, date, pallets, returns pickup, live price estimate | — |
| Dispatch board | — | Kanban: awaiting schedule → scheduled → at hub → out → exceptions |
| Returns | Split by condition code, top branches by recovered value, signed forms | Inspector form: line items, condition codes, branch sign-off |
| Branches | 30-day performance per branch | — |
| Invoices | Monthly invoice with lines, VAT 15%, register bank transfer | — |
| Reports | On-time line vs 95% target, trips per week, period summary, copy CSV | Same |
| Carriers | — | Licensed subcontractor scorecard |
| Calculator | Savings vs current cost | — |
| Settings | Account name, notifications, users, integrations, reset demo | + price list editor |

## Code map

```
src/
  types.ts              domain types (Shipment, ReturnForm, Invoice, Carrier…)
  data/seed.ts          deterministic demo data generator, TODAY = 2026-10-19
  lib/domain.ts         labels, status flow, return codes, metrics, formatting
  store.tsx             React context + reducer, localStorage persistence, hash router
  components/           ui primitives, SVG charts, shipment/return drawers
  pages/client.tsx      overview, shipments, booking, branches, invoices
  pages/insights.tsx    returns, reports, calculator
  pages/ops.tsx         dispatch board, inspector form, carriers
  pages/settings.tsx    settings + pricing
  styles.css            design tokens (light/dark), RTL layout
```

## Next steps (suggested order)

1. **Backend + auth:** replace `store.tsx` actions with API calls (Supabase or a small Node/Postgres service). Separate client accounts; ops users see all clients.
2. **Inspector mobile app:** camera photos per pallet/return line, on-screen branch signature, offline queue.
3. **Real documents:** generate the waybill and the signed returns form as PDF per shipment (same letterhead as the printed templates).
4. **Notifications:** email/SMS on scheduling, exception, delivery; daily summary.
5. **Invoicing:** monthly invoice from delivered shipments; ZATCA-compliant e-invoice (Fatoora) before going live.
6. **ERP/API:** booking endpoint + status webhooks for larger clients.

Placeholders in square brackets (`[اسم العميل]`, `[ناقل مرخص أ]`, licence numbers) must be replaced with real data.
