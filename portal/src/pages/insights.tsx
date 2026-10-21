import { useMemo, useState } from "react";
import { useStore } from "../store";
import { TODAY, addDays } from "../data/seed";
import { branchName, CODE_ORDER, CODES, dateFmt, lineValue, metrics, num, pct, recoveredValue, sar, units, weekly } from "../lib/domain";
import type { ReturnCode } from "../types";
import { BarChart, LineChart, ShareBars, SplitBar } from "../components/charts";
import { Empty, Icon, Kpi, PageHead, Panel, Pill, Seg } from "../components/ui";

export function Returns({ openReturn }: { openReturn: (id: string) => void }) {
  const { s, lang, t } = useStore();
  const [range, setRange] = useState<"30" | "90">("30");
  const from = addDays(TODAY, range === "30" ? -29 : -89);
  const forms = s.returns.filter((f) => f.date >= from);
  const byCode = useMemo(() => {
    const m: Record<ReturnCode, number> = { ok: 0, near: 0, expired: 0, damaged: 0, repack: 0, dead: 0 };
    forms.forEach((f) => f.lines.forEach((l) => (m[l.code] += l.qty)));
    return m;
  }, [forms]);
  const total = forms.reduce((a, f) => a + lineValue(f), 0);
  const rec = forms.reduce((a, f) => a + recoveredValue(f), 0);
  const branchRows = s.branches
    .map((b) => ({ label: b.name[lang], value: forms.filter((f) => f.branchId === b.id).reduce((a, f) => a + recoveredValue(f), 0), color: "var(--accent)" }))
    .filter((r) => r.value > 0).sort((a, b) => b.value - a.value).slice(0, 8);
  return (
    <>
      <PageHead title={t("المرتجعات", "Returns")} sub={t("كل ما سُحب في رحلات العودة، مفروزاً حسب الحالة وموقّعاً من الفروع", "Everything collected on return trips, sorted by condition and signed by branches")}
        actions={<Seg label={t("الفترة", "Period")} value={range} onChange={setRange} options={[{ v: "30", t: t("30 يوماً", "30 days") }, { v: "90", t: t("90 يوماً", "90 days") }]} />} />
      <section className="kpis">
        <Kpi label={t("نماذج فحص موقّعة", "Signed audit forms")} value={<span className="num">{forms.length}</span>} />
        <Kpi label={t("وحدات مرتجعة", "Return units")} value={<span className="num">{num(forms.reduce((a, f) => a + units(f), 0))}</span>} />
        <Kpi label={t("قيمة مستردة", "Recovered value")} value={<span className="num">{sar(rec)}</span>} sub={t(`${pct(total ? rec / total : 0, 0)} من قيمة المرتجعات`, `${pct(total ? rec / total : 0, 0)} of returned value`)} tone="ok" />
        <Kpi label={t("تالف ومنتهي موثّق", "Documented damaged + expired")} value={<span className="num">{sar(total - rec)}</span>} sub={t("جاهز لمطالبة المورد أو الإتلاف", "Ready for supplier claim or disposal")} />
      </section>
      <Panel title={t("الحالة عند الفحص", "Condition at inspection")} pad>
        <SplitBar parts={CODE_ORDER.map((c) => ({ label: CODES[c].short[lang], value: byCode[c], color: CODES[c].color }))} />
        <div className="codes">
          {CODE_ORDER.map((c) => (
            <div key={c} className="codecard">
              <span className="code-dot lg" style={{ background: CODES[c].color }}>{CODES[c].letter}</span>
              <div><b>{CODES[c].label[lang]}</b><small className="muted">{CODES[c].dest[lang]}</small></div>
              <span className="num">{num(byCode[c])}</span>
            </div>
          ))}
        </div>
      </Panel>
      <div className="grid2">
        <Panel title={t("أعلى الفروع في القيمة المستردة", "Top branches by recovered value")} pad>
          {branchRows.length ? <ShareBars rows={branchRows} format={(v) => sar(v)} /> : <Empty title={t("لا مرتجعات في هذه الفترة", "No returns in this period")} />}
        </Panel>
        <Panel title={t("آخر نماذج الفحص", "Latest audit forms")}>
          <ul className="list">
            {forms.slice(0, 7).map((f) => (
              <li key={f.id}>
                <button onClick={() => openReturn(f.id)}>
                  <span><b className="code">{f.id}</b><small className="muted">{branchName(s, f.branchId)} · {dateFmt(lang, f.date)}</small></span>
                  <span className="end"><span className="num">{sar(recoveredValue(f))}</span><Pill tone={f.signed ? "ok" : "warn"}>{f.signed ? t("موقّع", "Signed") : t("بانتظار التوقيع", "Unsigned")}</Pill></span>
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}

export function Reports() {
  const { s, lang, t, toast } = useStore();
  const w = weekly(s, lang);
  const m30 = metrics(s);
  const m90 = metrics(s, addDays(TODAY, -89));
  const csv = () => {
    const text = "week_start,trips,pallets,on_time,recovered_sar\n" +
      weekly(s, "en").map((x) => [x.label, x.trips, x.pallets, x.onTime.toFixed(3), Math.round(x.recovered)].join(",")).join("\n");
    navigator.clipboard?.writeText(text).then(
      () => toast(t("نُسخ الجدول بصيغة CSV", "Copied as CSV")),
      () => toast(t("تعذر النسخ. حدّد الجدول وانسخه يدوياً.", "Couldn't copy. Select the table and copy it manually.")));
  };
  return (
    <>
      <PageHead title={t("التقارير", "Reports")} sub={t("مؤشرات الأداء الأسبوعية للإدارة التشغيلية والمالية", "Weekly KPIs for operations and finance")}
        actions={<button className="btn" onClick={csv}><Icon name="doc" />{t("نسخ البيانات CSV", "Copy data as CSV")}</button>} />
      <div className="grid2">
        <Panel title={t("نسبة التسليم بلا ملاحظات", "Clean delivery rate")} pad>
          <LineChart ariaLabel={t("نسبة التسليم الأسبوعية", "Weekly clean delivery rate")} data={w.map((x) => ({ label: x.label, value: x.onTime }))} min={0.8} max={1} target={0.95} targetLabel={t("الهدف", "Target")} format={(v) => pct(v, 0)} />
        </Panel>
        <Panel title={t("رحلات أسبوعياً", "Trips per week")} pad>
          <BarChart ariaLabel={t("رحلات أسبوعياً", "Trips per week")} data={w.map((x) => ({ label: x.label, value: x.trips }))} />
        </Panel>
      </div>
      <Panel title={t("ملخص الفترات", "Period summary")}>
        <div className="tbl">
          <table>
            <thead><tr><th>{t("المؤشر", "Metric")}</th><th>{t("آخر 30 يوماً", "Last 30 days")}</th><th>{t("آخر 90 يوماً (المتاح)", "Last 90 days (available)")}</th></tr></thead>
            <tbody>
              <tr><td>{t("الرحلات", "Trips")}</td><td className="num">{m30.trips}</td><td className="num">{m90.trips}</td></tr>
              <tr><td>{t("الطبليات", "Pallets")}</td><td className="num">{num(m30.pallets)}</td><td className="num">{num(m90.pallets)}</td></tr>
              <tr><td>{t("التسليم بلا ملاحظات", "Clean deliveries")}</td><td className="num">{pct(m30.onTime)}</td><td className="num">{pct(m90.onTime)}</td></tr>
              <tr><td>{t("وحدات مرتجعة", "Return units")}</td><td className="num">{num(m30.returnUnits)}</td><td className="num">{num(m90.returnUnits)}</td></tr>
              <tr><td>{t("قيمة مستردة", "Recovered value")}</td><td className="num">{sar(m30.recovered)}</td><td className="num">{sar(m90.recovered)}</td></tr>
              <tr><td>{t("سعر الطبلية المتعاقد", "Contracted price per pallet")}</td><td className="num">{sar(s.pricing.perPallet)}</td><td className="num">{sar(s.pricing.perPallet)}</td></tr>
            </tbody>
          </table>
        </div>
      </Panel>
      <p className="muted small">{t("بيانات العرض تغطي 8 أسابيع. في التشغيل الفعلي تُرسل هذه التقارير شهرياً للمدير المالي بالبريد.", "Demo data covers 8 weeks. In production these reports are emailed to finance monthly.")}</p>
    </>
  );
}

export function Calculator() {
  const { t } = useStore();
  const [v, setV] = useState({ pallets: 400, cur: 95, rtrips: 20, rcost: 450, fines: 3000, stuck: 60000, swyv: 82, rfee: 40, recovery: 60 });
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: Math.max(0, parseFloat(e.target.value) || 0) });
  const before = v.pallets * v.cur + v.rtrips * v.rcost + v.fines;
  const after = v.pallets * v.swyv + v.rtrips * v.rfee;
  const save = before - after;
  const fields: [keyof typeof v, string][] = [
    ["pallets", t("طبليات شهرياً", "Pallets per month")], ["cur", t("تكلفتك الحالية للطبلية (ريال)", "Your current cost per pallet (SAR)")],
    ["rtrips", t("رحلات سحب مرتجعات منفصلة شهرياً", "Separate returns trips per month")], ["rcost", t("تكلفة رحلة المرتجعات (ريال)", "Cost per returns trip (SAR)")],
    ["fines", t("مخالفات وانتظار شاحنات شهرياً (ريال)", "Truck fines and waiting per month (SAR)")], ["stuck", t("مرتجعات راكدة في الفروع الآن (ريال)", "Dead returns in branches today (SAR)")],
    ["swyv", t("سعر SWYV للطبلية (ريال)", "SWYV price per pallet (SAR)")], ["rfee", t("رسم سحب المرتجعات لكل نقطة (ريال)", "Returns pickup fee per point (SAR)")],
    ["recovery", t("نسبة الاسترداد المتوقعة %", "Expected recovery rate %")],
  ];
  return (
    <>
      <PageHead title={t("حاسبة التوفير", "Savings calculator")} sub={t("أدخل أرقامك الحالية لترى الفرق شهرياً وسنوياً", "Enter your current figures to see the monthly and annual difference")} />
      <div className="grid-book">
        <Panel title={t("أرقامك", "Your figures")} pad>
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            {fields.map(([k, label]) => (
              <div className="f" key={k}><label htmlFor={`c-${k}`}>{label}</label><input id={`c-${k}`} className="inp num" type="number" min={0} value={v[k]} onChange={set(k)} /></div>
            ))}
          </form>
        </Panel>
        <Panel title={t("النتيجة", "Result")} pad className="sticky">
          <dl className="cmp">
            <dt>{t("التكلفة الحالية شهرياً", "Current monthly cost")}</dt><dd className="num">{sar(before)}</dd>
            <dt>{t("التكلفة مع SWYV شهرياً", "Monthly cost with SWYV")}</dt><dd className="num">{sar(after)}</dd>
          </dl>
          <div className="savebox">
            <span>{t("التوفير الشهري", "Monthly saving")}</span>
            <b className="num">{sar(save)}</b>
            <small><span className="num">{before ? pct(save / before) : "—"}</span> · <span className="num">{sar(save * 12)}</span> {t("سنوياً", "a year")}</small>
          </div>
          <dl className="cmp">
            <dt>{t("سيولة تتحرر من الراكد (مرة واحدة)", "Cash released from dead stock (one-off)")}</dt><dd className="num">{sar((v.stuck * v.recovery) / 100)}</dd>
          </dl>
          <p className="muted small">{t("القيم الافتراضية أمثلة توضيحية. عدد نقاط السحب يساوي رحلات المرتجعات الحالية.", "Default values are illustrative. Pickup points equal your current returns trips.")}</p>
        </Panel>
      </div>
    </>
  );
}
