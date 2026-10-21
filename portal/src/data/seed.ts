// Demo data. Deterministic so every viewer sees the same starting state.
// Replace with API calls when the backend exists (see README → "Next steps").
import type {
  AppState, Branch, Carrier, EventCode, Invoice, Origin, Reason, ReturnCode, ReturnForm, ReturnLine, Shipment, ShipmentEvent, ShipmentStatus, Tx,
} from "../types";

export const TODAY = "2026-10-19";

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function addDays(iso: string, d: number) {
  const t = new Date(iso + "T00:00:00Z");
  t.setUTCDate(t.getUTCDate() + d);
  return t.toISOString().slice(0, 10);
}
const at = (date: string, hm: string) => `${date}T${hm}:00+03:00`;

const br = (id: string, ar: string, en: string, zone: Branch["zone"], window: string): Branch => ({ id, name: { ar, en }, zone, window });
export const branches: Branch[] = [
  br("B01", "فرع الملقا", "Al Malqa branch", "north", "07:30–09:30"),
  br("B02", "فرع الياسمين", "Al Yasmin branch", "north", "07:30–09:30"),
  br("B03", "فرع النرجس", "An Narjis branch", "north", "09:30–11:30"),
  br("B04", "فرع حطين", "Hittin branch", "north", "07:30–09:30"),
  br("B05", "فرع العارض", "Al Arid branch", "north", "10:00–12:00"),
  br("B06", "فرع العليا", "Al Olaya branch", "central", "08:00–10:00"),
  br("B07", "فرع الملز", "Al Malaz branch", "central", "08:00–10:00"),
  br("B08", "فرع الروضة", "Ar Rawdah branch", "east", "09:00–11:00"),
  br("B09", "فرع النسيم", "An Nasim branch", "east", "09:00–11:00"),
  br("B10", "فرع السويدي", "As Suwaidi branch", "west", "10:00–12:00"),
  br("B11", "فرع ظهرة لبن", "Dhahrat Laban branch", "west", "10:00–12:00"),
  br("B12", "فرع الشفا", "Ash Shifa branch", "south", "08:30–10:30"),
];

export const carriers: Carrier[] = [
  { id: "C1", name: { ar: "[ناقل مرخص أ]", en: "[Licensed carrier A]" }, license: "TGA-xxxx01", vehicles: { ar: "6 دينا · 2 فان", en: "6 Dyna · 2 vans" }, onTime: 0.97, claims: 0, trips: 0 },
  { id: "C2", name: { ar: "[ناقل مرخص ب]", en: "[Licensed carrier B]" }, license: "TGA-xxxx02", vehicles: { ar: "4 دينا · 3 فان", en: "4 Dyna · 3 vans" }, onTime: 0.94, claims: 1, trips: 0 },
  { id: "C3", name: { ar: "[ناقل مرخص ج]", en: "[Licensed carrier C]" }, license: "TGA-xxxx03", vehicles: { ar: "3 لوري · 2 دينا", en: "3 lorries · 2 Dyna" }, onTime: 0.91, claims: 2, trips: 0 },
];
export const INSPECTORS = ["SW-0101", "SW-0102", "SW-0103"];
const ORIGINS: Origin[] = ["dammam", "jeddah", "kharj", "qassim"];

export const SKUS: { sku: string; name: Tx; value: number }[] = [
  { sku: "6281001", name: { ar: "منظف سائل 3 لتر", en: "Liquid detergent 3 L" }, value: 24 },
  { sku: "6281014", name: { ar: "عصير برتقال 1 لتر", en: "Orange juice 1 L" }, value: 7 },
  { sku: "6281022", name: { ar: "أرز بسمتي 5 كجم", en: "Basmati rice 5 kg" }, value: 46 },
  { sku: "6281035", name: { ar: "مياه 330 مل × 40", en: "Water 330 ml × 40" }, value: 18 },
  { sku: "6281047", name: { ar: "مناديل × 10", en: "Tissues × 10" }, value: 21 },
  { sku: "6281058", name: { ar: "حليب طويل الأجل 1 لتر", en: "UHT milk 1 L" }, value: 6 },
  { sku: "6281063", name: { ar: "زيت طبخ 1.5 لتر", en: "Cooking oil 1.5 L" }, value: 19 },
  { sku: "6281071", name: { ar: "معكرونة 400 جم", en: "Pasta 400 g" }, value: 4 },
  { sku: "6281089", name: { ar: "بسكويت × 12", en: "Biscuits × 12" }, value: 15 },
  { sku: "6281096", name: { ar: "قهوة مطحونة 500 جم", en: "Ground coffee 500 g" }, value: 38 },
];
const REASONS: Reason[] = ["near_expiry", "overstock", "wrong_order", "complaint", "recall"];
const NOTES: Tx[] = [
  { ar: "ختم مكسور على طبلية واحدة، موثّق بالصور", en: "Broken seal on one pallet, photo-documented" },
  { ar: "نقص كرتونين عن قائمة التعبئة", en: "Two cartons short against the packing list" },
  { ar: "تأخر الفرع في الاستلام 40 دقيقة", en: "Branch delayed receiving by 40 minutes" },
];

const fmtId = (n: number) => `SWV-26-${String(n).padStart(6, "0")}`;

export function buildSeed(): AppState {
  const r = rng(2026);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const int = (a: number, b: number) => a + Math.floor(r() * (b - a + 1));
  const lineCode = (): ReturnCode => {
    const x = r();
    return x < 0.46 ? "ok" : x < 0.66 ? "near" : x < 0.73 ? "expired" : x < 0.82 ? "damaged" : x < 0.89 ? "repack" : "dead";
  };
  const cs = carriers.map((c) => ({ ...c, trips: 0 }));
  const shipments: Shipment[] = [];
  const returns: ReturnForm[] = [];
  let n = 140;
  let rn = 60;
  for (let d = -56; d <= 3; d++) {
    const date = addDays(TODAY, d);
    if (new Date(date + "T00:00:00Z").getUTCDay() === 5) continue; // Friday off
    const count = d === 0 ? 4 : int(1, 2);
    for (let k = 0; k < count; k++) {
      n++;
      const b = d === 0 ? branches[k % 5] : pick(branches);
      const carrier = pick(cs);
      const returnsPickup = r() < 0.7;
      const origin = pick(ORIGINS);
      let status: ShipmentStatus;
      if (d < 0) status = r() < 0.035 ? "exception" : "delivered";
      else if (d === 0) status = (["delivered", "out", "at_hub", "exception"] as ShipmentStatus[])[k];
      else status = d === 1 ? "scheduled" : "requested";
      const inspectorId = status === "requested" ? null : pick(INSPECTORS);
      const all: ShipmentEvent[] = [
        { code: "booked", at: at(addDays(date, -3), "10:12"), by: "client" },
        { code: "scheduled", at: at(addDays(date, -2), "15:40"), by: "ops" },
        { code: "arrived", at: at(date, "02:10") },
        { code: "inspected", at: at(date, "02:45"), by: "inspector" },
        { code: "out", at: at(date, "06:55") },
        { code: (returnsPickup ? "delivered_returns" : "delivered") as EventCode, at: at(date, "08:" + String(int(10, 55))) },
      ];
      const reached = { requested: 1, scheduled: 2, at_hub: 4, out: 5, delivered: 6, exception: 4 }[status];
      const note = status === "exception" ? pick(NOTES) : undefined;
      const events = all.slice(0, reached);
      if (note) events.push({ code: "flag", at: at(date, "03:05"), by: "inspector", note: undefined });
      const s: Shipment = {
        id: fmtId(n), origin, branchId: b.id, pallets: int(5, 15), date, window: b.window,
        carrierId: carrier.id, inspectorId, status, returnsPickup, events, note,
      };
      if (d < 0) carrier.trips++;
      if (status === "delivered" && returnsPickup) {
        rn++;
        const lines: ReturnLine[] = [];
        for (let i = 0, nl = int(3, 7); i < nl; i++) {
          const it = pick(SKUS);
          lines.push({ sku: it.sku, qty: int(2, 30), code: lineCode(), reason: pick(REASONS), unitValue: it.value });
        }
        const f: ReturnForm = { id: `RET-${String(rn).padStart(4, "0")}`, shipmentId: s.id, branchId: b.id, date, inspectorId: inspectorId ?? INSPECTORS[0], branchSigner: "", signed: true, lines };
        s.returnFormId = f.id;
        returns.push(f);
      }
      shipments.push(s);
    }
  }
  shipments.reverse();
  returns.reverse();

  const inv = (id: string, period: Tx, issued: string, due: string, status: Invoice["status"], pal: number, stops: number, sorted: number): Invoice => ({
    id, period, issued, due, status,
    lines: [
      { item: "crossdock", qty: pal, price: 82 },
      { item: "returns_pickup", qty: stops, price: 40 },
      { item: "sorting", qty: sorted, price: 25 },
      { item: "portal", qty: 1, price: 0 },
    ],
  });
  const invoices: Invoice[] = [
    inv("INV-2026-0012", { ar: "1–19 أكتوبر 2026 (مسودة)", en: "1–19 Oct 2026 (draft)" }, TODAY, addDays(TODAY, 14), "draft", 168, 19, 7),
    inv("INV-2026-0011", { ar: "سبتمبر 2026", en: "September 2026" }, "2026-10-01", "2026-10-15", "due", 412, 31, 14),
    inv("INV-2026-0010", { ar: "أغسطس 2026", en: "August 2026" }, "2026-09-01", "2026-09-15", "paid", 388, 28, 12),
  ];

  return {
    lang: "ar",
    role: "client",
    clientName: "",
    branches, shipments, returns, invoices,
    carriers: cs,
    pricing: { perPallet: 82, dedicatedTrip: 650, returnStop: 40, sortPerPallet: 25, vat: 0.15 },
    notifications: { email: true, sms: false, daily: true },
  };
}
