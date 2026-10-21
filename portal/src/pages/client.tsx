import { useMemo, useState } from "react";
import { minBookDate, useStore } from "../store";
import { TODAY, addDays } from "../data/seed";
import {
  branchName, byDateDesc, clientLabel, dateFmt, INVOICE_ITEM, INVOICE_STATUS, invoiceTotals, metrics, num, ORIGIN, pct, recoveredValue, sar, STATUS, units, weekly, ZONE,
} from "../lib/domain";
import type { Origin, ShipmentStatus } from "../types";
import { BarChart } from "../components/charts";
import { Empty, Icon, Kpi, PageHead, Panel, Pill, Seg } from "../components/ui";

type Go = (r: string) => void;
const kfmt = (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(v % 1000 ? 1 : 0)}k` : String(Math.round(v)));

export function Overview({ go, openShipment }: { go: Go; openShipment: (id: string) => void }) {
  const { s, lang, t } = useStore();
  const m = metrics(s);
  const w = weekly(s, lang);
  const today = s.shipments.filter((x) => x.date === TODAY);
  const upcoming = s.shipments.filter((x) => x.date > TODAY).length;
  const due = s.invoices.filter((i) => i.status === "due" || i.status === "overdue");
  return (
    <>
      <PageHead title={`${t("مرحباً،", "Welcome,")} ${clientLabel(s)}`} sub={`${dateFmt(lang, TODAY, true)} · ${t("آخر 30 يوماً", "last 30 days")}`}
        actions={<button className="btn primary" onClick={() => go("book")}><Icon name="plus" />{t("حجز شحنة", "Book shipment")}</button>} />
      <section className="kpis">
        <Kpi label={t("طبليات تم نقلها", "Pallets moved")} value={<span className="num">{num(m.pallets)}</span>} sub={t(`عبر ${m.trips} رحلة`, `across ${m.trips} trips`)} />
        <Kpi label={t("التسليم بلا ملاحظات", "Clean deliveries")} value={<span className="num">{pct(m.onTime)}</span>} sub={t("الهدف 95%", "Target 95%")} tone={m.onTime >= 0.95 ? "ok" : "warn"} />
        <Kpi label={t("وحدات مرتجعة سُحبت", "Return units collected")} value={<span className="num">{num(m.returnUnits)}</span>} sub={t(`${m.forms} نموذج فحص موقّع`, `${m.forms} signed audit forms`)} />
        <Kpi label={t("قيمة عادت للدورة المالية", "Value back in the cash cycle")} value={<span className="num">{sar(m.recovered)}</span>} sub={t("صالح + قريب الانتهاء + راكد", "OK + near expiry + dead stock")} />
      </section>

      {(m.openExceptions > 0 || due.length > 0) && (
        <div className="alerts">
          {m.openExceptions > 0 && (
            <button className="callout bad clickable" onClick={() => go("shipments")}>
              <Icon name="alert" /><span><b>{t(`${m.openExceptions} شحنة عليها ملاحظة`, `${m.openExceptions} shipments with exceptions`)}</b> · {t("راجع التفاصيل والصور", "review details and photos")}</span><Icon name="arrow" />
            </button>
          )}
          {due.map((i) => (
            <button key={i.id} className="callout warn clickable" onClick={() => go("invoices")}>
              <Icon name="bill" /><span><b>{t(`فاتورة ${i.period.ar} مستحقة`, `${i.period.en} invoice due`)}</b> · <span className="num">{sar(invoiceTotals(i, s.pricing.vat).total)}</span> {t("قبل", "by")} {dateFmt(lang, i.due)}</span><Icon name="arrow" />
            </button>
          ))}
        </div>
      )}

      <div className="grid2">
        <Panel title={t("شحنات اليوم", "Today's shipments")} actions={<span className="muted small">{t(`${upcoming} شحنة قادمة`, `${upcoming} upcoming`)}</span>}>
          <ul className="today">
            {today.map((x) => (
              <li key={x.id}>
                <button onClick={() => openShipment(x.id)}>
                  <span className="t-br">{branchName(s, x.branchId)}<small className="muted"><span className="num">{x.window}</span> · {x.pallets} {t("طبلية", "pallets")}</small></span>
                  <Pill tone={STATUS[x.status].tone}>{STATUS[x.status][lang]}</Pill>
                </button>
              </li>
            ))}
            {!today.length && <Empty title={t("لا شحنات اليوم", "No shipments today")} />}
          </ul>
        </Panel>
        <Panel title={t("طبليات أسبوعياً", "Pallets per week")} actions={<span className="muted small">{t("آخر 8 أسابيع", "last 8 weeks")}</span>} pad>
          <BarChart ariaLabel={t("طبليات أسبوعياً", "Pallets per week")} data={w.map((x) => ({ label: x.label, value: x.pallets }))} />
        </Panel>
      </div>
      <Panel title={t("القيمة المستردة من المرتجعات أسبوعياً", "Recovered return value per week (SAR)")} pad actions={<button className="btn ghost sm" onClick={() => go("returns")}>{t("تفاصيل المرتجعات", "Returns detail")}</button>}>
        <BarChart ariaLabel={t("القيمة المستردة أسبوعياً", "Recovered value per week")} data={w.map((x) => ({ label: x.label, value: x.recovered }))} format={kfmt} />
      </Panel>
    </>
  );
}

const FILTERS: ("all" | ShipmentStatus)[] = ["all", "requested", "scheduled", "at_hub", "out", "delivered", "exception"];

export function Shipments({ go, openShipment }: { go: Go; openShipment: (id: string) => void }) {
  const { s, lang, t } = useStore();
  const [f, setF] = useState<"all" | ShipmentStatus>("all");
  const [q, setQ] = useState("");
  const [br, setBr] = useState("all");
  const [limit, setLimit] = useState(30);
  const rows = useMemo(() => s.shipments
    .filter((x) => (f === "all" || x.status === f) && (br === "all" || x.branchId === br))
    .filter((x) => !q || x.id.includes(q.toUpperCase()) || branchName(s, x.branchId).toLowerCase().includes(q.toLowerCase()))
    .sort(byDateDesc), [s, f, q, br]);
  const count = (v: string) => (v === "all" ? s.shipments.length : s.shipments.filter((x) => x.status === v).length);
  return (
    <>
      <PageHead title={t("الشحنات", "Shipments")} sub={t("كل رحلة من نقطة العبور إلى الفرع، مع سجل الفحص والتسليم", "Every trip from cross-dock to branch, with its inspection and delivery log")}
        actions={<button className="btn primary" onClick={() => go("book")}><Icon name="plus" />{t("حجز شحنة", "Book shipment")}</button>} />
      <Panel>
        <div className="toolbar">
          <Seg label={t("تصفية حسب الحالة", "Filter by status")} value={f} onChange={(v) => { setF(v); setLimit(30); }}
            options={FILTERS.map((v) => ({ v, t: v === "all" ? t("الكل", "All") : STATUS[v][lang], n: count(v) }))} />
          <div className="row gap8 wrap">
            <label className="search"><Icon name="search" /><span className="sr">{t("بحث", "Search")}</span>
              <input id="ship-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("رقم الوثيقة أو الفرع", "Waybill or branch")} /></label>
            <label className="sr" htmlFor="ship-br">{t("الفرع", "Branch")}</label>
            <select id="ship-br" className="inp" value={br} onChange={(e) => setBr(e.target.value)}>
              <option value="all">{t("كل الفروع", "All branches")}</option>
              {s.branches.map((b) => <option key={b.id} value={b.id}>{b.name[lang]}</option>)}
            </select>
          </div>
        </div>
        <div className="tbl">
          <table className="rows">
            <thead><tr><th>{t("الوثيقة", "Waybill")}</th><th>{t("التاريخ", "Date")}</th><th>{t("الفرع", "Branch")}</th><th>{t("طبليات", "Pallets")}</th><th>{t("النافذة", "Window")}</th><th>{t("مرتجعات", "Returns")}</th><th>{t("الحالة", "Status")}</th></tr></thead>
            <tbody>
              {rows.slice(0, limit).map((x) => (
                <tr key={x.id} tabIndex={0} onClick={() => openShipment(x.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openShipment(x.id); } }}>
                  <td className="code">{x.id}</td>
                  <td>{dateFmt(lang, x.date)}</td>
                  <td>{branchName(s, x.branchId)}</td>
                  <td className="num">{x.pallets}</td>
                  <td className="num">{x.window}</td>
                  <td>{x.returnFormId ? <span className="code">{x.returnFormId}</span> : x.returnsPickup ? t("مطلوب", "Requested") : "—"}</td>
                  <td><Pill tone={STATUS[x.status].tone}>{STATUS[x.status][lang]}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && <Empty title={t("لا شحنات تطابق التصفية", "No shipments match")} hint={t("جرّب حالة أو فرعاً آخر", "Try another status or branch")} />}
        </div>
        {rows.length > limit && <div className="more"><button className="btn ghost" onClick={() => setLimit(limit + 30)}>{t("عرض المزيد", "Show more")} ({rows.length - limit})</button></div>}
      </Panel>
    </>
  );
}

const ORIGINS: Origin[] = ["dammam", "jeddah", "kharj", "qassim", "riyadh_wh"];

export function Book({ go }: { go: Go }) {
  const { s, lang, t, dispatch, toast } = useStore();
  const [branchId, setBranch] = useState(s.branches[0].id);
  const [date, setDate] = useState(minBookDate());
  const [pallets, setPallets] = useState(10);
  const [origin, setOrigin] = useState<Origin>("dammam");
  const [returnsPickup, setRet] = useState(true);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const br = s.branches.find((b) => b.id === branchId)!;
  const p = s.pricing;
  const est = pallets * p.perPallet + (returnsPickup ? p.returnStop : 0);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date < minBookDate()) return setErr(t("أقرب موعد متاح هو الغد. اختر تاريخاً لاحقاً.", "The earliest slot is tomorrow. Pick a later date."));
    if (!(pallets >= 1 && pallets <= 26)) return setErr(t("عدد الطبليات بين 1 و 26 للرحلة الواحدة. للأكثر احجز رحلة إضافية.", "One trip carries 1–26 pallets. Book another trip for more."));
    setErr("");
    dispatch({ type: "book", s: { origin, branchId, pallets, date, window: br.window, returnsPickup, clientNote: note.trim() || undefined } });
    toast(t("تم الحجز. ستصلك الجدولة خلال ساعتين عمل.", "Booked. You'll get the schedule within two business hours."));
    go("shipments");
  };
  return (
    <>
      <PageHead title={t("حجز شحنة", "Book a shipment")} sub={t("حدد الفرع والموعد، ونتولى الناقل ونقطة العبور والفحص", "Choose the branch and date; we handle the carrier, cross-dock and inspection")} />
      <div className="grid-book">
        <Panel title={t("تفاصيل الشحنة", "Shipment details")} pad>
          <form className="form" onSubmit={submit} noValidate>
            <div className="f"><label htmlFor="b-br">{t("الفرع المستلم", "Receiving branch")}</label>
              <select id="b-br" className="inp" value={branchId} onChange={(e) => setBranch(e.target.value)}>
                {s.branches.map((b) => <option key={b.id} value={b.id}>{b.name[lang]} · {ZONE[b.zone][lang]}</option>)}
              </select></div>
            <div className="f"><label htmlFor="b-or">{t("مدينة المصدر", "Origin")}</label>
              <select id="b-or" className="inp" value={origin} onChange={(e) => setOrigin(e.target.value as Origin)}>
                {ORIGINS.map((o) => <option key={o} value={o}>{ORIGIN[o][lang]}</option>)}
              </select></div>
            <div className="f"><label htmlFor="b-date">{t("تاريخ التسليم", "Delivery date")}</label>
              <input id="b-date" className="inp" type="date" min={minBookDate()} max={addDays(TODAY, 60)} value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div className="f"><label htmlFor="b-pal">{t("عدد الطبليات", "Pallets")}</label>
              <input id="b-pal" className="inp num" type="number" min={1} max={26} value={Number.isNaN(pallets) ? "" : pallets} onChange={(e) => setPallets(parseInt(e.target.value, 10))} /></div>
            <div className="f full"><span className="fl">{t("نافذة استلام الفرع", "Branch receiving window")}</span><span className="ro num">{br.window}</span></div>
            <label className="check full" htmlFor="b-ret">
              <input id="b-ret" type="checkbox" checked={returnsPickup} onChange={(e) => setRet(e.target.checked)} />
              <span><b>{t("سحب المرتجعات في رحلة العودة", "Collect returns on the return trip")}</b><small className="muted">{t("المشرف يعبئ نموذج الفحص ويوقعه مسؤول الفرع قبل التحميل", "The inspector completes the audit form and the branch officer signs it before loading")}</small></span>
            </label>
            <div className="f full"><label htmlFor="b-note">{t("ملاحظات للمشرف (اختياري)", "Notes for the inspector (optional)")}</label>
              <textarea id="b-note" className="inp" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("مثال: الاستلام من البوابة الخلفية", "e.g. receive at the back gate")} /></div>
            {err && <p className="err full" role="alert">{err}</p>}
            <div className="full row gap8"><button className="btn primary" type="submit">{t("تأكيد الحجز", "Confirm booking")}</button><button className="btn ghost" type="button" onClick={() => go("shipments")}>{t("إلغاء", "Cancel")}</button></div>
          </form>
        </Panel>
        <Panel title={t("التكلفة التقديرية", "Estimated cost")} pad className="sticky">
          <dl className="cmp">
            <dt>{Number.isNaN(pallets) ? 0 : pallets} {t("طبلية", "pallets")} × {p.perPallet}</dt><dd className="num">{sar((pallets || 0) * p.perPallet)}</dd>
            {returnsPickup && <><dt>{t("سحب مرتجعات", "Returns pickup")}</dt><dd className="num">{sar(p.returnStop)}</dd></>}
            <dt>{t("ضريبة القيمة المضافة 15%", "VAT 15%")}</dt><dd className="num">{sar((est || 0) * p.vat)}</dd>
            <dt className="tot">{t("الإجمالي", "Total")}</dt><dd className="tot num">{sar((est || 0) * (1 + p.vat))}</dd>
          </dl>
          <p className="muted small">{t(`فرز المرتجعات يُحتسب بعد الفحص (${p.sortPerPallet} ريال لكل طبلية مفروزة). الأسعار حسب اتفاقيتك.`, `Returns sorting is billed after inspection (SAR ${p.sortPerPallet} per sorted pallet). Prices per your agreement.`)}</p>
        </Panel>
      </div>
    </>
  );
}

export function Branches() {
  const { s, lang, t } = useStore();
  const from = addDays(TODAY, -29);
  const rows = s.branches.map((b) => {
    const sh = s.shipments.filter((x) => x.branchId === b.id && x.date >= from && x.date <= TODAY);
    const rets = s.returns.filter((f) => f.branchId === b.id && f.date >= from);
    const done = sh.filter((x) => x.status === "delivered" || x.status === "exception");
    return {
      b, trips: sh.length, pallets: sh.reduce((a, x) => a + x.pallets, 0),
      onTime: done.length ? done.filter((x) => x.status === "delivered").length / done.length : null,
      units: rets.reduce((a, f) => a + units(f), 0), recovered: rets.reduce((a, f) => a + recoveredValue(f), 0),
    };
  }).sort((a, b) => b.pallets - a.pallets);
  return (
    <>
      <PageHead title={t("الفروع", "Branches")} sub={t("أداء كل فرع خلال آخر 30 يوماً", "Each branch over the last 30 days")} />
      <Panel>
        <div className="tbl">
          <table>
            <thead><tr><th>{t("الفرع", "Branch")}</th><th>{t("المنطقة", "Zone")}</th><th>{t("نافذة الاستلام", "Receiving window")}</th><th>{t("رحلات", "Trips")}</th><th>{t("طبليات", "Pallets")}</th><th>{t("بلا ملاحظات", "Clean")}</th><th>{t("وحدات مرتجعة", "Return units")}</th><th>{t("قيمة مستردة", "Recovered")}</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.b.id}>
                  <td><b>{r.b.name[lang]}</b></td>
                  <td>{ZONE[r.b.zone][lang]}</td>
                  <td className="num">{r.b.window}</td>
                  <td className="num">{r.trips}</td>
                  <td className="num">{r.pallets}</td>
                  <td>{r.onTime === null ? "—" : <Pill tone={r.onTime >= 0.95 ? "ok" : "warn"}>{pct(r.onTime, 0)}</Pill>}</td>
                  <td className="num">{num(r.units)}</td>
                  <td className="num">{sar(r.recovered)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

export function Invoices() {
  const { s, lang, t, dispatch, toast } = useStore();
  const [open, setOpen] = useState(s.invoices[0]?.id);
  const inv = s.invoices.find((i) => i.id === open);
  const tot = inv && invoiceTotals(inv, s.pricing.vat);
  return (
    <>
      <PageHead title={t("الفواتير", "Invoices")} sub={t("فاتورة شهرية واحدة، مرفق بها كشف الرحلات ووثائق الشحن ونماذج الفحص", "One monthly invoice with trip statement, waybills and audit forms attached")} />
      <div className="grid2 wide-end">
        <Panel title={t("كل الفواتير", "All invoices")}>
          <ul className="list">
            {s.invoices.map((i) => (
              <li key={i.id}>
                <button aria-current={open === i.id} onClick={() => setOpen(i.id)}>
                  <span><b>{i.period[lang]}</b><small className="muted code">{i.id}</small></span>
                  <span className="end"><span className="num">{sar(invoiceTotals(i, s.pricing.vat).total)}</span><Pill tone={INVOICE_STATUS[i.status].tone}>{INVOICE_STATUS[i.status][lang]}</Pill></span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
        {inv && tot && (
          <Panel title={<span>{t("فاتورة", "Invoice")} <span className="code">{inv.id}</span></span>} actions={<Pill tone={INVOICE_STATUS[inv.status].tone}>{INVOICE_STATUS[inv.status][lang]}</Pill>}>
            <div className="pb stack16">
              <dl className="meta">
                <dt>{t("الفترة", "Period")}</dt><dd>{inv.period[lang]}</dd>
                <dt>{t("تاريخ الإصدار", "Issued")}</dt><dd>{dateFmt(lang, inv.issued)}</dd>
                <dt>{t("الاستحقاق", "Due")}</dt><dd>{dateFmt(lang, inv.due)}</dd>
              </dl>
              <div className="tbl">
                <table>
                  <thead><tr><th>{t("البند", "Item")}</th><th>{t("الكمية", "Qty")}</th><th>{t("الوحدة", "Unit")}</th><th>{t("السعر", "Price")}</th><th>{t("المبلغ", "Amount")}</th></tr></thead>
                  <tbody>
                    {inv.lines.map((l) => (
                      <tr key={l.item}><td>{INVOICE_ITEM[l.item].name[lang]}</td><td className="num">{num(l.qty)}</td><td>{INVOICE_ITEM[l.item].unit[lang]}</td><td className="num">{l.price ? sar(l.price) : t("مجاناً", "Free")}</td><td className="num">{sar(l.qty * l.price)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <dl className="cmp">
                <dt>{t("المجموع قبل الضريبة", "Subtotal")}</dt><dd className="num">{sar(tot.subtotal)}</dd>
                <dt>{t("ضريبة القيمة المضافة 15%", "VAT 15%")}</dt><dd className="num">{sar(tot.vat)}</dd>
                <dt className="tot">{t("الإجمالي", "Total")}</dt><dd className="tot num">{sar(tot.total)}</dd>
              </dl>
              {(inv.status === "due" || inv.status === "overdue") && (
                <button className="btn primary" onClick={() => { dispatch({ type: "payInvoice", id: inv.id }); toast(t("سُجل التحويل. سيظهر الإيصال بعد مطابقته.", "Transfer recorded. The receipt appears once reconciled.")); }}>
                  <Icon name="check" />{t("تسجيل تحويل بنكي", "Record bank transfer")}
                </button>
              )}
              {inv.status === "draft" && <p className="muted small">{t("مسودة تتحدث يومياً حتى نهاية الشهر.", "Draft, updated daily until month end.")}</p>}
            </div>
          </Panel>
        )}
      </div>
    </>
  );
}
