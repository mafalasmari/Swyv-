"use server";

import { randomInt } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login } from "@/content/login";
import { hasLocale, href, type Locale } from "@/i18n/config";
import { normalizeMobile } from "@/lib/forms/validate";
import { isOtpDemo, sendSms } from "./sms";
import { SESSION_COOKIE, SESSION_DAYS } from "./session";
import { hmac, safeEqual, sign, verify } from "./token";
import { findAccount } from "./users";

/** Login state shared by the two steps of the form. */
export type LoginState = {
  step: "phone" | "code";
  /** Masked number for display, e.g. +966 5•• ••• 567. */
  masked?: string;
  error?: string;
  /** Demo mode (no SMS provider): nothing is sent and any code is accepted. */
  demo?: boolean;
  /** Epoch ms when a new code may be requested. */
  resendAt?: number;
};

const OTP_COOKIE = "swyv_otp";
const CODE_TTL_MS = 5 * 60_000;
const RESEND_MS = 60_000;
const MAX_ATTEMPTS = 5;

/** h is empty in demo mode, where any code is accepted. */
type Pending = { p: string; h: string; exp: number; sent: number; n: number };

const SA_MOBILE = /^(?:\+?966|00966|0)?(5\d{8})$/;
/** Saudi mobile to E.164 (+9665XXXXXXXX), or null. */
const toE164 = (raw: string) => {
  const m = normalizeMobile(raw).match(SA_MOBILE);
  return m ? `+966${m[1]}` : null;
};
const mask = (e164: string) => `+966 ${e164.slice(4, 5)}•• ••• ${e164.slice(-3)}`;
const codeHash = (phone: string, code: string, exp: number) => hmac(`${phone}|${code}|${exp}`);

const cookieOptions = (maxAgeS: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: maxAgeS,
});

function readLocale(data: FormData): Locale | null {
  const locale = String(data.get("_locale"));
  return hasLocale(locale) ? locale : null;
}

/** Step 1: validate the number, then text a code (demo mode: send nothing, accept any code). */
export async function requestCode(prev: LoginState, data: FormData): Promise<LoginState> {
  const locale = readLocale(data);
  if (!locale) return { step: "phone", error: "Bad request" };
  const t = login.messages;
  // Honeypot: real visitors never fill this field.
  if (String(data.get("company_website") ?? "")) return { step: "phone", error: t.failed[locale] };

  const phone = toE164(String(data.get("phone") ?? ""));
  if (!phone) return { step: "phone", error: t.badPhone[locale] };
  if (!findAccount(phone)) return { step: "phone", error: t.unknown[locale] };

  const store = await cookies();
  const now = Date.now();
  const pending = verify<Pending>(store.get(OTP_COOKIE)?.value);
  if (pending && pending.p === phone && now - pending.sent < RESEND_MS) {
    return { step: "code", masked: mask(phone), resendAt: pending.sent + RESEND_MS, error: t.wait[locale] };
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
  const exp = now + CODE_TTL_MS;
  const demo = isOtpDemo();
  if (!demo) {
    try {
      await sendSms(phone, t.sms[locale].replace("{code}", code));
    } catch (error) {
      console.error("[login] SMS failed", error);
      return { step: "phone", error: t.failed[locale] };
    }
  }
  const h = demo ? "" : codeHash(phone, code, exp);
  store.set(OTP_COOKIE, sign({ p: phone, h, exp, sent: now, n: 0 } satisfies Pending), cookieOptions(CODE_TTL_MS / 1000));
  return { step: "code", masked: mask(phone), resendAt: now + RESEND_MS, demo: demo || undefined };
}

/** Step 2: check the code; on success start a session and open the portal. */
export async function verifyCode(prev: LoginState, data: FormData): Promise<LoginState> {
  const locale = readLocale(data);
  if (!locale) return { ...prev, error: "Bad request" };
  const t = login.messages;
  const store = await cookies();
  const pending = verify<Pending>(store.get(OTP_COOKIE)?.value);
  const base = { step: "code" as const, masked: prev.masked, resendAt: prev.resendAt, demo: prev.demo };

  if (!pending || Date.now() > pending.exp) {
    store.delete(OTP_COOKIE);
    return { step: "phone", error: t.expired[locale] };
  }
  if (pending.n >= MAX_ATTEMPTS) {
    store.delete(OTP_COOKIE);
    return { step: "phone", error: t.tooMany[locale] };
  }

  const code = String(data.get("code") ?? "").replace(/\D/g, "");
  const ok = pending.h === "" ? code.length > 0 : code.length === 6 && safeEqual(codeHash(pending.p, code, pending.exp), pending.h);
  if (!ok) {
    const n = pending.n + 1;
    const left = MAX_ATTEMPTS - n;
    if (left <= 0) {
      store.delete(OTP_COOKIE);
      return { step: "phone", error: t.tooMany[locale] };
    }
    store.set(OTP_COOKIE, sign({ ...pending, n }), cookieOptions(Math.max(1, Math.round((pending.exp - Date.now()) / 1000))));
    return { ...base, error: t.wrongCode[locale].replace("{left}", String(left)) };
  }

  store.delete(OTP_COOKIE);
  store.set(SESSION_COOKIE, sign({ p: pending.p, exp: Date.now() + SESSION_DAYS * 86_400_000 }), cookieOptions(SESSION_DAYS * 86_400));
  redirect(href(locale, "/app"));
}
