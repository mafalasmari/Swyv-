// Small hand-drawn SVG charts. One scale per chart; text uses theme tokens.

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}

interface Pt { label: string; value: number }

export function BarChart({ data, format = (v) => String(v), height = 200, highlightLast = true, ariaLabel }: {
  data: Pt[]; format?: (v: number) => string; height?: number; highlightLast?: boolean; ariaLabel: string;
}) {
  const W = 560, H = height, L = 44, R = 8, T = 18, B = 28;
  const max = niceMax(Math.max(...data.map((d) => d.value)));
  const bw = (W - L - R) / data.length;
  const y = (v: number) => T + (H - T - B) * (1 - v / max);
  const ticks = [0, max / 2, max];
  return (
    <div className="chart" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="grid" />
            <text x={L - 6} y={y(t) + 4} textAnchor="end" className="ax">{format(t)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const last = highlightLast && i === data.length - 1;
          const x = L + i * bw + bw * 0.18;
          const w = bw * 0.64;
          return (
            <g key={i}>
              <rect x={x} y={y(d.value)} width={w} height={Math.max(0, y(0) - y(d.value))} rx={2}
                className={last ? "bar hi" : "bar"}><title>{`${d.label}: ${format(d.value)}`}</title></rect>
              {last && <text x={x + w / 2} y={y(d.value) - 5} textAnchor="middle" className="val">{format(d.value)}</text>}
              <text x={x + w / 2} y={H - 9} textAnchor="middle" className="ax">{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function LineChart({ data, min = 0, max = 1, format = (v) => String(v), target, targetLabel = "", height = 200, ariaLabel }: {
  data: Pt[]; min?: number; max?: number; format?: (v: number) => string; target?: number; targetLabel?: string; height?: number; ariaLabel: string;
}) {
  const W = 560, H = height, L = 44, R = 14, T = 18, B = 28;
  const x = (i: number) => L + (data.length === 1 ? 0 : (i * (W - L - R)) / (data.length - 1));
  const y = (v: number) => T + (H - T - B) * (1 - (v - min) / (max - min));
  const path = data.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join("");
  const area = `${path}L${x(data.length - 1)},${y(min)}L${x(0)},${y(min)}Z`;
  const ticks = [min, (min + max) / 2, max];
  const last = data[data.length - 1];
  return (
    <div className="chart" dir="ltr">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="grid" />
            <text x={L - 6} y={y(t) + 4} textAnchor="end" className="ax">{format(t)}</text>
          </g>
        ))}
        {target !== undefined && (
          <g>
            <line x1={L} x2={W - R} y1={y(target)} y2={y(target)} className="target" />
            <text x={W - R} y={y(target) - 5} textAnchor="end" className="ax">{`${targetLabel} ${format(target)}`}</text>
          </g>
        )}
        <path d={area} className="area" />
        <path d={path} className="line" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(d.value)} r={i === data.length - 1 ? 4.5 : 2.5} className={i === data.length - 1 ? "dot hi" : "dot"}>
              <title>{`${d.label}: ${format(d.value)}`}</title>
            </circle>
            <text x={x(i)} y={H - 9} textAnchor="middle" className="ax">{d.label}</text>
          </g>
        ))}
        {last && <text x={x(data.length - 1) - 6} y={y(last.value) - 9} textAnchor="end" className="val">{format(last.value)}</text>}
      </svg>
    </div>
  );
}

/** Horizontal share bars (RTL friendly: plain HTML). */
export function ShareBars({ rows, format = (v) => String(v) }: { rows: { label: string; value: number; color: string; sub?: string }[]; format?: (v: number) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="shares">
      {rows.map((r) => (
        <div className="share" key={r.label}>
          <span className="sl">{r.label}{r.sub && <small className="muted"> · {r.sub}</small>}</span>
          <span className="st"><span style={{ width: `${(r.value / max) * 100}%`, background: r.color }} /></span>
          <span className="sv num">{format(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

/** One horizontal bar split into parts of a whole. */
export function SplitBar({ parts }: { parts: { label: string; value: number; color: string }[] }) {
  const total = parts.reduce((s, p) => s + p.value, 0) || 1;
  return (
    <div className="split-wrap">
      <div className="splitbar" role="img" aria-label={parts.map((p) => `${p.label} ${Math.round((p.value / total) * 100)}%`).join(", ")}>
        {parts.map((p) => <span key={p.label} style={{ flexGrow: p.value, background: p.color }} title={p.label} />)}
      </div>
      <div className="legend">
        {parts.map((p) => (
          <span key={p.label}><i style={{ background: p.color }} />{p.label} <b className="num">{Math.round((p.value / total) * 100)}%</b></span>
        ))}
      </div>
    </div>
  );
}
