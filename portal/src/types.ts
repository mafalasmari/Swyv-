export type Lang = "ar" | "en";
/** A string in both languages. */
export interface Tx { ar: string; en: string }

export type Zone = "north" | "central" | "east" | "west" | "south";

export interface Branch {
  id: string;
  name: Tx;
  zone: Zone;
  window: string; // receiving window, e.g. "07:30–09:30"
}

export type ShipmentStatus =
  | "requested" // client booked, waiting for SWYV to schedule
  | "scheduled" // carrier + slot assigned
  | "at_hub" // trailer unloaded at cross-dock, inspection running
  | "out" // van out for delivery
  | "delivered" // delivered (and returns collected if requested)
  | "exception"; // needs attention

export type EventCode = "booked" | "scheduled" | "arrived" | "inspected" | "out" | "delivered" | "delivered_returns" | "flag" | "resolved";
export type Actor = "client" | "ops" | "inspector";

export interface ShipmentEvent {
  code: EventCode;
  at: string; // ISO datetime
  by?: Actor;
  note?: string; // free text (user-entered) for flags
}

export type Origin = "dammam" | "jeddah" | "kharj" | "qassim" | "riyadh_wh";

export interface Shipment {
  id: string; // waybill number
  origin: Origin;
  branchId: string;
  pallets: number;
  date: string; // ISO date of delivery
  window: string;
  carrierId: string;
  inspectorId: string | null;
  status: ShipmentStatus;
  returnsPickup: boolean;
  returnFormId?: string;
  note?: Tx | string; // seeded notes are bilingual, user-entered notes are free text
  clientNote?: string;
  events: ShipmentEvent[];
}

export type ReturnCode = "ok" | "near" | "expired" | "damaged" | "repack" | "dead";
export type Reason = "overstock" | "near_expiry" | "wrong_order" | "complaint" | "recall" | "other";

export interface ReturnLine {
  sku: string;
  qty: number;
  code: ReturnCode;
  reason: Reason;
  unitValue: number; // SAR
}

export interface ReturnForm {
  id: string;
  shipmentId: string;
  branchId: string;
  date: string;
  inspectorId: string;
  branchSigner: string; // empty = placeholder
  signed: boolean;
  lines: ReturnLine[];
}

export type InvoiceStatus = "draft" | "due" | "paid" | "overdue";
export type InvoiceItem = "crossdock" | "returns_pickup" | "sorting" | "portal";

export interface InvoiceLine { item: InvoiceItem; qty: number; price: number }

export interface Invoice {
  id: string;
  period: Tx;
  issued: string;
  due: string;
  status: InvoiceStatus;
  lines: InvoiceLine[];
}

export interface Carrier {
  id: string;
  name: Tx;
  license: string;
  vehicles: Tx;
  onTime: number; // 0..1
  claims: number;
  trips: number;
}

export interface Pricing {
  perPallet: number;
  dedicatedTrip: number;
  returnStop: number;
  sortPerPallet: number;
  vat: number;
}

export type Role = "client" | "ops";

export interface Toast { id: number; text: string }

export interface AppState {
  lang: Lang;
  role: Role;
  clientName: string; // empty = placeholder
  branches: Branch[];
  shipments: Shipment[];
  returns: ReturnForm[];
  invoices: Invoice[];
  carriers: Carrier[];
  pricing: Pricing;
  notifications: { email: boolean; sms: boolean; daily: boolean };
}
