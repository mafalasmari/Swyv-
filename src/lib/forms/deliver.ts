import "server-only";
import type { Locale } from "@/i18n/config";
import type { FormSchema } from "./schemas";

type Submission = {
  schema: FormSchema;
  locale: Locale;
  values: Record<string, string | string[]>;
  files: File[];
};

const RESEND_URL = "https://api.resend.com/emails";

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Sends the submission to the SWYV inbox and a confirmation to the sender.
 * Needs RESEND_API_KEY, FORMS_INBOX and FORMS_FROM; without them the submission
 * is only logged, which is fine for local development.
 */
export async function deliver({ schema, locale, values, files }: Submission) {
  const key = process.env.RESEND_API_KEY;
  const inbox = process.env.FORMS_INBOX;
  const from = process.env.FORMS_FROM;

  const rows = schema.fields
    .filter((f) => f.type !== "file" && f.type !== "consent")
    .map((f) => {
      const v = values[f.name];
      return `<tr><th align="left" style="padding:4px 12px 4px 0">${escape(f.label.en)}</th><td>${escape(
        Array.isArray(v) ? v.join(", ") : (v ?? ""),
      )}</td></tr>`;
    })
    .join("");

  if (!key || !inbox || !from) {
    console.info(`[forms] ${schema.subject} (${locale})`, values, files.map((f) => `${f.name} ${f.size}B`));
    return;
  }

  const attachments = await Promise.all(
    files.map(async (f) => ({ filename: f.name, content: Buffer.from(await f.arrayBuffer()).toString("base64") })),
  );

  const send = (body: Record<string, unknown>) =>
    fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    });

  const senderEmail = typeof values.email === "string" ? values.email : "";

  await send({
    from,
    to: [inbox],
    reply_to: senderEmail || undefined,
    subject: `[SWYV] ${schema.subject}`,
    html: `<table>${rows}</table>`,
    attachments: attachments.length ? attachments : undefined,
  });

  if (senderEmail) {
    const ar = locale === "ar";
    await send({
      from,
      to: [senderEmail],
      subject: ar ? "سوايف | وصلنا طلبك" : "SWYV | We've received your request",
      html: ar
        ? `<div dir="rtl"><p>شكراً، وصلنا طلبك وسيتواصل معك فريقنا قريباً.</p><p>شركة سوايف للخدمات اللوجستية</p></div>`
        : `<p>Thank you, we've received your request. Our team will be in touch soon.</p><p>SWYV Logistics Services Co.</p>`,
    });
  }
}
