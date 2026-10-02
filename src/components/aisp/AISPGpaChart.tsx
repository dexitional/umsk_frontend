import React from "react";

type Point = { title: string; label: string; gpa: number | null; cgpa: number | null; credit: number };

type Props = {
  points: Point[];
};

// Semester GPA as columns. Single series → no legend (the panel title names
// it); only the latest column carries a direct value label, the rest are
// read from the axis or the hover/focus tooltip. The semester tables below
// the chart double as its table view.
function AISPGpaChart({ points }: Props) {
  const top = Math.max(4, Math.ceil(Math.max(...points.map((p) => p.gpa ?? 0))));
  const ticks = Array.from({ length: top + 1 }, (_, i) => top - i);
  const lastGraded = points.map((p) => p.gpa != null).lastIndexOf(true);

  return (
    <div className="flex gap-3">
      {/* Y axis */}
      <div className="relative h-48 w-6 shrink-0 text-[0.65rem] font-medium text-slate-400 tabular-nums">
        {ticks.map((t) => (
          <span key={t} className="absolute right-0 -translate-y-1/2" style={{ top: `${((top - t) / top) * 100}%` }}>
            {t.toFixed(1)}
          </span>
        ))}
      </div>

      <div className="flex-1 min-w-0">
        <div className="relative h-48">
          {/* Gridlines */}
          {ticks.map((t) => (
            <div
              key={t}
              className={`absolute inset-x-0 h-px ${t === 0 ? "bg-slate-300" : "bg-slate-100"}`}
              style={{ top: `${((top - t) / top) * 100}%` }}
            />
          ))}

          {/* Columns */}
          <div className="absolute inset-0 flex items-end">
            {points.map((p, i) => {
              const height = p.gpa != null ? (p.gpa / top) * 100 : 0;
              return (
                <div
                  key={p.title}
                  tabIndex={0}
                  className="group relative h-full flex-1 flex items-end justify-center outline-none"
                >
                  <div
                    className={`w-full max-w-[24px] rounded-t-[4px] transition-colors ${
                      i === lastGraded ? "bg-sky-600" : "bg-sky-600/[0.45] group-hover:bg-sky-600/70 group-focus-visible:bg-sky-600/70"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                  {i === lastGraded ? (
                    <span
                      className="absolute pb-1 text-xs font-bold text-slate-900 tabular-nums"
                      style={{ bottom: `${height}%` }}
                    >
                      {p.gpa?.toFixed(2)}
                    </span>
                  ) : null}

                  {/* Tooltip */}
                  <div
                    className={`pointer-events-none absolute z-10 mb-2 w-max ${i < points.length / 2 ? "left-0" : "right-0"} max-w-[14rem] px-3 py-2 rounded-xl bg-slate-900 text-white shadow-xl opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition`}
                    style={{ bottom: `${Math.min(height, 70)}%` }}
                  >
                    <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">{p.title}</span>
                    <span className="block mt-0.5 text-xs">
                      GPA <b className="tabular-nums">{p.gpa ?? "—"}</b> · CGPA <b className="tabular-nums">{p.cgpa ?? "—"}</b>
                    </span>
                    <span className="block text-[0.65rem] text-slate-400">{p.credit} graded credits</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X axis */}
        <div className="mt-2 flex">
          {points.map((p) => (
            <span key={p.title} className="flex-1 text-center text-[0.65rem] font-medium text-slate-400 truncate">
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AISPGpaChart;
