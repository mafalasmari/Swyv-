import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { isOtpDemo } from "./sms";

/**
 * Signs small JSON payloads for cookies (base64url payload + "." + HMAC-SHA256).
 * AUTH_SECRET is required once real SMS is on; the demo falls back to a fixed
 * secret so it works across serverless instances, and is not secure by design.
 */
function secret() {
  const value = process.env.AUTH_SECRET;
  if (value) return value;
  if (isOtpDemo()) return "swyv-demo-only-secret";
  throw new Error("AUTH_SECRET is not set");
}

export const hmac = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export function sign(payload: object) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${hmac(body)}`;
}

export function verify<T>(token: string | undefined): T | null {
  if (!token) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = Buffer.from(hmac(body));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    return JSON.parse(Buffer.from(body, "base64url").toString()) as T;
  } catch {
    return null;
  }
}

/** Constant-time comparison of two strings. */
export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
