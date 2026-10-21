import "server-only";

/**
 * SMS delivery for login codes. Set SMS_PROVIDER to "unifonic" (UNIFONIC_APP_SID,
 * optional UNIFONIC_SENDER_ID) or "twilio" (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
 * TWILIO_FROM). With no provider the login runs in demo mode: the code is shown on
 * screen instead of being sent.
 */
type Provider = "unifonic" | "twilio";

const provider = (): Provider | null => {
  const p = process.env.SMS_PROVIDER?.toLowerCase();
  return p === "unifonic" || p === "twilio" ? p : null;
};

export const isOtpDemo = () => provider() === null;

/** Sends one SMS to an E.164 number (+9665XXXXXXXX). Throws on failure. */
export async function sendSms(to: string, text: string) {
  const p = provider();
  if (p === "unifonic") {
    const body = new URLSearchParams({
      AppSid: process.env.UNIFONIC_APP_SID ?? "",
      Recipient: to.replace(/^\+/, ""),
      Body: text,
      ...(process.env.UNIFONIC_SENDER_ID ? { SenderID: process.env.UNIFONIC_SENDER_ID } : {}),
    });
    const res = await fetch("https://el.cloud.unifonic.com/rest/SMS/messages", { method: "POST", body });
    const json = (await res.json().catch(() => null)) as { success?: boolean | string } | null;
    if (!res.ok || !json || String(json.success) !== "true") throw new Error(`Unifonic ${res.status}`);
    return;
  }
  if (p === "twilio") {
    const sid = process.env.TWILIO_ACCOUNT_SID ?? "";
    const auth = Buffer.from(`${sid}:${process.env.TWILIO_AUTH_TOKEN ?? ""}`).toString("base64");
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}` },
      body: new URLSearchParams({ To: to, From: process.env.TWILIO_FROM ?? "", Body: text }),
    });
    if (!res.ok) throw new Error(`Twilio ${res.status}`);
    return;
  }
  throw new Error("No SMS provider configured");
}
