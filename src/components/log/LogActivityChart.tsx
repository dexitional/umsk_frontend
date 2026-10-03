import moment from "moment";
import React from "react";

type Props = { days: { date: string; count: number }[] };

// Events per day, last 14 days. Single series -> no legend (the panel title
// names it); only today's column carries a direct label, the rest are read
// from the axis or the hover/focus tooltip.
function LogActivityChart({ days }: Props) {
  const max = Math.max(...days.map((d) => d.count), 0);
  const step = max <= 4 ? 1 : Math.ceil(max / 4 / 5) * 5;
  const top = Math.max(step * 4, 4);
  const ticks = [4, 3, 2, 1, 0].map((i) => (top / 4) * i);
  const last = days.length - 1;

  return (
    <div className="flex gap-3">
      <div className="relative h-44 w-8 shrink-0 text-[0.65rem] font-medium text-slate-400 tabular-nums">
        {ticks.map((t) => (
          <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${((top - t) / top) * 100}%` }}>
            {t.toLocaleString()}
          </span>
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <div className="relative h-44">
          {ticks.map((t) => (
            <div key={t} className={`absolute inset-x-0 h-px ${t === 0 ? "bg-slate-300" : "bg-slate-100"}`} style={{ top: `${((top - t) / top) * 100}%` }} />
          ))}
          <div className="absolute inset-0 flex items-end">
            {days.map((d, i) => {
              const h = (d.count / top) * 100;
              return (
                <div key={d.date} tabIndex={0} className="group relative h-full flex-1 flex items-end justify-center outline-none">
                  <div
                    className={`w-full max-w-[22px] rounded-t-[4px] transition-colors ${i === last ? "bg-sky-500" : "bg-sky-500/40 group-hover:bg-sky-500/70 group-focus-visible:bg-sky-500/70"}`}
                    style={{ height: `${Math.max(h, d.count ? 1.5 : 0)}%` }}
                  />
                  {i === last ? (
                    <span className="absolute pb-1 text-xs font-bold text-slate-900 tabular-nums" style={{ bottom: `${h}%` }}>
                      {d.count.toLocaleString()}
                    </span>
                  ) : null}
                  <div
                    className={`pointer-events-none absolute z-10 mb-2 w-max px-3 py-2 rounded-xl bg-slate-900 text-white shadow-xl opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition ${i < days.length / 2 ? "left-0" : "right-0"}`}
                    style={{ bottom: `${Math.min(h, 70)}%` }}
                  >
                    <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">{moment(d.date).format("ddd, MMM D")}</span>
                    <span className="block mt-0.5 text-xs"><b className="tabular-nums">{d.count.toLocaleString()}</b> event{d.count == 1 ? "" : "s"}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-2 flex">
          {days.map((d, i) => (
            <span key={d.date} className="flex-1 text-center text-[0.6rem] font-medium text-slate-400">
              {i % 2 === last % 2 ? moment(d.date).format(i === last ? "[Today]" : "D/M") : ""}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LogActivityChart;
