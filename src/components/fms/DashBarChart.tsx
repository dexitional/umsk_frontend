import React, { useEffect, useState } from "react";

type Series = { key: string; label: string; color: string };
type Props = {
  categories: string[];
  series: Series[];
  data: Record<string, number>[];
};

function DashBarChart({ categories, series, data }: Props) {
  const max = Math.max(1, ...data.flatMap((d) => series.map((s) => d[s.key] || 0)));
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="space-y-4">
      {series.length > 1 ? (
        <div className="flex items-center space-x-4">
          {series.map((s) => (
            <div key={s.key} className="flex items-center space-x-1.5 text-xs text-slate-500">
              <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      ) : null}
      {/* overflow-x-auto + w-max min-w-full (not flex-1 columns): flex-1 sets
          flex-basis:0%, but each column's default min-width:auto still
          floors it at its label's max-width (4.5rem) regardless of the
          grow/shrink math, so with enough categories the row's real content
          (n × 4.5rem) silently overflows past the card into whatever sits
          next to it instead of shrinking. Fixed-width shrink-0 columns in a
          horizontally scrollable row keep bars/labels legible instead, and
          w-max + min-w-full still spreads few categories across the full
          width via justify-between. */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-end justify-between gap-3 h-48 w-max min-w-full">
          {categories.map((cat, i) => (
            <div key={cat} className="w-16 shrink-0 flex flex-col items-center space-y-2 h-full justify-end">
              <div className="flex items-end gap-1 h-full">
                {series.map((s, si) => {
                  const val = data[i]?.[s.key] || 0;
                  const h = grown ? Math.max(2, (val / max) * 100) : 0;
                  return (
                    <div
                      key={s.key}
                      className="w-3.5 md:w-6 rounded-t-md transition-[height] duration-700 ease-out motion-reduce:transition-none"
                      style={{ height: `${h}%`, background: s.color, transitionDelay: `${(i * series.length + si) * 40}ms` }}
                      title={`${s.label}: ${val}`}
                    />
                  );
                })}
              </div>
              <span className="text-[0.65rem] font-medium text-slate-400 uppercase tracking-wide text-center truncate max-w-full">
                {cat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashBarChart;
