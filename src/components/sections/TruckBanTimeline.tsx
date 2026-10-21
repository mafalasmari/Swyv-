/**
 * 24-hour bar: daytime ban (red) vs night entry window. Hours are an illustration;
 * the official schedule is verified before operating.
 */
export function TruckBanTimeline({
  label,
  banned,
  allowed,
  note,
}: {
  label: string;
  banned: string;
  allowed: string;
  note: string;
}) {
  // Approximate daytime band, matching the company profile's illustration.
  const banStart = 6;
  const banEnd = 23;
  const ticks = [0, 6, 12, 18, 24];

  return (
    <figure className="border border-rule bg-raised p-5 sm:p-6">
      <figcaption className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-xs tracking-[0.14em] text-muted uppercase">{label}</span>
        <span className="flex gap-4 text-xs text-muted">
          <span className="flex items-center gap-2">
            <span aria-hidden className="h-2 w-4 bg-red" />
            {banned}
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden className="h-2 w-4 bg-delivered" />
            {allowed}
          </span>
        </span>
      </figcaption>
      <div dir="ltr" className="relative">
        <div className="flex h-8 gap-0.5">
          <div className="bg-delivered/80" style={{ width: `${(banStart / 24) * 100}%` }} />
          <div className="bg-red" style={{ width: `${((banEnd - banStart) / 24) * 100}%` }} />
          <div className="bg-delivered/80" style={{ width: `${((24 - banEnd) / 24) * 100}%` }} />
        </div>
        <div className="num mt-2 flex justify-between text-[11px] text-muted">
          {ticks.map((h) => (
            <span key={h}>{String(h).padStart(2, "0")}:00</span>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted">{note}</p>
    </figure>
  );
}
