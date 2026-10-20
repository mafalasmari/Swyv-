import { t, type Tx } from "@/i18n/localize";
import { careers } from "@/content/careers";
import { industries } from "@/content/industries";
import { services } from "@/content/services";

export type FieldType = "text" | "email" | "tel" | "number" | "select" | "multi" | "textarea" | "file" | "consent";

export type FieldDef = {
  name: string;
  label: Tx;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: Tx }[];
  /** Full-width on the two-column grid. */
  wide?: boolean;
  autoComplete?: string;
  accept?: string;
  multiple?: boolean;
  min?: number;
};

export type FormId = "pilot" | "carrier" | "career" | "contact";
export type FormSchema = { id: FormId; subject: string; fields: FieldDef[]; submit: Tx };

export const MAX_FILE_BYTES = 4 * 1024 * 1024;

const name: FieldDef = { name: "name", label: t("الاسم الكامل", "Full name"), type: "text", required: true, autoComplete: "name" };
const mobile: FieldDef = { name: "mobile", label: t("الجوال", "Mobile"), type: "tel", required: true, autoComplete: "tel" };
const email: FieldDef = { name: "email", label: t("البريد الإلكتروني", "Email"), type: "email", required: true, autoComplete: "email" };
const consent: FieldDef = { name: "consent", label: t("أوافق على سياسة الخصوصية", "I agree to the privacy policy"), type: "consent", required: true, wide: true };

export const FORMS: Record<FormId, FormSchema> = {
  pilot: {
    id: "pilot",
    subject: "Pilot request",
    submit: t("أرسل الطلب", "Submit request"),
    fields: [
      name,
      { name: "jobTitle", label: t("المسمى الوظيفي", "Job title"), type: "text", required: true, autoComplete: "organization-title" },
      { name: "company", label: t("اسم الشركة", "Company"), type: "text", required: true, autoComplete: "organization" },
      {
        name: "industry",
        label: t("القطاع", "Industry"),
        type: "select",
        required: true,
        options: [
          ...industries.sectors.map((s) => ({ value: s.code, label: s.name })),
          { value: "OTHER", label: t("أخرى", "Other") },
        ],
      },
      { name: "branches", label: t("عدد الفروع في الرياض", "Branches in Riyadh"), type: "number", required: true, min: 1 },
      { name: "districts", label: t("الأحياء الرئيسية", "Main districts"), type: "text" },
      {
        name: "origin",
        label: t("مصدر البضاعة", "Goods come from"),
        type: "select",
        required: true,
        options: [
          { value: "riyadh", label: t("داخل الرياض", "Within Riyadh") },
          { value: "dammam", label: t("الدمام", "Dammam") },
          { value: "jeddah", label: t("جدة", "Jeddah") },
          { value: "other", label: t("أخرى", "Other") },
        ],
      },
      mobile,
      email,
      {
        name: "services",
        label: t("الخدمات المطلوبة", "Services needed"),
        type: "multi",
        required: true,
        wide: true,
        options: services.available.map((s) => ({ value: s.id, label: s.title })),
      },
      { name: "notes", label: t("ملاحظات", "Notes"), type: "textarea", wide: true },
      consent,
    ],
  },
  carrier: {
    id: "carrier",
    subject: "Carrier registration",
    submit: t("أرسل التسجيل", "Submit registration"),
    fields: [
      { name: "company", label: t("اسم الشركة", "Company"), type: "text", required: true, autoComplete: "organization" },
      { name: "contact", label: t("اسم المسؤول", "Contact"), type: "text", required: true, autoComplete: "name" },
      mobile,
      email,
      { name: "vans", label: t("عدد الفانات", "Vans"), type: "number", min: 0 },
      { name: "dyna", label: t("عدد الدينا", "3-ton (Dyna)"), type: "number", min: 0 },
      { name: "lorry", label: t("عدد اللوري", "7-ton (lorry)"), type: "number", min: 0 },
      { name: "trailer", label: t("عدد التريلات", "Trailers"), type: "number", min: 0 },
      { name: "licences", label: t("أرقام التراخيص", "Licence numbers"), type: "text", required: true, wide: true },
      { name: "areas", label: t("المناطق التي تخدمها", "Areas served"), type: "text", required: true, wide: true },
      {
        name: "documents",
        label: t("رفع المستندات (اختياري)", "Upload documents (optional)"),
        type: "file",
        wide: true,
        multiple: true,
        accept: ".pdf,.jpg,.jpeg,.png",
      },
      consent,
    ],
  },
  career: {
    id: "career",
    subject: "Job application",
    submit: t("أرسل الطلب", "Submit application"),
    fields: [
      name,
      mobile,
      email,
      {
        name: "role",
        label: t("الوظيفة", "Role"),
        type: "select",
        required: true,
        options: careers.roles.map((r) => ({ value: r.id, label: r.title })),
      },
      {
        name: "cv",
        label: t("السيرة الذاتية", "CV"),
        type: "file",
        required: true,
        wide: true,
        accept: ".pdf,.doc,.docx",
      },
      consent,
    ],
  },
  contact: {
    id: "contact",
    subject: "Website enquiry",
    submit: t("أرسل الرسالة", "Send message"),
    fields: [
      { ...name, label: t("الاسم", "Name") },
      { name: "company", label: t("الشركة", "Company"), type: "text", autoComplete: "organization" },
      mobile,
      email,
      {
        name: "enquiry",
        label: t("نوع الاستفسار", "Enquiry type"),
        type: "select",
        required: true,
        wide: true,
        options: [
          { value: "new", label: t("خدمة جديدة", "New service") },
          { value: "client", label: t("عميل حالي", "Existing client") },
          { value: "carrier", label: t("ناقل", "Carrier") },
          { value: "job", label: t("وظيفة", "Job") },
          { value: "other", label: t("أخرى", "Other") },
        ],
      },
      { name: "message", label: t("الرسالة", "Message"), type: "textarea", required: true, wide: true },
      consent,
    ],
  },
};

export const formMessages = {
  required: t("هذا الحقل مطلوب", "This field is required"),
  email: t("أدخل بريداً إلكترونياً صحيحاً", "Enter a valid email address"),
  mobile: t("أدخل رقم جوال سعودياً صحيحاً، مثل 05xxxxxxxx", "Enter a valid Saudi mobile, e.g. 05xxxxxxxx"),
  number: t("أدخل رقماً صحيحاً", "Enter a valid number"),
  file: t("الملف أكبر من 4 ميجابايت أو بصيغة غير مدعومة", "File is over 4 MB or not a supported type"),
  tooFast: t("أُرسل النموذج بسرعة كبيرة. انتظر لحظة ثم أعد المحاولة.", "The form was sent too quickly. Wait a moment and try again."),
  failed: t("تعذّر إرسال النموذج. حاول مرة أخرى.", "We couldn't send the form. Please try again."),
  fixErrors: t("راجع الحقول المظللة.", "Please check the highlighted fields."),
  select: t("اختر", "Select"),
  readPolicy: t("اقرأ سياسة الخصوصية", "Read the privacy policy"),
  sending: t("جارٍ الإرسال…", "Sending…"),
};

export type FormState = {
  status: "idle" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string | string[]>;
};
