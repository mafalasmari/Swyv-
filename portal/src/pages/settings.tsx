import { useState } from "react";
import { useStore } from "../store";
import type { Lang, Pricing } from "../types";
import { sar } from "../lib/domain";
import { Icon, PageHead, Panel, Pill } from "../components/ui";

export function Settings() {
  const { s, lang, t, dispatch, toast } = useStore();
  const [name, setName] = useState(s.clientName);
  const [p, setP] = useState<Pricing>(s.pricing);
  const [confirmReset, setConfirmReset] = useState(false);
  const priceFields: [keyof Pricing, string][] = [
    ["perPallet", t("العبور والتوزيع لكل طبلية", "Cross-docking per pallet")], ["dedicatedTrip", t("رحلة مخصصة", "Dedicated trip")],
    ["returnStop", t("سحب مرتجعات لكل نقطة", "Returns pickup per point")], ["sortPerPallet", t("فرز لكل طبلية", "Sorting per pallet")],
  ];
  const notif = [["email", t("تحديثات الشحنات بالبريد", "Shipment updates by email")], ["sms", t("رسالة نصية عند كل ملاحظة", "SMS on every exception")], ["daily", t("ملخص يومي الساعة 8 مساءً", "Daily summary at 8 pm")]] as const;
  return (
    <>
      <PageHead title={t("الإعدادات", "Settings")} sub={t("بيانات الحساب واللغة والإشعارات والتكامل", "Account, language, notifications and integrations")} />
      <div className="grid2">
        <Panel title={t("الحساب", "Account")} pad>
          <form className="stack8" onSubmit={(e) => { e.preventDefault(); dispatch({ type: "client", name: name.trim() }); toast(t("حُفظ اسم الحساب", "Account name saved")); }}>
            <label className="fl" htmlFor="set-name">{t("اسم الشركة", "Company name")}</label>
            <input id="set-name" className="inp" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("[اسم العميل]", "[Client name]")} />
            <div><button className="btn primary" type="submit">{t("حفظ", "Save")}</button></div>
          </form>
        </Panel>
        <Panel title={t("اللغة", "Language")} pad>
          <div className="stack8" role="radiogroup" aria-label={t("اللغة", "Language")}>
            {([["ar", "العربية"], ["en", "English"]] as [Lang, string][]).map(([v, label]) => (
              <label key={v} className="toggle" htmlFor={`lang-${v}`}>
                <input id={`lang-${v}`} type="radio" name="lang" checked={lang === v} onChange={() => dispatch({ type: "lang", lang: v })} />
                <span lang={v}>{label}</span>
              </label>
            ))}
            <p className="muted small">{t("تُرسل الإشعارات والفواتير بلغة الحساب.", "Notifications and invoices are sent in the account language.")}</p>
          </div>
        </Panel>
        <Panel title={t("الإشعارات", "Notifications")} pad>
          <div className="stack8">
            {notif.map(([k, label]) => (
              <label key={k} className="toggle" htmlFor={`n-${k}`}>
                <input id={`n-${k}`} type="checkbox" checked={s.notifications[k]} onChange={(e) => dispatch({ type: "notify", key: k, value: e.target.checked })} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </Panel>
        <Panel title={t("المستخدمون", "Users")} pad>
          <ul className="users">
            <li><span><b>{t("[مدير العمليات]", "[Operations manager]")}</b><small className="muted">{t("حجز الشحنات، الفروع، المرتجعات", "Bookings, branches, returns")}</small></span><Pill tone="info">{t("مدير", "Admin")}</Pill></li>
            <li><span><b>{t("[المدير المالي]", "[Finance manager]")}</b><small className="muted">{t("الفواتير والتقارير", "Invoices and reports")}</small></span><Pill tone="idle">{t("مالي", "Finance")}</Pill></li>
            <li><span><b>{t("مسؤولو الفروع", "Branch officers")}</b><small className="muted">{t("توقيع نماذج الفحص فقط", "Sign audit forms only")}</small></span><Pill tone="idle">{t("12 فرعاً", "12 branches")}</Pill></li>
          </ul>
        </Panel>
        <Panel title={t("التكامل", "Integrations")} pad>
          <ul className="users">
            <li><span><b>{t("ربط ERP / API", "ERP / API link")}</b><small className="muted">{t("إرسال الحجوزات واستقبال حالة الشحنات آلياً", "Push bookings and receive shipment status automatically")}</small></span><Pill tone="idle">{t("مرحلة لاحقة", "Later phase")}</Pill></li>
            <li><span><b>{t("تصدير شهري للمحاسبة", "Monthly accounting export")}</b><small className="muted">{t("ملف الفاتورة مع كشف الرحلات", "Invoice file with trip statement")}</small></span><Pill tone="ok">{t("مفعّل", "On")}</Pill></li>
          </ul>
        </Panel>
        {s.role === "ops" && (
          <Panel title={t("قائمة الأسعار (عمليات SWYV)", "Price list (SWYV ops)")} pad>
            <form className="form" onSubmit={(e) => { e.preventDefault(); dispatch({ type: "pricing", pricing: p }); toast(t("حُدّثت الأسعار", "Prices updated")); }}>
              {priceFields.map(([k, label]) => (
                <div className="f" key={k}><label htmlFor={`p-${k}`}>{label} ({t("ريال", "SAR")})</label>
                  <input id={`p-${k}`} className="inp num" type="number" min={0} value={p[k]} onChange={(e) => setP({ ...p, [k]: parseFloat(e.target.value) || 0 })} /></div>
              ))}
              <div className="full row between wrap gap8"><span className="muted small">{t("الحالي:", "Current:")} <span className="num">{sar(s.pricing.perPallet)}</span> {t("للطبلية", "per pallet")}</span><button className="btn primary" type="submit">{t("حفظ الأسعار", "Save prices")}</button></div>
            </form>
          </Panel>
        )}
        <Panel title={t("بيانات العرض", "Demo data")} pad>
          <div className="stack8">
            <p className="muted">{t("كل ما تفعله هنا يُحفظ في هذا المتصفح فقط، ولا يراه أي زائر آخر.", "Everything you do here is saved in this browser only. No other visitor sees it.")}</p>
            {!confirmReset ? (
              <div><button className="btn" onClick={() => setConfirmReset(true)}><Icon name="refresh" />{t("إعادة بيانات العرض", "Reset demo data")}</button></div>
            ) : (
              <div className="row gap8 wrap">
                <span>{t("ستُحذف الحجوزات والنماذج التي أضفتها.", "Your bookings and forms will be removed.")}</span>
                <button className="btn danger" onClick={() => { dispatch({ type: "reset" }); setConfirmReset(false); setName(""); toast(t("أُعيدت بيانات العرض", "Demo data reset")); }}>{t("تأكيد الإعادة", "Confirm reset")}</button>
                <button className="btn ghost" onClick={() => setConfirmReset(false)}>{t("إلغاء", "Cancel")}</button>
              </div>
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}
