import type {
  Actor, AppState, EventCode, Invoice, InvoiceItem, InvoiceStatus, Lang, Origin, Reason, ReturnCode, ReturnForm, Shipment, ShipmentEvent, ShipmentStatus, Tx, Zone,
} from "../types";
import { addDays, SKUS, TODAY } from "../data/seed";
import { sessionUser } from "../session";

export type Tone = "ok" | "warn" | "bad" | "info" | "idle";
export const tx = (lang: Lang, v: Tx | string | undefined) => (v === undefined ? "" : typeof v === "string" ? v : v[lang]);

export const sar = (n: number, digits = 0) =>
  "SAR " + n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
export const num = (n: number) => n.toLocaleString("en-US");
export const pct = (x: number, d = 1) => (x * 100).toFixed(d) + "%";

const MONTHS: Record<Lang, string[]> = {
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};
const DAYS: Record<Lang, string[]> = {
  ar: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
};
export function dateFmt(lang: Lang, iso: string, withDay = false) {
  const d = new Date(iso.slice(0, 10) + "T00:00:00Z");
  const s = lang === "ar" ? `${d.getUTCDate()} ${MONTHS.ar[d.getUTCMonth()]}` : `${d.getUTCDate()} ${MONTHS.en[d.getUTCMonth()]}`;
  return withDay ? `${DAYS[lang][d.getUTCDay()]}${lang === "ar" ? " " : ", "}${s}` : s;
}
export const timeOf = (iso: string) => iso.slice(11, 16);

export const STATUS: Record<ShipmentStatus, Tx & { tone: Tone }> = {
  requested: { ar: "بانتظار الجدولة", en: "Awaiting schedule", tone: "idle" },
  scheduled: { ar: "مجدولة", en: "Scheduled", tone: "info" },
  at_hub: { ar: "في نقطة العبور", en: "At cross-dock", tone: "warn" },
  out: { ar: "في الطريق", en: "Out for delivery", tone: "info" },
  delivered: { ar: "مُسلّمة", en: "Delivered", tone: "ok" },
  exception: { ar: "ملاحظة", en: "Exception", tone: "bad" },
};
export const NEXT_STATUS: Partial<Record<ShipmentStatus, ShipmentStatus>> = {
  requested: "scheduled", scheduled: "at_hub", at_hub: "out", out: "delivered", exception: "out",
};
export const NEXT_LABEL: Partial<Record<ShipmentStatus, Tx>> = {
  requested: { ar: "جدولة الرحلة", en: "Schedule trip" },
  scheduled: { ar: "تأكيد الوصول للعبور", en: "Confirm cross-dock arrival" },
  at_hub: { ar: "اعتماد الفحص وإخراج الفان", en: "Approve inspection, dispatch van" },
  out: { ar: "تأكيد التسليم", en: "Confirm delivery" },
  exception: { ar: "حل الملاحظة وإخراج الفان", en: "Resolve and dispatch van" },
};
export const STEPS: Tx[] = [
  { ar: "تم الحجز", en: "Booked" }, { ar: "جُدولت الرحلة", en: "Scheduled" }, { ar: "وصلت لنقطة العبور", en: "At cross-dock" },
  { ar: "الفحص والمطابقة", en: "Inspection" }, { ar: "خرج للفرع", en: "Out to branch" }, { ar: "التسليم والمرتجعات", en: "Delivered + returns" },
];

export const ORIGIN: Record<Origin, Tx> = {
  dammam: { ar: "الدمام", en: "Dammam" }, jeddah: { ar: "جدة", en: "Jeddah" }, kharj: { ar: "الخرج", en: "Al Kharj" },
  qassim: { ar: "القصيم", en: "Qassim" }, riyadh_wh: { ar: "مستودع داخل الرياض", en: "Riyadh warehouse" },
};
export const ZONE: Record<Zone, Tx> = {
  north: { ar: "شمال", en: "North" }, central: { ar: "وسط", en: "Central" }, east: { ar: "شرق", en: "East" },
  west: { ar: "غرب", en: "West" }, south: { ar: "جنوب", en: "South" },
};
export const ACTOR: Record<Actor, Tx> = {
  client: { ar: "العميل", en: "Client" }, ops: { ar: "عمليات SWYV", en: "SWYV ops" }, inspector: { ar: "مشرف ميداني", en: "Field inspector" },
};
export function eventLabel(lang: Lang, e: ShipmentEvent, s: Shipment) {
  const L: Record<EventCode, Tx> = {
    booked: { ar: "تم الحجز", en: "Booked" },
    scheduled: { ar: "جُدولت الرحلة وتعيين الناقل", en: "Trip scheduled, carrier assigned" },
    arrived: { ar: `وصلت الشاحنة من ${ORIGIN[s.origin].ar} لنقطة العبور`, en: `Truck from ${ORIGIN[s.origin].en} arrived at cross-dock` },
    inspected: { ar: "فحص ومطابقة الطبليات", en: "Pallets inspected and matched" },
    out: { ar: "خرج الفان للفرع", en: "Van out to branch" },
    delivered: { ar: "سُلّمت الشحنة", en: "Delivered" },
    delivered_returns: { ar: "سُلّمت الشحنة وسُحبت المرتجعات", en: "Delivered, returns collected" },
    flag: { ar: "سُجلت ملاحظة", en: "Exception logged" },
    resolved: { ar: "حُلت الملاحظة وخرج الفان", en: "Exception resolved, van dispatched" },
  };
  const base = L[e.code][lang];
  const extra = e.code === "flag" ? e.note ?? tx(lang, s.note) : "";
  return extra ? `${base}: ${extra}` : base;
}

export const CODES: Record<ReturnCode, { letter: string; label: Tx; short: Tx; dest: Tx; recoverable: boolean; color: string }> = {
  ok: { letter: "ص", label: { ar: "صالح", en: "OK" }, short: { ar: "صالح", en: "OK" }, dest: { ar: "إعادة للمخزون", en: "Back to stock" }, recoverable: true, color: "var(--c-ok)" },
  near: { letter: "ق", label: { ar: "قريب الانتهاء", en: "Near expiry" }, short: { ar: "قريب الانتهاء", en: "Near expiry" }, dest: { ar: "تصفية أو إرجاع للمورد", en: "Clearance or supplier return" }, recoverable: true, color: "var(--c-near)" },
  expired: { letter: "م", label: { ar: "منتهي الصلاحية", en: "Expired" }, short: { ar: "منتهي", en: "Expired" }, dest: { ar: "إرجاع للمورد أو إتلاف", en: "Supplier return or disposal" }, recoverable: false, color: "var(--c-expired)" },
  damaged: { letter: "ت", label: { ar: "تالف", en: "Damaged" }, short: { ar: "تالف", en: "Damaged" }, dest: { ar: "مطالبة المورد أو إتلاف", en: "Supplier claim or disposal" }, recoverable: false, color: "var(--c-damaged)" },
  repack: { letter: "د", label: { ar: "يحتاج تدوير", en: "Repack" }, short: { ar: "يحتاج تدوير", en: "Repack" }, dest: { ar: "إعادة تغليف", en: "Repackaging" }, recoverable: true, color: "var(--c-repack)" },
  dead: { letter: "ر", label: { ar: "راكد", en: "Dead stock" }, short: { ar: "راكد", en: "Dead stock" }, dest: { ar: "نقل لفرع آخر أو تصفية", en: "Transfer or clearance" }, recoverable: true, color: "var(--c-dead)" },
};
export const CODE_ORDER: ReturnCode[] = ["ok", "near", "repack", "dead", "expired", "damaged"];
export const REASON: Record<Reason, Tx> = {
  overstock: { ar: "زيادة مخزون", en: "Overstock" }, near_expiry: { ar: "قريب الانتهاء", en: "Near expiry" },
  wrong_order: { ar: "طلب خاطئ", en: "Wrong order" }, complaint: { ar: "شكوى عميل", en: "Customer complaint" },
  recall: { ar: "سحب من المورد", en: "Supplier recall" }, other: { ar: "أخرى", en: "Other" },
};
export const skuName = (lang: Lang, sku: string) => SKUS.find((k) => k.sku === sku)?.name[lang] ?? sku;

export const INVOICE_STATUS: Record<InvoiceStatus, Tx & { tone: Tone }> = {
  draft: { ar: "مسودة", en: "Draft", tone: "idle" },
  due: { ar: "مستحقة", en: "Due", tone: "warn" },
  paid: { ar: "مدفوعة", en: "Paid", tone: "ok" },
  overdue: { ar: "متأخرة", en: "Overdue", tone: "bad" },
};
export const INVOICE_ITEM: Record<InvoiceItem, { name: Tx; unit: Tx }> = {
  crossdock: { name: { ar: "عبور وتوزيع", en: "Cross-docking & distribution" }, unit: { ar: "طبلية", en: "pallet" } },
  returns_pickup: { name: { ar: "سحب مرتجعات ضمن الرحلة", en: "Returns pickup on trip" }, unit: { ar: "نقطة سحب", en: "pickup" } },
  sorting: { name: { ar: "فرز المرتجعات وتقريرها", en: "Returns sorting & report" }, unit: { ar: "طبلية مفروزة", en: "sorted pallet" } },
  portal: { name: { ar: "بوابة التتبع والتقارير", en: "Tracking & reporting portal" }, unit: { ar: "شهر", en: "month" } },
};

export const lineValue = (f: ReturnForm) => f.lines.reduce((s, l) => s + l.qty * l.unitValue, 0);
export const recoveredValue = (f: ReturnForm) => f.lines.filter((l) => CODES[l.code].recoverable).reduce((s, l) => s + l.qty * l.unitValue, 0);
export const units = (f: ReturnForm) => f.lines.reduce((s, l) => s + l.qty, 0);

export function invoiceTotals(inv: Invoice, vat: number) {
  const subtotal = inv.lines.reduce((s, l) => s + l.qty * l.price, 0);
  return { subtotal, vat: subtotal * vat, total: subtotal * (1 + vat) };
}

export function metrics(s: AppState, fromIso = addDays(TODAY, -29)) {
  const inRange = s.shipments.filter((x) => x.date >= fromIso && x.date <= TODAY);
  const done = inRange.filter((x) => x.status === "delivered" || x.status === "exception");
  const rets = s.returns.filter((f) => f.date >= fromIso && f.date <= TODAY);
  return {
    trips: inRange.length,
    pallets: inRange.reduce((a, x) => a + x.pallets, 0),
    onTime: done.length ? done.filter((x) => x.status === "delivered").length / done.length : 0,
    returnUnits: rets.reduce((a, f) => a + units(f), 0),
    recovered: rets.reduce((a, f) => a + recoveredValue(f), 0),
    forms: rets.length,
    openExceptions: s.shipments.filter((x) => x.status === "exception").length,
  };
}

export function weekly(s: AppState, lang: Lang, weeks = 8) {
  const out: { label: string; pallets: number; onTime: number; recovered: number; trips: number }[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const end = addDays(TODAY, -7 * w);
    const start = addDays(end, -6);
    const sh = s.shipments.filter((x) => x.date >= start && x.date <= end);
    const done = sh.filter((x) => x.status === "delivered" || x.status === "exception");
    const rets = s.returns.filter((f) => f.date >= start && f.date <= end);
    out.push({
      label: dateFmt(lang, start), trips: sh.length, pallets: sh.reduce((a, x) => a + x.pallets, 0),
      onTime: done.length ? done.filter((x) => x.status === "delivered").length / done.length : 1,
      recovered: rets.reduce((a, f) => a + recoveredValue(f), 0),
    });
  }
  return out;
}

export const branchOf = (s: AppState, id: string) => s.branches.find((b) => b.id === id)!;
export const branchName = (s: AppState, id: string) => branchOf(s, id)?.name[s.lang] ?? id;
export const carrierName = (s: AppState, id: string) => s.carriers.find((c) => c.id === id)?.name[s.lang] ?? id;
export const inspectorName = (lang: Lang, id: string | null) =>
  id ? (lang === "ar" ? `مشرف ${id}` : `Inspector ${id}`) : lang === "ar" ? "يُعيَّن عند الجدولة" : "Assigned on scheduling";
export const clientLabel = (s: AppState) =>
  s.clientName || (sessionUser?.role === "client" ? sessionUser.name[s.lang] : s.lang === "ar" ? "[اسم العميل]" : "[Client name]");
export const officerLabel = (lang: Lang, v: string) => v || (lang === "ar" ? "[مسؤول الفرع]" : "[Branch officer]");
export const byDateDesc = (a: Shipment, b: Shipment) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1);
