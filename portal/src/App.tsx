import { useEffect, useState } from "react";
import { useRoute, useStore } from "./store";
import { clientLabel } from "./lib/domain";
import { Icon, Logo } from "./components/ui";
import { ShipmentDrawer } from "./components/ShipmentDrawer";
import { ReturnDrawer } from "./components/ReturnDrawer";
import { Book, Branches, Invoices, Overview, Shipments } from "./pages/client";
import { Calculator, Reports, Returns } from "./pages/insights";
import { Carriers, Dispatch, Inspector } from "./pages/ops";
import { Settings } from "./pages/settings";
import { sessionUser } from "./session";
import type { Role, Tx } from "./types";

const NAV: Record<Role, { id: string; t: Tx; icon: string }[]> = {
  client: [
    { id: "overview", t: { ar: "نظرة عامة", en: "Overview" }, icon: "home" },
    { id: "shipments", t: { ar: "الشحنات", en: "Shipments" }, icon: "truck" },
    { id: "book", t: { ar: "حجز شحنة", en: "Book shipment" }, icon: "plus" },
    { id: "returns", t: { ar: "المرتجعات", en: "Returns" }, icon: "undo" },
    { id: "branches", t: { ar: "الفروع", en: "Branches" }, icon: "pin" },
    { id: "invoices", t: { ar: "الفواتير", en: "Invoices" }, icon: "bill" },
    { id: "reports", t: { ar: "التقارير", en: "Reports" }, icon: "chart" },
    { id: "calculator", t: { ar: "حاسبة التوفير", en: "Savings calculator" }, icon: "calc" },
    { id: "settings", t: { ar: "الإعدادات", en: "Settings" }, icon: "gear" },
  ],
  ops: [
    { id: "dispatch", t: { ar: "لوحة التشغيل", en: "Dispatch board" }, icon: "board" },
    { id: "inspector", t: { ar: "فحص المرتجعات", en: "Returns audit" }, icon: "clip" },
    { id: "shipments", t: { ar: "كل الشحنات", en: "All shipments" }, icon: "truck" },
    { id: "returns", t: { ar: "المرتجعات", en: "Returns" }, icon: "undo" },
    { id: "carriers", t: { ar: "الناقلون", en: "Carriers" }, icon: "users" },
    { id: "reports", t: { ar: "التقارير", en: "Reports" }, icon: "chart" },
    { id: "settings", t: { ar: "الأسعار والإعدادات", en: "Prices & settings" }, icon: "gear" },
  ],
};

export default function App() {
  const { s, lang, t, dispatch, toasts } = useStore();
  const home = s.role === "client" ? "overview" : "dispatch";
  const [route, go] = useRoute(home);
  const [ship, setShip] = useState<string | null>(null);
  const [ret, setRet] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const nav = NAV[s.role];
  const valid = nav.some((n) => n.id === route);
  const page = valid ? route : home;
  useEffect(() => { if (!valid) go(home); }, [valid, home]); // eslint-disable-line react-hooks/exhaustive-deps

  const switchRole = (r: Role) => { dispatch({ type: "role", role: r }); go(r === "client" ? "overview" : "dispatch"); setMenu(false); };
  const openReturn = (id: string) => { setShip(null); setRet(id); };

  return (
    <div className="app" dir={lang === "ar" ? "rtl" : "ltr"} lang={lang}>
      <header className="top">
        <div className="top-in">
          <button className="btn ghost icon menu-btn" aria-label={t("القائمة", "Menu")} aria-expanded={menu} onClick={() => setMenu(!menu)}><Icon name="board" /></button>
          <Logo />
          <span className="divider" />
          <span className="who"><b>{s.role === "client" ? t("بوابة العميل", "Client portal") : t("عمليات SWYV", "SWYV operations")}</b><small className="muted">{s.role === "client" ? clientLabel(s) : t("نقطة العبور · شرق الرياض", "Cross-dock · East Riyadh")}</small></span>
          {sessionUser ? (
            <div className="account">
              <span className="account-name"><Icon name="users" />{sessionUser.name[lang]}</span>
              <a className="btn ghost sm" href={sessionUser.logout}>{t("خروج", "Sign out")}</a>
            </div>
          ) : (
            <div className="role" role="group" aria-label={t("طريقة العرض", "View")}>
              <button aria-pressed={s.role === "client"} onClick={() => switchRole("client")}>{t("العميل", "Client")}</button>
              <button aria-pressed={s.role === "ops"} onClick={() => switchRole("ops")}>{t("العمليات", "Ops")}</button>
            </div>
          )}
          <button className="btn ghost sm langbtn" onClick={() => dispatch({ type: "lang", lang: lang === "ar" ? "en" : "ar" })}
            aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}>
            <span lang={lang === "ar" ? "en" : "ar"}>{lang === "ar" ? "EN" : "عربي"}</span>
          </button>
          <span className="demo-tag">{t("عرض تجريبي", "Demo")}</span>
        </div>
      </header>
      <div className="shell">
        <nav className={`side ${menu ? "open" : ""}`} aria-label={t("الأقسام", "Sections")}>
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} aria-current={page === n.id ? "page" : undefined}
              onClick={(e) => { e.preventDefault(); go(n.id); setMenu(false); }}>
              <Icon name={n.icon} />{n.t[lang]}
            </a>
          ))}
          <p className="side-foot muted">{t("البيانات تجريبية للعرض. الأسماء والأرقام بين [ ] تُستبدل ببيانات العميل.", "Demo data. Names and numbers in [ ] are replaced with client data.")}</p>
        </nav>
        <main className="main">
          {page === "overview" && <Overview go={go} openShipment={setShip} />}
          {page === "shipments" && <Shipments go={go} openShipment={setShip} />}
          {page === "book" && <Book go={go} />}
          {page === "returns" && <Returns openReturn={setRet} />}
          {page === "branches" && <Branches />}
          {page === "invoices" && <Invoices />}
          {page === "reports" && <Reports />}
          {page === "calculator" && <Calculator />}
          {page === "settings" && <Settings />}
          {page === "dispatch" && <Dispatch openShipment={setShip} />}
          {page === "inspector" && <Inspector />}
          {page === "carriers" && <Carriers />}
        </main>
      </div>
      <ShipmentDrawer id={ship} onClose={() => setShip(null)} onOpenReturn={openReturn} />
      <ReturnDrawer id={ret} onClose={() => setRet(null)} />
      <div className="toasts" aria-live="polite">{toasts.map((x) => <div key={x.id} className="toast"><Icon name="check" />{x.text}</div>)}</div>
    </div>
  );
}
