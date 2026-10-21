import { useState } from "react";
import { useStore } from "../store";
import { ACTOR, branchOf, carrierName, dateFmt, eventLabel, inspectorName, NEXT_LABEL, NEXT_STATUS, ORIGIN, STATUS, STEPS, timeOf, tx, ZONE } from "../lib/domain";
import { Drawer, Icon, Pill } from "./ui";

const STEP_INDEX = { requested: 0, scheduled: 1, at_hub: 3, out: 4, delivered: 5, exception: 3 } as const;

export function ShipmentDrawer({ id, onClose, onOpenReturn }: { id: string | null; onClose: () => void; onOpenReturn?: (id: string) => void }) {
  const { s, lang, t, dispatch, toast } = useStore();
  const sh = s.shipments.find((x) => x.id === id);
  const [flagging, setFlagging] = useState(false);
  const [note, setNote] = useState("");
  if (!sh) return null;
  const br = branchOf(s, sh.branchId);
  const cur = STEP_INDEX[sh.status];
  const next = NEXT_STATUS[sh.status];
  return (
    <Drawer open={!!id} onClose={onClose} title={<span className="code">{sh.id}</span>}>
      <div className="stack16">
        <div className="row between wrap gap8">
          <Pill tone={STATUS[sh.status].tone}>{STATUS[sh.status][lang]}</Pill>
          <span className="muted">{dateFmt(lang, sh.date, true)} · {t("نافذة", "Window")} <span className="num">{sh.window}</span></span>
        </div>
        {sh.note && <div className="callout bad"><Icon name="alert" /><span>{tx(lang, sh.note)}</span></div>}

        <ol className="steps" aria-label={t("مراحل الشحنة", "Shipment stages")}>
          {STEPS.map((st, i) => (
            <li key={st.en} className={i < cur || sh.status === "delivered" ? "done" : i === cur ? (sh.status === "exception" ? "bad" : "now") : ""}>
              <span>{st[lang]}</span>
            </li>
          ))}
        </ol>

        <dl className="meta">
          <dt>{t("الفرع", "Branch")}</dt><dd>{br.name[lang]} · {ZONE[br.zone][lang]}</dd>
          <dt>{t("المصدر", "Origin")}</dt><dd>{ORIGIN[sh.origin][lang]} {lang === "ar" ? "←" : "→"} {t("نقطة العبور شرق الرياض", "East Riyadh cross-dock")}</dd>
          <dt>{t("الطبليات", "Pallets")}</dt><dd className="num">{sh.pallets}</dd>
          <dt>{t("سحب مرتجعات", "Returns pickup")}</dt><dd>{sh.returnsPickup ? t("نعم، في رحلة العودة", "Yes, on the return trip") : t("لا", "No")}</dd>
          <dt>{t("الناقل", "Carrier")}</dt><dd>{carrierName(s, sh.carrierId)}</dd>
          <dt>{t("المشرف", "Inspector")}</dt><dd>{inspectorName(lang, sh.inspectorId)}</dd>
          {sh.clientNote && <><dt>{t("ملاحظة العميل", "Client note")}</dt><dd>{sh.clientNote}</dd></>}
        </dl>

        <div>
          <h3 className="h3">{t("سجل الأحداث", "Event log")}</h3>
          <ol className="events">
            {[...sh.events].reverse().map((e, i) => (
              <li key={i}>
                <span className="num ev-t">{dateFmt(lang, e.at)} {timeOf(e.at)}</span>
                <span>{eventLabel(lang, e, sh)}{e.by && <small className="muted"> · {ACTOR[e.by][lang]}</small>}</span>
              </li>
            ))}
          </ol>
        </div>

        {sh.returnFormId && onOpenReturn && (
          <button className="btn" onClick={() => onOpenReturn(sh.returnFormId!)}><Icon name="clip" />{t("نموذج فحص المرتجعات", "Returns audit form")} <span className="code">{sh.returnFormId}</span></button>
        )}
        <div className="callout"><Icon name="doc" /><span>{t("صور الفحص وإثبات التسليم الموقّع تُرفق بالوثيقة عند ربط تطبيق المشرف.", "Inspection photos and signed proof of delivery attach to the waybill once the inspector app is connected.")}</span></div>

        {s.role === "ops" && (
          <div className="stack8 opsbox">
            <h3 className="h3">{t("إجراءات العمليات", "Ops actions")}</h3>
            {next && (
              <button className="btn primary" onClick={() => { dispatch({ type: "advance", id: sh.id }); toast(`${sh.id}: ${STATUS[next][lang]}`); }}>
                <Icon name="check" />{NEXT_LABEL[sh.status]![lang]}
              </button>
            )}
            {sh.status !== "delivered" && sh.status !== "exception" && !flagging && (
              <button className="btn" onClick={() => setFlagging(true)}><Icon name="alert" />{t("تسجيل ملاحظة", "Log exception")}</button>
            )}
            {flagging && (
              <form className="stack8" onSubmit={(e) => { e.preventDefault(); if (!note.trim()) return; dispatch({ type: "flag", id: sh.id, note: note.trim() }); toast(t("سُجلت الملاحظة وأُبلغ العميل", "Exception logged and client notified")); setFlagging(false); setNote(""); }}>
                <label className="fl" htmlFor="flag-note">{t("وصف الملاحظة", "Describe the issue")}</label>
                <input id="flag-note" className="inp" value={note} onChange={(e) => setNote(e.target.value)} placeholder={t("مثال: ختم مكسور على طبلية PLT-0420", "e.g. broken seal on pallet PLT-0420")} />
                <div className="row gap8"><button className="btn primary" type="submit">{t("حفظ الملاحظة", "Save")}</button><button className="btn ghost" type="button" onClick={() => setFlagging(false)}>{t("إلغاء", "Cancel")}</button></div>
              </form>
            )}
          </div>
        )}
      </div>
    </Drawer>
  );
}
