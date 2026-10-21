import { t } from "@/i18n/localize";

export const login = {
  seo: {
    title: t("دخول العملاء | بوابة سوايف", "Client login | SWYV Portal"),
    description: t("ادخل إلى بوابة سوايف برقم جوالك ورمز تحقق.", "Sign in to the SWYV Portal with your mobile number and a verification code."),
  },
  eyebrow: t("دخول العملاء", "Client login"),
  title: t("ادخل إلى بوابة سوايف", "Sign in to the SWYV Portal"),
  lead: t(
    "أدخل رقم جوالك المسجّل لدينا، وسنرسل لك رمز تحقق من 6 أرقام.",
    "Enter the mobile number registered with us and we'll text you a 6-digit code.",
  ),
  phoneLabel: t("رقم الجوال", "Mobile number"),
  phoneHint: t("مثال: 05XXXXXXXX", "e.g. 05XXXXXXXX"),
  send: t("أرسل رمز التحقق", "Send code"),
  codeLabel: t("رمز التحقق", "Verification code"),
  sentTo: t("أرسلنا الرمز إلى", "We sent the code to"),
  verify: t("تحقق وادخل", "Verify and sign in"),
  resend: t("أعد إرسال الرمز", "Resend code"),
  resendIn: t("إعادة الإرسال بعد {s} ث", "Resend in {s}s"),
  change: t("تغيير الرقم", "Change number"),
  demoNote: t(
    "وضع تجريبي: لم يُربط مزوّد رسائل بعد، لذلك يظهر الرمز هنا بدل إرساله:",
    "Demo mode: no SMS provider is connected yet, so the code is shown here instead of being sent:",
  ),
  notClient: t("لست عميلاً بعد؟", "Not a client yet?"),
  pilot: t("اطلب تجربة 30 يوماً", "Request a 30-day pilot"),
  messages: {
    badPhone: t("أدخل رقم جوال سعودي صحيحاً يبدأ بـ 05.", "Enter a valid Saudi mobile number starting with 05."),
    wait: t("أرسلنا رمزاً قبل قليل. انتظر دقيقة قبل طلب رمز جديد.", "We just sent a code. Wait a minute before asking for a new one."),
    failed: t("تعذّر إرسال الرمز. حاول مرة أخرى بعد قليل.", "We couldn't send the code. Please try again shortly."),
    expired: t("انتهت صلاحية الرمز. اطلب رمزاً جديداً.", "The code has expired. Request a new one."),
    tooMany: t("محاولات كثيرة. اطلب رمزاً جديداً.", "Too many attempts. Request a new code."),
    wrongCode: t("الرمز غير صحيح. المتبقي {left} محاولات.", "Incorrect code. {left} attempts left."),
    sms: t("رمز الدخول إلى بوابة سوايف: {code}\nصالح لمدة 5 دقائق.", "Your SWYV Portal code: {code}\nValid for 5 minutes."),
  },
};
