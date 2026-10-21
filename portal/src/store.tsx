import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import type { AppState, Lang, Pricing, ReturnForm, Role, Shipment, ShipmentStatus, Toast } from "./types";
import { addDays, buildSeed, TODAY } from "./data/seed";
import { NEXT_STATUS } from "./lib/domain";
import { sessionUser } from "./session";

const KEY = "swyv-demo-v3";

type Action =
  | { type: "lang"; lang: Lang }
  | { type: "role"; role: Role }
  | { type: "book"; s: Pick<Shipment, "origin" | "branchId" | "pallets" | "date" | "window" | "returnsPickup" | "clientNote"> }
  | { type: "advance"; id: string }
  | { type: "flag"; id: string; note: string }
  | { type: "submitReturn"; form: ReturnForm }
  | { type: "payInvoice"; id: string }
  | { type: "pricing"; pricing: Pricing }
  | { type: "notify"; key: keyof AppState["notifications"]; value: boolean }
  | { type: "client"; name: string }
  | { type: "reset" };

const nowIso = () => `${TODAY}T${new Date().toTimeString().slice(0, 5)}:00+03:00`;

function reducer(s: AppState, a: Action): AppState {
  switch (a.type) {
    case "lang": return { ...s, lang: a.lang };
    case "role": return sessionUser ? s : { ...s, role: a.role };
    case "client": return { ...s, clientName: a.name };
    case "book": {
      const max = s.shipments.reduce((m, x) => Math.max(m, parseInt(x.id.slice(-6), 10)), 0);
      const sh: Shipment = {
        ...a.s, id: `SWV-26-${String(max + 1).padStart(6, "0")}`, status: "requested",
        carrierId: s.carriers[0].id, inspectorId: null, events: [{ code: "booked", at: nowIso(), by: "client" }],
      };
      return { ...s, shipments: [sh, ...s.shipments] };
    }
    case "advance":
      return {
        ...s,
        shipments: s.shipments.map((x) => {
          if (x.id !== a.id) return x;
          const next = NEXT_STATUS[x.status] as ShipmentStatus | undefined;
          if (!next) return x;
          const code = x.status === "exception" ? "resolved" : next === "delivered" ? (x.returnsPickup ? "delivered_returns" : "delivered") : next === "at_hub" ? "arrived" : next;
          return {
            ...x, status: next, note: next === "out" ? undefined : x.note,
            inspectorId: x.inspectorId ?? (next === "scheduled" ? "SW-0101" : x.inspectorId),
            events: [...x.events, { code: code as Shipment["events"][number]["code"], at: nowIso(), by: "ops" }],
          };
        }),
      };
    case "flag":
      return {
        ...s,
        shipments: s.shipments.map((x) => x.id === a.id
          ? { ...x, status: "exception", note: a.note, events: [...x.events, { code: "flag", at: nowIso(), by: "inspector", note: a.note }] } : x),
      };
    case "submitReturn":
      return {
        ...s, returns: [a.form, ...s.returns],
        shipments: s.shipments.map((x) => (x.id === a.form.shipmentId ? { ...x, returnFormId: a.form.id } : x)),
      };
    case "payInvoice": return { ...s, invoices: s.invoices.map((i) => (i.id === a.id ? { ...i, status: "paid" } : i)) };
    case "pricing": return { ...s, pricing: a.pricing };
    case "notify": return { ...s, notifications: { ...s.notifications, [a.key]: a.value } };
    case "reset": return { ...buildSeed(), lang: s.lang };
  }
}

function load(): AppState {
  let s: AppState | null = null;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) s = JSON.parse(raw) as AppState;
  } catch { /* storage unavailable */ }
  s ??= buildSeed(); // Arabic first; the top-bar button switches to English
  // Signed in through the site: the account decides the view and the opening language.
  return sessionUser ? { ...s, role: sessionUser.role, lang: sessionUser.lang } : s;
}

interface Ctx {
  s: AppState;
  lang: Lang;
  /** Pick the string for the current language. */
  t: (ar: string, en: string) => string;
  dispatch: (a: Action) => void;
  toast: (text: string) => void;
  toasts: Toast[];
}
const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, undefined, load);
  const [toasts, setToasts] = useState<Toast[]>([]);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ } }, [s]);
  useEffect(() => {
    document.documentElement.lang = s.lang;
    document.documentElement.dir = s.lang === "ar" ? "rtl" : "ltr";
  }, [s.lang]);
  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const t = useCallback((ar: string, en: string) => (s.lang === "ar" ? ar : en), [s.lang]);
  const value = useMemo(() => ({ s, lang: s.lang, t, dispatch, toast, toasts }), [s, t, toast, toasts]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

export function useRoute(fallback: string): [string, (r: string) => void] {
  const read = () => (/^[A-Za-z0-9._~-]+$/.test(location.hash.slice(1)) ? location.hash.slice(1) : fallback);
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  });
  const go = (r: string) => {
    if (location.hash.slice(1) !== r) location.hash = r;
    setRoute(r);
    scrollTo({ top: 0 });
  };
  return [route, go];
}

export const minBookDate = () => addDays(TODAY, 1);
