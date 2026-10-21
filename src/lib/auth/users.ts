import "server-only";

export type Role = "client" | "ops";

export type Account = {
  /** E.164, e.g. +966501111111. */
  phone: string;
  name: { ar: string; en: string };
  /** Which portal dashboard the account opens: the client portal or the operations console. */
  role: Role;
};

/**
 * Accounts allowed to sign in. Demo accounts until real client records exist:
 * فيصل (client) on 0501111111 and محمد (operations) on 0502222222.
 */
export const ACCOUNTS: Account[] = [
  { phone: "+966501111111", name: { ar: "فيصل", en: "Faisal" }, role: "client" },
  { phone: "+966502222222", name: { ar: "محمد", en: "Mohammed" }, role: "ops" },
];

export const findAccount = (phone: string) => ACCOUNTS.find((a) => a.phone === phone) ?? null;
