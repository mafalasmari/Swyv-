import type { Lang, Role, Tx } from "./types";

/** The signed-in user, injected by the SWYV site when it serves the portal (/[lang]/app). */
export interface SessionUser {
  name: Tx;
  role: Role;
  lang: Lang;
  /** Sign-out URL on the site. */
  logout: string;
}

declare global {
  interface Window { __SWYV_USER__?: SessionUser }
}

/** Null when the portal runs on its own (npm run dev): the client/ops switch is shown instead. */
export const sessionUser: SessionUser | null = typeof window !== "undefined" ? window.__SWYV_USER__ ?? null : null;
