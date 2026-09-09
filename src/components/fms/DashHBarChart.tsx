import React, { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/util";

type Row = { label: string; value: number };
type Props = {
  rows: Row[];
  color?: string;
};

function DashHBarChart({ rows, color = "#5599c3" }: Props) {
  const max = Math.max(1, ...rows.map((r) => r.value || 0));
  const [grown, setGrown] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="space-y-3.5">
      {rows.map((r, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium capitalize truncate pr-2">{r.label}</span>
            <span className="text-primary font-semibold shrink-0">
              {formatCurrency(r.value || 0, "en-GH", "GHS")}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{
                width: grown ? `${Math.max(4, (r.value / max) * 100)}%` : "0%",
                background: color,
                transitionDelay: `${i * 60}ms`,
              }}
            />
          </div>
        </div>
      ))}
      {!rows.length ? (
        <div className="py-6 text-center text-xs text-slate-400 uppercase tracking-wider">
          No records
        </div>
      ) : null}
    </div>
  );
}

export default DashHBarChart;
