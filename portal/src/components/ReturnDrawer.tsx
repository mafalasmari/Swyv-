import { useStore } from "../store";
import { branchName, CODES, dateFmt, inspectorName, lineValue, num, officerLabel, REASON, recoveredValue, sar, skuName, units } from "../lib/domain";
import { Drawer, Pill } from "./ui";

export function ReturnDrawer({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { s, lang, t } = useStore();
  const f = s.returns.find((x) => x.id === id);
  if (!f) return null;
  return (
    <Drawer open={!!id} onClose={onClose} title={<span className="code">{f.id}</span>}>
      <div className="stack16">
        <div className="row between wrap gap8">
          <Pill tone={f.signed ? "ok" : "warn"}>{f.signed ? t("موقّع من الفرع", "Signed by branch") : t("بانتظار التوقيع", "Awaiting signature")}</Pill>
          <span className="muted">{dateFmt(lang, f.date, true)}</span>
        </div>
        <dl className="meta">
          <dt>{t("الفرع", "Branch")}</dt><dd>{branchName(s, f.branchId)}</dd>
          <dt>{t("وثيقة الشحن", "Waybill")}</dt><dd className="code">{f.shipmentId}</dd>
          <dt>{t("المشرف", "Inspector")}</dt><dd>{inspectorName(lang, f.inspectorId)}</dd>
          <dt>{t("مسؤول الفرع", "Branch officer")}</dt><dd>{officerLabel(lang, f.branchSigner)}</dd>
          <dt>{t("الوحدات", "Units")}</dt><dd className="num">{num(units(f))}</dd>
          <dt>{t("القيمة المستردة", "Recovered value")}</dt><dd><span className="num">{sar(recoveredValue(f))}</span> {t("من", "of")} <span className="num">{sar(lineValue(f))}</span></dd>
        </dl>
        <div className="tbl">
          <table>
            <thead><tr><th>{t("الصنف", "Item")}</th><th>{t("الكمية", "Qty")}</th><th>{t("الحالة", "Condition")}</th><th>{t("السبب", "Reason")}</th><th>{t("القيمة", "Value")}</th></tr></thead>
            <tbody>
              {f.lines.map((l, i) => (
                <tr key={i}>
                  <td>{skuName(lang, l.sku)}<br /><small className="muted num">{l.sku}</small></td>
                  <td className="num">{l.qty}</td>
                  <td><span className="code-dot" style={{ background: CODES[l.code].color }}>{CODES[l.code].letter}</span> {CODES[l.code].short[lang]}</td>
                  <td>{REASON[l.reason][lang]}</td>
                  <td className="num">{sar(l.qty * l.unitValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">{t("الوجهة بعد الفرز تُحدد حسب رمز الحالة: الصالح للمخزون، وقريب الانتهاء للتصفية أو المورد، والتالف والمنتهي للإتلاف الموثق.", "Post-sort destination follows the condition code: OK back to stock, near-expiry to clearance or the supplier, damaged and expired to documented disposal.")}</p>
      </div>
    </Drawer>
  );
}
