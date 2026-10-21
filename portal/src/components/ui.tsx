import { useEffect, useRef, type ReactNode } from "react";
import type { Tone } from "../lib/domain";
import { useStore } from "../store";

export function Pill({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`pill t-${tone}`}>{children}</span>;
}

export function Kpi({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: Tone }) {
  return (
    <div className={`kpi ${tone ? "k-" + tone : ""}`}>
      <span className="kpi-l">{label}</span>
      <span className="kpi-v">{value}</span>
      {sub && <span className="kpi-s">{sub}</span>}
    </div>
  );
}

export function Panel({ title, actions, children, pad = false, className = "" }: {
  title?: ReactNode; actions?: ReactNode; children: ReactNode; pad?: boolean; className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {(title || actions) && (
        <header className="ph">
          {title && <h2>{title}</h2>}
          {actions && <div className="ph-a">{actions}</div>}
        </header>
      )}
      <div className={pad ? "pb" : ""}>{children}</div>
    </section>
  );
}

export function PageHead({ title, sub, actions }: { title: string; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="pagehead">
      <div>
        <h1>{title}</h1>
        {sub && <p className="muted">{sub}</p>}
      </div>
      {actions && <div className="row gap8 wrap">{actions}</div>}
    </div>
  );
}

export function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useStore();
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    ref.current?.focus();
    return () => removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="scrim" onClick={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={typeof title === "string" ? title : t("تفاصيل", "Details")}
        ref={ref} tabIndex={-1} onClick={(e) => e.stopPropagation()}>
        <header className="dh">
          <h2>{title}</h2>
          <button className="btn ghost icon" onClick={onClose} aria-label={t("إغلاق", "Close")}><Icon name="x" /></button>
        </header>
        <div className="db">{children}</div>
      </aside>
    </div>
  );
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return <div className="empty"><b>{title}</b>{hint && <span className="muted">{hint}</span>}</div>;
}

export function Seg<T extends string>({ value, options, onChange, label }: {
  value: T; options: { v: T; t: string; n?: number }[]; onChange: (v: T) => void; label: string;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.v} aria-pressed={value === o.v} onClick={() => onChange(o.v)}>
          {o.t}{o.n !== undefined && <span className="cnt">{o.n}</span>}
        </button>
      ))}
    </div>
  );
}

const PATHS: Record<string, string> = {
  home: "M3 11 12 4l9 7M5 10v10h5v-6h4v6h5V10",
  truck: "M3 6h11v10H3zM14 9h4l3 3v4h-7M7 19a2 2 0 1 0 0-.1M17 19a2 2 0 1 0 0-.1",
  plus: "M12 5v14M5 12h14",
  undo: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  pin: "M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zM12 11.5a2.5 2.5 0 1 0 0-.1",
  bill: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  calc: "M6 3h12v18H6zM9 7h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-1-3-2 .2-1.3-1.3L17 5l-3-1-1 2h-2L10 4 7 5l.3 1.9L6 8.2 4 8 3 11l2 1v0l-2 1 1 3 2-.2 1.3 1.3L7 19l3 1 1-2h2l1 2 3-1-.3-1.9 1.3-1.3 2 .2 1-3z",
  board: "M3 4h5v16H3zM10 4h5v10h-5zM17 4h4v13h-4z",
  users: "M9 11a4 4 0 1 0 0-.1M2 21c0-3.9 3.1-6 7-6s7 2.1 7 6M17 7a3 3 0 0 1 0 6M19 15c2 .6 3 2.3 3 6",
  alert: "M12 3 2 21h20zM12 10v5M12 18h.01",
  clip: "M9 4h6v3H9zM7 5H5v16h14V5h-2M8 12l2.5 2.5L16 9",
  x: "M6 6l12 12M18 6 6 18",
  check: "M5 12.5 10 17 19 7",
  arrow: "M15 6l-6 6 6 6",
  search: "M11 18a7 7 0 1 0 0-.1M21 21l-5-5",
  doc: "M6 3h9l4 4v14H6zM14 3v5h5",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
};
export function Icon({ name, size = 18 }: { name: keyof typeof PATHS | string; size?: number }) {
  return (
    <svg className={name === "arrow" ? "flip" : undefined} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name] ?? ""} />
    </svg>
  );
}

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <span className="logo" style={{ fontSize: size }} aria-label="SWYV">
      Swyv
      <svg viewBox="0 0 54 64" style={{ width: size * 0.36, height: size * 0.44 }} aria-hidden="true">
        <path d="M6 6 L27 30 L48 6 L48 30 L27 58 L6 30 Z" fill="currentColor" />
      </svg>
    </span>
  );
}
