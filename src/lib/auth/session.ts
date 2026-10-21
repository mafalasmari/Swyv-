import "server-only";
import { cookies } from "next/headers";
import { verify } from "./token";
import { findAccount, type Account } from "./users";

export const SESSION_COOKIE = "swyv_session";
export const SESSION_DAYS = 7;

export type Session = { p: string; exp: number };

/** The signed-in account, or null when there is no valid, unexpired session. */
export async function getAccount(): Promise<Account | null> {
  const session = verify<Session>((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session || Date.now() > session.exp) return null;
  return findAccount(session.p);
}
