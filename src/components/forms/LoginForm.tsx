"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FieldLabel, TextInput } from "@/components/ui/controls";
import type { Locale } from "@/i18n/config";
import { requestCode, verifyCode, type LoginState } from "@/lib/auth/actions";

export type LoginCopy = {
  phoneLabel: string;
  phoneHint: string;
  send: string;
  codeLabel: string;
  sentTo: string;
  verify: string;
  resend: string;
  resendIn: string;
  change: string;
  demoNote: string;
};

type Stamped = LoginState & { at: number };

const INITIAL: Stamped = { step: "phone", at: 0 };

/**
 * Two-step sign-in: mobile number, then the 6-digit code sent by SMS. Both steps
 * are server actions (lib/auth/actions); the newest result decides which step
 * shows. On success the server redirects to the portal.
 */
export function LoginForm({ locale, copy }: { locale: Locale; copy: LoginCopy }) {
  const [phone, setPhone] = useState("");
  const [editing, setEditing] = useState(false);
  const latest = useRef<Stamped>(INITIAL);

  const [sent, sendAction, sending] = useActionState<Stamped, FormData>(async (_prev, data) => {
    const next = { ...(await requestCode(latest.current, data)), at: Date.now() };
    latest.current = next;
    return next;
  }, INITIAL);
  const [checked, verifyAction, verifying] = useActionState<Stamped, FormData>(async (_prev, data) => {
    const next = { ...(await verifyCode(latest.current, data)), at: Date.now() };
    latest.current = next;
    return next;
  }, INITIAL);

  const state = checked.at > sent.at ? checked : sent;
  const step = editing ? "phone" : state.step;

  // Seconds until a new code may be requested (ticks on the client only).
  const [wait, setWait] = useState(0);
  useEffect(() => {
    const until = step === "code" ? state.resendAt : undefined;
    const tick = () => setWait(until ? Math.max(0, Math.ceil((until - Date.now()) / 1000)) : 0);
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [step, state.resendAt]);

  const hidden = (
    <>
      <input type="hidden" name="_locale" value={locale} />
      <div aria-hidden className="absolute -start-[9999px] size-px overflow-hidden">
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
    </>
  );

  if (step === "phone") {
    return (
      <form action={(data) => (setEditing(false), sendAction(data))} className="relative flex flex-col gap-5" noValidate>
        {hidden}
        <FieldLabel label={copy.phoneLabel} hint={copy.phoneHint} error={state.step === "phone" ? state.error : undefined}>
          <TextInput
            type="tel"
            name="phone"
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05XXXXXXXX"
            aria-invalid={state.step === "phone" && state.error ? true : undefined}
            className="num text-start"
          />
        </FieldLabel>
        <Button type="submit" size="lg" disabled={sending}>
          {copy.send}
        </Button>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">
        {copy.sentTo}{" "}
        <span className="num text-fg" dir="ltr">
          {state.masked}
        </span>
      </p>
      {state.demoCode && (
        <p role="status" className="border-s-2 border-pending bg-pending/10 px-3 py-2 text-sm">
          {copy.demoNote}{" "}
          <span className="num font-semibold tracking-[0.3em] text-fg" dir="ltr">
            {state.demoCode}
          </span>
        </p>
      )}
      <form action={verifyAction} className="relative flex flex-col gap-5" noValidate>
        {hidden}
        <FieldLabel label={copy.codeLabel} error={state.error}>
          <TextInput
            key={state.at}
            autoFocus
            name="code"
            dir="ltr"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            placeholder="••••••"
            aria-invalid={state.error ? true : undefined}
            className="num text-center text-lg tracking-[0.5em]"
          />
        </FieldLabel>
        <Button type="submit" size="lg" disabled={verifying}>
          {copy.verify}
        </Button>
      </form>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <form action={sendAction}>
          {hidden}
          <input type="hidden" name="phone" value={phone} />
          <button
            type="submit"
            disabled={wait > 0 || sending}
            className="text-accent underline-offset-4 hover:underline disabled:text-muted disabled:no-underline"
          >
            {wait > 0 ? copy.resendIn.replace("{s}", String(wait)) : copy.resend}
          </button>
        </form>
        <button type="button" onClick={() => setEditing(true)} className="text-muted hover:text-fg">
          {copy.change}
        </button>
      </div>
    </div>
  );
}
