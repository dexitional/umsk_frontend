import React, { useEffect, useMemo, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// AIS dashboard kit. Colours are the theme's, and every palette below was run
// through the dataviz validator (light surface #ffffff) -- don't hand-edit hexes:
//  - GENDER: theme blue (primary family, blue-700) + Akatsico brand green.
//    Categorical pair: PASS (normal-vision ΔE 28.8, deutan ΔE 25.7).
//  - YEAR:   theme accent ramp, light -> dark. Ordinal: PASS (monotone,
//    single hue, light end 2.34:1 on white).
//  - SERIES: single-series marks use slot 1 (theme blue); meter tracks are a
//    lighter step of the same ramp.
// Text never wears a series colour -- values/labels use slate/primary ink.
// ---------------------------------------------------------------------------
export const DASH = {
  male: "#1d4ed8",
  female: "#008551",
  unknown: "#cbd5e1", // "not recorded": neutral gray, not a categorical hue
  year: ["#7bb0d0", "#5599c3", "#3c80aa", "#20516f"],
  series: "#1d4ed8",
  // Two-series categorical pair (the validated gender pair, reused).
  pair: ["#1d4ed8", "#008551"],
  track: "#dbeafe",
};

export const fmt = (n: number) => (Number(n) || 0).toLocaleString();
export const pct = (part: number, whole: number) => (whole ? Math.round((part / whole) * 100) : 0);

export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const on = () => setReduce(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduce;
}

// Counts up from 0 to `value` (ease-out), instantly when motion is reduced.
export function CountUp({ value, duration = 1100, className, format = fmt }: { value: number; duration?: number; className?: string; format?: (n: number) => string }) {
  const reduce = usePrefersReducedMotion();
  const [shown, setShown] = useState(reduce ? value : 0);
  useEffect(() => {
    if (reduce) return setShown(value);
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduce]);
  return <span className={className}>{format(shown)}</span>;
}

// --- Tooltip ---------------------------------------------------------------
// One tooltip per card: marks call show() on pointer move / focus. Values
// lead (strong), labels follow; rows are keyed with a short line in the
// series colour. Tooltips enhance -- every value is also labelled or tabled.
type Tip = { x: number; y: number; title: string; rows: { label: string; value: string; color?: string }[] } | null;

export function useTooltip() {
  const ref = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip>(null);
  const place = (target: Element, clientX?: number, clientY?: number) => {
    const box = ref.current?.getBoundingClientRect();
    const r = target.getBoundingClientRect();
    if (!box) return { x: 0, y: 0 };
    return { x: (clientX ?? r.left + r.width / 2) - box.left, y: (clientY ?? r.top) - box.top };
  };
  const bind = (title: string, rows: { label: string; value: string; color?: string }[]) => ({
    tabIndex: 0,
    "aria-label": `${title}: ${rows.map((r) => `${r.label} ${r.value}`).join(", ")}`,
    onPointerMove: (e: React.PointerEvent) => setTip({ ...place(e.currentTarget, e.clientX, e.clientY), title, rows }),
    onPointerLeave: () => setTip(null),
    onFocus: (e: React.FocusEvent) => setTip({ ...place(e.currentTarget), title, rows }),
    onBlur: () => setTip(null),
  });
  const node = tip ? (
    <div
      role="status"
      className="pointer-events-none absolute z-20 min-w-[9rem] -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-xl bg-white px-3 py-2 shadow-xl shadow-primary/[0.15] ring-1 ring-primary/10"
      style={{ left: tip.x, top: tip.y }}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">{tip.title}</p>
      {tip.rows.map((r) => (
        <div key={r.label} className="mt-1 flex items-center gap-2">
          {r.color ? <span className="h-0.5 w-3 rounded-full" style={{ background: r.color }} /> : null}
          <span className="text-sm font-bold text-primary-dark">{r.value}</span>
          <span className="text-xs text-slate-500">{r.label}</span>
        </div>
      ))}
    </div>
  ) : null;
  return { ref, bind, node };
}

// --- Card shell ------------------------------------------------------------
export function DashCard({
  title,
  subtitle,
  Icon,
  action,
  delay = 0,
  className = "",
  titleFont = "font-poppins",
  children,
}: {
  title: string;
  subtitle?: string;
  Icon?: any;
  action?: React.ReactNode;
  delay?: number;
  className?: string;
  // Heading face; pages set their own (e.g. "font-roboto").
  titleFont?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`dash-fade-up relative flex flex-col rounded-3xl bg-white p-5 md:p-6 ring-1 ring-primary/10 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10 ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <header className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {Icon ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary via-primary to-secondary-accent text-white shadow-md shadow-primary/20">
              <Icon className="h-5 w-5" />
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className={`truncate text-sm md:text-base font-bold ${titleFont} text-primary-dark`}>{title}</h2>
            {subtitle ? <p className="truncate text-xs text-slate-400">{subtitle}</p> : null}
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function Legend({ items }: { items: { label: string; color: string; value?: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: it.color }} />
          <span>{it.label}</span>
          {it.value ? <span className="font-semibold text-primary-dark">{it.value}</span> : null}
        </li>
      ))}
    </ul>
  );
}

// --- Radial meter ----------------------------------------------------------
// A single ratio against a whole: accent arc on a lighter same-ramp track.
export function RadialMeter({
  value,
  total,
  size = 168,
  stroke = 14,
  color = DASH.series,
  track = DASH.track,
  label,
  invert = false,
}: {
  value: number;
  total: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  label?: string;
  invert?: boolean; // white ink, for the navy hero
}) {
  const reduce = usePrefersReducedMotion();
  const share = total ? Math.min(1, value / total) : 0;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [drawn, setDrawn] = useState(reduce ? share : 0);
  useEffect(() => {
    if (reduce) return setDrawn(share);
    const id = requestAnimationFrame(() => setDrawn(share));
    return () => cancelAnimationFrame(id);
  }, [share, reduce]);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" role="img" aria-label={`${label || "Progress"}: ${pct(value, total)}% (${fmt(value)} of ${fmt(total)})`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - drawn)}
          style={{ transition: reduce ? "none" : "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={`text-3xl font-extrabold font-inter ${invert ? "text-white" : "text-primary-dark"}`}>
          <CountUp value={pct(value, total)} />%
        </span>
        {label ? <span className={`mt-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ${invert ? "text-sky-100/80" : "text-slate-400"}`}>{label}</span> : null}
      </div>
    </div>
  );
}

// Thin linear meter (same-ramp track).
export function LinearMeter({ value, total, color = DASH.series, delay = 0 }: { value: number; total: number; color?: string; delay?: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: DASH.track }}>
      <div className="dash-grow-x h-full rounded-full" style={{ width: `${pct(value, total)}%`, background: color, animationDelay: `${delay}ms` }} />
    </div>
  );
}

// --- Gender split ----------------------------------------------------------
// Part-to-whole of 2 (+ "not recorded"): one stacked bar with 2px surface gaps,
// legend with counts (identity never colour-alone), tooltips per segment.
export function GenderSplit({ m, f, u = 0 }: { m: number; f: number; u?: number }) {
  const tip = useTooltip();
  const total = m + f + u;
  const parts = [
    { label: "Male", value: m, color: DASH.male },
    { label: "Female", value: f, color: DASH.female },
    { label: "Not recorded", value: u, color: DASH.unknown },
  ].filter((p) => p.value > 0);
  return (
    <div ref={tip.ref} className="relative">
      {tip.node}
      <div className="flex h-4 w-full gap-[2px] overflow-hidden rounded-full bg-white">
        {total ? (
          parts.map((p, i) => (
            <div
              key={p.label}
              {...tip.bind(p.label, [{ label: "students", value: `${fmt(p.value)} (${pct(p.value, total)}%)`, color: p.color }])}
              className={`dash-grow-x h-full cursor-default outline-none transition-[filter] hover:brightness-110 focus-visible:brightness-110 ${i === 0 ? "rounded-l-full" : ""} ${i === parts.length - 1 ? "rounded-r-full" : ""}`}
              style={{ width: `${(p.value / total) * 100}%`, background: p.color, animationDelay: `${150 + i * 120}ms` }}
            />
          ))
        ) : (
          <div className="h-full w-full rounded-full" style={{ background: DASH.track }} />
        )}
      </div>
      <div className="mt-3">
        <Legend items={parts.map((p) => ({ label: p.label, color: p.color, value: `${fmt(p.value)} · ${pct(p.value, total)}%` }))} />
      </div>
    </div>
  );
}

// --- Year-level columns ------------------------------------------------------
// Ordered categories (Year 1..4) -> the ordinal ramp. Value on each cap,
// 4px rounded data-end, square at the baseline, hairline baseline.
export function YearColumns({ values, years, height = 180, unit = "students" }: { values: number[]; years?: number[]; height?: number; unit?: string }) {
  const tip = useTooltip();
  // `years` names each column (default 1..n) and picks its ramp step, so a
  // subset like Years 1-3 keeps each year's own shade.
  const ys = years || values.map((_, i) => i + 1);
  const max = Math.max(1, ...values);
  const total = values.reduce((a, b) => a + b, 0);
  return (
    <div ref={tip.ref} className="relative">
      {tip.node}
      <div className="flex items-end justify-around gap-3 border-b border-slate-200 px-2" style={{ height }}>
        {values.map((v, i) => (
          <div key={i} className="flex h-full w-full max-w-[64px] flex-col items-center justify-end">
            <span className="mb-1.5 text-xs font-bold text-primary-dark">{fmt(v)}</span>
            <div
              {...tip.bind(`Year ${ys[i]}`, [{ label: unit, value: `${fmt(v)} (${pct(v, total)}%)`, color: DASH.year[(ys[i] - 1) % 4] }])}
              className="dash-grow-y w-full max-w-[24px] cursor-default rounded-t-[4px] outline-none transition-[filter] hover:brightness-110 focus-visible:brightness-110"
              style={{ height: `${Math.max(2, (v / max) * (height - 28))}px`, background: DASH.year[(ys[i] - 1) % 4], animationDelay: `${200 + i * 110}ms` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-around px-2">
        {values.map((_, i) => (
          <span key={i} className="w-full max-w-[64px] text-center text-xs font-semibold text-slate-500">
            Year {ys[i]}
          </span>
        ))}
      </div>
    </div>
  );
}

// --- Horizontal bars (one series) -------------------------------------------
// Nominal categories (no natural order) -> every bar the same slot-1 hue; bar
// length carries the value, which is also written at the tip.
export function HBarList({ rows, unit = "", format = fmt }: { rows: { label: string; value: number }[]; unit?: string; format?: (n: number) => string }) {
  const tip = useTooltip();
  const max = Math.max(1, ...rows.map((r) => r.value));
  const total = rows.reduce((a, r) => a + r.value, 0);
  return (
    <div ref={tip.ref} className="relative space-y-3">
      {tip.node}
      {rows.map((r, i) => (
        <div key={r.label}>
          <p className="mb-1 truncate text-xs font-semibold text-primary-dark/70" title={r.label}>{r.label}</p>
          <div className="flex items-center gap-2">
            <div className="h-2.5 flex-1 overflow-hidden rounded-full" style={{ background: DASH.track }}>
              <div
                {...tip.bind(r.label, [{ label: unit, value: `${format(r.value)} (${pct(r.value, total)}%)`, color: DASH.series }])}
                className="dash-grow-x h-full cursor-default rounded-full outline-none transition-[filter] hover:brightness-110 focus-visible:brightness-110"
                style={{ width: `${(r.value / max) * 100}%`, background: DASH.series, animationDelay: `${200 + i * 90}ms` }}
              />
            </div>
            <span className="min-w-[2rem] shrink-0 text-right text-xs font-bold tabular-nums text-primary-dark/70">{format(r.value)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Stacked columns (time series, 2+ series) -------------------------------
// One column per period, its series stacked with 2px surface gaps and a 4px
// rounded data-end on top. Light gridlines at 0 / half / max. The whole
// column is the hover target (bigger than the marks); its tooltip lists every
// series plus the total. A table view carries the same numbers.
const niceMax = (v: number) => {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = [1, 2, 2.5, 5, 10].find((k) => k * p >= v) || 10;
  return m * p;
};

export function StackedColumns({
  rows,
  series,
  height = 210,
  format = fmt,
  axisFormat = format,
  empty = "No data yet",
}: {
  rows: { label: string; title?: string; values: number[] }[];
  series: { label: string; color: string }[];
  height?: number;
  format?: (n: number) => string;
  axisFormat?: (n: number) => string;
  empty?: string;
}) {
  const tip = useTooltip();
  const [asTable, setAsTable] = useState(false);
  const totals = rows.map((r) => r.values.reduce((a, b) => a + (b || 0), 0));
  const max = niceMax(Math.max(0, ...totals));
  const hasData = totals.some((t) => t > 0);
  const toggle = (
    <div className="flex rounded-lg bg-primary/5 p-0.5 text-xs font-semibold">
      {["Chart", "Table"].map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => setAsTable(v === "Table")}
          aria-pressed={(v === "Table") === asTable}
          className={`rounded-md px-2.5 py-1 transition-colors ${(v === "Table") === asTable ? "bg-white text-primary-dark shadow-sm" : "text-slate-500 hover:text-primary-dark"}`}
        >
          {v}
        </button>
      ))}
    </div>
  );
  return (
    <div ref={tip.ref} className="relative">
      {tip.node}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Legend items={series.map((s, i) => ({ label: s.label, color: s.color, value: format(rows.reduce((a, r) => a + (r.values[i] || 0), 0)) }))} />
        {toggle}
      </div>
      {asTable ? (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-left uppercase tracking-wider text-slate-400">
                <th className="py-2 font-semibold">Period</th>
                {series.map((s) => (
                  <th key={s.label} className="py-2 text-right font-semibold">{s.label}</th>
                ))}
                <th className="py-2 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 tabular-nums">
              {rows.map((r, ri) => (
                <tr key={r.label + ri} className="hover:bg-primary/[0.03]">
                  <td className="py-2 font-semibold text-primary-dark">{r.title || r.label}</td>
                  {r.values.map((v, i) => (
                    <td key={i} className="py-2 text-right text-slate-500">{format(v)}</td>
                  ))}
                  <td className="py-2 text-right font-bold text-primary-dark">{format(totals[ri])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !hasData ? (
        <p className="py-16 text-center text-xs uppercase tracking-wider text-slate-400">{empty}</p>
      ) : (
        <div className="flex gap-2">
          {/* y axis */}
          <div className="relative w-14 shrink-0 text-right text-[0.65rem] tabular-nums text-slate-400" style={{ height }}>
            {[1, 0.5, 0].map((k) => (
              <span key={k} className="absolute right-0 -translate-y-1/2" style={{ top: `${(1 - k) * 100}%` }}>
                {axisFormat(max * k)}
              </span>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <div className="relative" style={{ height }}>
              {[1, 0.5].map((k) => (
                <div key={k} className="absolute inset-x-0 border-t border-dashed border-slate-100" style={{ top: `${(1 - k) * 100}%` }} />
              ))}
              <div className="absolute inset-x-0 bottom-0 border-t border-slate-200" />
              <div className="absolute inset-0 flex items-end justify-around gap-1">
                {rows.map((r, ri) => {
                  const top = r.values.reduce((last, v, i) => (v > 0 ? i : last), -1);
                  return (
                    <div
                      key={r.label + ri}
                      {...tip.bind(r.title || r.label, [
                        ...series.map((s, i) => ({ label: s.label, value: format(r.values[i] || 0), color: s.color })),
                        { label: "total", value: format(totals[ri]) },
                      ])}
                      className="group flex h-full w-full max-w-[34px] cursor-default flex-col justify-end outline-none"
                    >
                      <div
                        className="dash-grow-y flex w-full flex-col-reverse gap-[2px] transition-[filter] group-hover:brightness-110 group-focus-visible:brightness-110"
                        style={{ height: `${(totals[ri] / max) * 100}%`, animationDelay: `${150 + ri * 50}ms` }}
                      >
                        {r.values.map((v, i) =>
                          v > 0 ? (
                            <div key={i} className={i === top ? "rounded-t-[4px]" : ""} style={{ flexGrow: v, flexBasis: 0, minHeight: 2, background: series[i].color }} />
                          ) : null
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-2 flex justify-around gap-1">
              {rows.map((r, ri) => (
                <span key={r.label + ri} className="w-full max-w-[34px] text-center text-[0.65rem] font-semibold text-slate-400">
                  {r.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Programme composition ---------------------------------------------------
// Part-to-whole per programme across Year 1..4 (ordinal ramp): horizontal
// stacked bars with 2px gaps, total at the bar end, legend, per-segment
// tooltips, and a table view twin.
export function ProgrammeStacks({ programs }: { programs: { label: string; y1: number; y2: number; y3: number; y4: number }[] }) {
  const tip = useTooltip();
  const [asTable, setAsTable] = useState(false);
  const rows = useMemo(
    () =>
      programs
        .map((p) => {
          const years = [p.y1 || 0, p.y2 || 0, p.y3 || 0, p.y4 || 0];
          // Last non-empty year: only it gets the rounded data-end.
          const lastYear = years.reduce((last, v, i) => (v > 0 ? i : last), -1);
          return { ...p, years, lastYear, total: years.reduce((a, b) => a + b, 0) };
        })
        .sort((a, b) => b.total - a.total),
    [programs]
  );
  const max = Math.max(1, ...rows.map((r) => r.total));
  const toggle = (
    <div className="flex rounded-lg bg-primary/5 p-0.5 text-xs font-semibold">
      {["Chart", "Table"].map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => setAsTable(v === "Table")}
          aria-pressed={(v === "Table") === asTable}
          className={`rounded-md px-2.5 py-1 transition-colors ${(v === "Table") === asTable ? "bg-white text-primary-dark shadow-sm" : "text-slate-500 hover:text-primary-dark"}`}
        >
          {v}
        </button>
      ))}
    </div>
  );
  if (!rows.length) return <p className="py-8 text-center text-xs uppercase tracking-wider text-slate-400">No programmes yet</p>;
  return (
    <div ref={tip.ref} className="relative">
      {tip.node}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Legend items={DASH.year.map((c, i) => ({ label: `Year ${i + 1}`, color: c }))} />
        {toggle}
      </div>
      {asTable ? (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-left uppercase tracking-wider text-slate-400">
                <th className="py-2 font-semibold">Programme</th>
                {[1, 2, 3, 4].map((y) => (
                  <th key={y} className="py-2 text-right font-semibold">Y{y}</th>
                ))}
                <th className="py-2 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 tabular-nums">
              {rows.map((r) => (
                <tr key={r.label} className="hover:bg-primary/[0.03]">
                  <td className="py-2.5 font-semibold text-primary-dark">{r.label}</td>
                  {r.years.map((v, i) => (
                    <td key={i} className="py-2.5 text-right text-slate-500">{fmt(v)}</td>
                  ))}
                  <td className="py-2.5 text-right font-bold text-primary-dark">{fmt(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-4">
          {rows.map((r, ri) => (
            <div key={r.label} className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
              <span className="truncate text-xs font-bold text-primary-dark" title={r.label}>{r.label}</span>
              <div className="flex items-center gap-2">
                <div className="flex h-6 gap-[2px]" style={{ width: `${(r.total / max) * 85}%` }}>
                  {r.years.map((v, i) =>
                    v > 0 ? (
                      <div
                        key={i}
                        {...tip.bind(`${r.label} · Year ${i + 1}`, [{ label: "students", value: `${fmt(v)} (${pct(v, r.total)}%)`, color: DASH.year[i] }])}
                        className={`dash-grow-x h-full cursor-default outline-none transition-[filter] hover:brightness-110 focus-visible:brightness-110 ${i === r.lastYear ? "rounded-r-[4px]" : ""}`}
                        style={{ width: `${(v / r.total) * 100}%`, background: DASH.year[i], animationDelay: `${250 + ri * 120 + i * 60}ms` }}
                      />
                    ) : null
                  )}
                </div>
                <span className="text-xs font-bold text-primary-dark">{fmt(r.total)}</span>
              </div>
            </div>
          ))}
          <ProgrammeSummary rows={rows} />
        </div>
      )}
    </div>
  );
}

// Headline numbers under the programme bars: total, largest programme, peak year.
function ProgrammeSummary({ rows }: { rows: { label: string; total: number; years: number[] }[] }) {
  const total = rows.reduce((a, r) => a + r.total, 0);
  const years = [0, 1, 2, 3].map((i) => rows.reduce((a, r) => a + r.years[i], 0));
  const peak = years.indexOf(Math.max(...years));
  const top = rows[0];
  const stats = [
    { label: "Students", value: fmt(total), note: `across ${rows.length} programme${rows.length === 1 ? "" : "s"}` },
    { label: "Largest programme", value: top?.label || "—", note: top ? `${fmt(top.total)} students · ${pct(top.total, total)}%` : "" },
    { label: "Peak year group", value: total ? `Year ${peak + 1}` : "—", note: total ? `${fmt(years[peak])} students` : "" },
  ];
  return (
    <div className="mt-2 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
      {stats.map((s, i) => (
        <div key={s.label} className="dash-fade-up rounded-2xl bg-primary/[0.03] px-4 py-3" style={{ animationDelay: `${500 + i * 80}ms` }}>
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
          <p className="mt-0.5 text-lg font-extrabold text-primary-dark">{s.value}</p>
          <p className="text-[0.7rem] text-slate-500">{s.note}</p>
        </div>
      ))}
    </div>
  );
}

// --- Department leaderboard --------------------------------------------------
// Courses (through curriculum assignments) and staff per department: a table
// with inline single-hue bars -- the column header names the measure.
export function DepartmentBoard({ departments, limit = 7 }: { departments: { label: string; courses: number; staff: number }[]; limit?: number }) {
  const [all, setAll] = useState(false);
  const rows = useMemo(
    () => [...departments].sort((a, b) => (b.courses || 0) - (a.courses || 0) || (b.staff || 0) - (a.staff || 0) || a.label.localeCompare(b.label)),
    [departments]
  );
  const maxC = Math.max(1, ...rows.map((r) => r.courses || 0));
  const maxS = Math.max(1, ...rows.map((r) => r.staff || 0));
  const shown = all ? rows : rows.slice(0, limit);
  // Title case, but short names (ICT, TWI, EWE) stay in capitals.
  const cap = (s: string) => s.split(/\s+/).map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join(" ");
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 border-b border-slate-100 pb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
        <span>Department</span>
        <span>Courses</span>
        <span>Staff</span>
      </div>
      <ul className="divide-y divide-slate-50">
        {shown.map((d, i) => (
          <li key={d.label} className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-3 py-2.5">
            <span className="truncate text-xs font-semibold text-primary-dark/80" title={d.label}>
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-md bg-primary/5 text-[0.6rem] font-bold text-primary/70">{i + 1}</span>
              {cap(d.label)}
            </span>
            {[
              { v: d.courses || 0, max: maxC, color: DASH.series },
              { v: d.staff || 0, max: maxS, color: DASH.year[2] },
            ].map((m, k) => (
              <span key={k} className="flex items-center gap-2">
                <span className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: DASH.track }}>
                  <span className="dash-grow-x block h-full rounded-full" style={{ width: `${(m.v / m.max) * 100}%`, background: m.color, animationDelay: `${300 + i * 50}ms` }} />
                </span>
                <span className="w-6 text-right text-xs font-bold tabular-nums text-primary-dark">{m.v}</span>
              </span>
            ))}
          </li>
        ))}
      </ul>
      {rows.length > limit ? (
        <button type="button" onClick={() => setAll((v) => !v)} className="mt-3 text-xs font-semibold text-secondary-accent hover:underline">
          {all ? "Show fewer" : `Show all ${rows.length} departments`}
        </button>
      ) : null}
    </div>
  );
}
