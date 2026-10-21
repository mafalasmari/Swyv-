import { useMemo, useState } from "react";
import { useStore } from "../store";
import { SKUS, TODAY } from "../data/seed";
import { branchName, CODE_ORDER, CODES, dateFmt, NEXT_LABEL, NEXT_STATUS, pct, REASON, sar, STATUS, tx } from "../lib/domain";
import type { Reason, ReturnCode, ReturnLine, ShipmentStatus } from "../types";
import { Empty, Icon, Kpi, PageHead, Panel, Pill } from "../components/ui";

const COLS: ShipmentStatus[] = ["requested", "scheduled", "at_hub", "out", "exception"];

export function Dispatch({ openShipment }: { openShipment: (id: string) => void }) {
  const { s, lang, t, dispatch, toast } = useStore();
  const active = s.shipments.filter((x) => x.status !== "delivered");
  const deliveredToday = s.shipments.filter((x) => x.date === TODAY && x.status === "delivered").length;
  const cnt = (st: ShipmentStatus) => active.filter((x) => x.status === st).length;
  return (
    <>
      <PageHead title={t("لوحة التشغيل", "Dispatch board")} sub={`${dateFmt(lang, TODAY, true)} · ${t("كل شحنة مفتوحة من الحجز حتى التسليم", "every open shipment from booking to delivery")}`} />
      <section className="kpis">
        <Kpi label={t("بانتظار الجدولة", "Awaiting schedule")} value={<span className="num">{cnt("requested")}</span>} tone="warn" />
        <Kpi label={t("في نقطة العبور الآن", "At cross-dock now")} value={<span className="num">{cnt("at_hub")}</span>} />
        <Kpi label={t("في الطريق", "Out for delivery")} value={<span className="num">{cnt("out")}</span>} />
        <Kpi label={t("سُلّمت اليوم", "Delivered today")} value={<span className="num">{deliveredToday}</span>} tone="ok" />
      </section>
      <div className="board">
        {COLS.map((c) => {
          const items = active.filter((x) => x.status === c).sort((a, b) => (a.date < b.date ? -1 : 1));
          return (
            <section key={c} className={`col col-${STATUS[c].tone}`} aria-label={STATUS[c][lang]}>
              <header><b>{STATUS[c][lang]}</b><span className="cnt">{items.length}</span></header>
              <div className="cards">
                {items.map((x) => (
                  <article key={x.id} className="card">
                    <button className="card-main" onClick={() => openShipment(x.id)}>
                      <span className="code">{x.id}</span>
                      <b>{branchName(s, x.branchId)}</b>
                      <small className="muted">{dateFmt(lang, x.date)} · <span className="num">{x.window}</span> · {x.pallets} {t("طبلية", "pallets")}{x.returnsPickup ? t(" · مرتجعات", " · returns") : ""}</small>
                      {x.note && <small className="bad-t">{tx(lang, x.note)}</small>}
                    </button>
                    {NEXT_STATUS[x.status] && (
                      <button className="btn sm primary" onClick={() => { dispatch({ type: "advance", id: x.id }); toast(`${x.id}: ${STATUS[NEXT_STATUS[x.status]!][lang]}`); }}>
                        {NEXT_LABEL[x.status]![lang]}
                      </button>
                    )}
                  </article>
                ))}
                {!items.length && <p className="muted small pad8">{t("لا شيء هنا", "Nothing here")}</p>}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

interface Draft { sku: string; qty: number; code: ReturnCode; reason: Reason }
const REASONS: Reason[] = ["overstock", "near_expiry", "wrong_order", "complaint", "recall", "other"];
const blank = (): Draft => ({ sku: SKUS[0].sku, qty: 1, code: "ok", reason: "overstock" });

export function Inspector() {
  const { s, lang, t, dispatch, toast } = useStore();
  const pending = useMemo(() => s.shipments.filter((x) => x.status === "delivered" && x.returnsPickup && !x.returnFormId), [s.shipments]);
  const outNow = s.shipments.filter((x) => x.status === "out" && x.returnsPickup && !x.returnFormId);
  const [shipId, setShip] = useState("");
  const [lines, setLines] = useState<Draft[]>([blank()]);
  const [signer, setSigner] = useState("");
  const [signed, setSigned] = useState(false);
  const [err, setErr] = useState("");
  const sh = s.shipments.find((x) => x.id === shipId);
  const upd = (i: number, p: Partial<Draft>) => setLines(lines.map((l, j) => (j === i ? { ...l, ...p } : l)));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sh) return setErr(t("اختر الشحنة التي سُحبت منها المرتجعات.", "Choose the shipment the returns came from."));
    if (!lines.length || lines.some((l) => !(l.qty >= 1))) return setErr(t("كل صنف يحتاج كمية 1 على الأقل.", "Every item needs a quantity of at least 1."));
    if (!signer.trim() || !signed) return setErr(t("اسم مسؤول الفرع وتوقيعه مطلوبان قبل التحميل.", "The branch officer's name and sign-off are required before loading."));
    const max = s.returns.reduce((m, f) => Math.max(m, parseInt(f.id.slice(4), 10)), 0);
    const ls: ReturnLine[] = lines.map((l) => ({ ...l, unitValue: SKUS.find((k) => k.sku === l.sku)!.value }));
    const id = `RET-${String(max + 1).padStart(4, "0")}`;
    dispatch({ type: "submitReturn", form: { id, shipmentId: sh.id, branchId: sh.branchId, date: TODAY, inspectorId: sh.inspectorId ?? "SW-0101", branchSigner: signer.trim(), signed: true, lines: ls } });
    toast(t(`حُفظ النموذج ${id} وأُرسل للعميل`, `Form ${id} saved and sent to the client`));
    setShip(""); setLines([blank()]); setSigner(""); setSigned(false); setErr("");
  };
  const value = lines.reduce((a, l) => a + (l.qty || 0) * (SKUS.find((k) => k.sku === l.sku)?.value ?? 0), 0);
  return (
    <>
      <PageHead title={t("فحص المرتجعات", "Returns audit")} sub={t("نسخة المشرف الميداني من النموذج الورقي. يُعبأ في الفرع قبل التحميل.", "The field inspector's version of the printed form. Completed at the branch before loading.")} />
      <Panel title={t("نموذج جديد", "New form")} pad>
        <form className="stack16" onSubmit={submit} noValidate>
          <div className="form">
            <div className="f full"><label htmlFor="i-ship">{t("الشحنة", "Shipment")}</label>
              <select id="i-ship" className="inp" value={shipId} onChange={(e) => setShip(e.target.value)}>
                <option value="">{t("اختر شحنة…", "Choose a shipment…")}</option>
                {[...outNow, ...pending].map((x) => <option key={x.id} value={x.id}>{x.id} · {branchName(s, x.branchId)} · {STATUS[x.status][lang]}</option>)}
              </select>
              {!outNow.length && !pending.length && <small className="muted">{t("لا شحنات بانتظار نموذج. حرّك شحنة إلى \"في الطريق\" من لوحة التشغيل.", "No shipments waiting for a form. Move one to \"Out for delivery\" on the dispatch board.")}</small>}
            </div>
          </div>
          <div className="tbl">
            <table className="edit">
              <thead><tr><th>{t("الصنف", "Item")}</th><th>{t("الكمية", "Qty")}</th><th>{t("الحالة", "Condition")}</th><th>{t("السبب", "Reason")}</th><th><span className="sr">{t("حذف", "Remove")}</span></th></tr></thead>
              <tbody>
                {lines.map((l, i) => (
                  <tr key={i}>
                    <td><label className="sr" htmlFor={`l-sku-${i}`}>{t("الصنف", "Item")}</label>
                      <select id={`l-sku-${i}`} className="inp" value={l.sku} onChange={(e) => upd(i, { sku: e.target.value })}>
                        {SKUS.map((k) => <option key={k.sku} value={k.sku}>{k.name[lang]}</option>)}
                      </select></td>
                    <td><label className="sr" htmlFor={`l-q-${i}`}>{t("الكمية", "Qty")}</label><input id={`l-q-${i}`} className="inp num qty" type="number" min={1} value={Number.isNaN(l.qty) ? "" : l.qty} onChange={(e) => upd(i, { qty: parseInt(e.target.value, 10) })} /></td>
                    <td><label className="sr" htmlFor={`l-c-${i}`}>{t("الحالة", "Condition")}</label>
                      <select id={`l-c-${i}`} className="inp" value={l.code} onChange={(e) => upd(i, { code: e.target.value as ReturnCode })}>
                        {CODE_ORDER.map((c) => <option key={c} value={c}>{CODES[c].letter} · {CODES[c].label[lang]}</option>)}
                      </select></td>
                    <td><label className="sr" htmlFor={`l-r-${i}`}>{t("السبب", "Reason")}</label>
                      <select id={`l-r-${i}`} className="inp" value={l.reason} onChange={(e) => upd(i, { reason: e.target.value as Reason })}>
                        {REASONS.map((r) => <option key={r} value={r}>{REASON[r][lang]}</option>)}
                      </select></td>
                    <td><button type="button" className="btn ghost icon" aria-label={t("حذف السطر", "Remove line")} onClick={() => setLines(lines.filter((_, j) => j !== i))}><Icon name="x" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row between wrap gap8">
            <button type="button" className="btn" onClick={() => setLines([...lines, blank()])}><Icon name="plus" />{t("إضافة صنف", "Add item")}</button>
            <span className="muted">{t("قيمة الأصناف:", "Item value:")} <b className="num">{sar(value)}</b></span>
          </div>
          <div className="form">
            <div className="f"><label htmlFor="i-signer">{t("اسم مسؤول الفرع", "Branch officer name")}</label><input id="i-signer" className="inp" value={signer} onChange={(e) => setSigner(e.target.value)} /></div>
            <label className="check" htmlFor="i-signed"><input id="i-signed" type="checkbox" checked={signed} onChange={(e) => setSigned(e.target.checked)} />
              <span><b>{t("أقر مسؤول الفرع بحالة الأصناف", "Branch officer confirms the recorded condition")}</b><small className="muted">{t("في التطبيق الفعلي: توقيع على الشاشة + صور", "In production: on-screen signature + photos")}</small></span></label>
          </div>
          {err && <p className="err" role="alert">{err}</p>}
          <div><button className="btn primary" type="submit"><Icon name="check" />{t("حفظ النموذج وإرسال نسخة للعميل", "Save form and send copy to client")}</button></div>
        </form>
      </Panel>
    </>
  );
}

export function Carriers() {
  const { s, lang, t } = useStore();
  return (
    <>
      <PageHead title={t("الناقلون", "Carriers")} sub={t("ناقلون مرخصون بالباطن. الأداء يحدد توزيع الرحلات.", "Licensed subcontractors. Performance decides trip allocation.")} />
      <Panel>
        <div className="tbl">
          <table>
            <thead><tr><th>{t("الناقل", "Carrier")}</th><th>{t("الترخيص", "Licence")}</th><th>{t("المركبات", "Vehicles")}</th><th>{t("رحلات (8 أسابيع)", "Trips (8 weeks)")}</th><th>{t("الالتزام بالنافذة", "On-window rate")}</th><th>{t("مطالبات", "Claims")}</th><th>{t("التقييم", "Rating")}</th></tr></thead>
            <tbody>
              {s.carriers.map((c) => {
                const tone = c.onTime >= 0.95 && c.claims === 0 ? "ok" : c.onTime >= 0.92 ? "warn" : "bad";
                return (
                  <tr key={c.id}>
                    <td><b>{c.name[lang]}</b></td><td className="code">{c.license}</td><td>{c.vehicles[lang]}</td>
                    <td className="num">{c.trips}</td><td className="num">{pct(c.onTime)}</td><td className="num">{c.claims}</td>
                    <td><Pill tone={tone}>{tone === "ok" ? t("أساسي", "Primary") : tone === "warn" ? t("تحت المتابعة", "On watch") : t("احتياطي", "Backup")}</Pill></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title={t("شروط التعاقد مع الناقل", "Carrier contract terms")} pad>
        <ul className="ticks">
          <li>{t("ترخيص نقل بضائع ساري من الهيئة العامة للنقل، وسائقون مسجلون", "Valid TGA goods-transport licence and registered drivers")}</li>
          <li>{t("تأمين على البضاعة لا يقل عن سقف المسؤولية في اتفاقيات العملاء", "Cargo insurance at least equal to the liability cap in client agreements")}</li>
          <li>{t("غرامة تأخير متفق عليها لكل نافذة تسليم فائتة", "Agreed penalty for every missed delivery window")}</li>
          <li>{t("تقييم أسبوعي: الالتزام بالنافذة، المطالبات، ملاحظات المشرفين", "Weekly review: window compliance, claims, inspector notes")}</li>
        </ul>
      </Panel>
      {!s.carriers.length && <Empty title={t("لا ناقلين بعد", "No carriers yet")} />}
    </>
  );
}
