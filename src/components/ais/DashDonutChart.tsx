import React, { useEffect, useState } from "react";
import { useCountUp } from "../../utils/util";

type Segment = { label: string; value: number; color: string };
type Props = {
  segments: Segment[];
  centerLabel?: string;
};

function DashDonutChart({ segments, centerLabel }: Props) {
  const total = segments.reduce((sum, s) => sum + (s.value || 0), 0) || 1;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const animatedTotal = useCountUp(total);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  let offset = 0;

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
      <div className="relative h-40 w-40 shrink-0">
        <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="16" />
          {segments.map((seg, i) => {
            const frac = (seg.value || 0) / total;
            const dash = frac * circumference;
            const circle = (
              <circle
                key={i}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={`${drawn ? dash : 0} ${circumference}`}
                strokeDashoffset={-offset}
                style={{
                  transition: "stroke-dasharray 0.8s ease-out",
                  transitionDelay: `${i * 90}ms`,
                }}
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-poppins text-primary tabular-nums">
            {animatedTotal.toLocaleString()}
          </span>
          {centerLabel ? (
            <span className="text-[0.6rem] font-medium text-slate-400 uppercase tracking-wider">
              {centerLabel}
            </span>
          ) : null}
        </div>
      </div>
      {/* flex-1 min-w-0 (not w-full): as a flex sibling of the fixed-size
          donut, width:100% claims the whole row's width on top of the
          donut's own space instead of just what's left over, so long labels
          in the rows below overflow into the next card instead of
          truncating. flex-1 correctly claims only the remaining space. */}
      <div className="flex-1 min-w-0 space-y-2.5">
        {segments.map((seg, i) => (
          <div key={i} className="text-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                {/* block+min-w-0 are required on top of truncate: this span
                    is a flex item (flex blockifies it) and defaults to
                    min-width:auto (its full content width), which blocks
                    shrinking below that even when the parent has room. */}
                <span className="block min-w-0 text-slate-500 truncate">{seg.label}</span>
              </div>
              <span className="shrink-0 text-xs text-slate-400 tabular-nums">
                {Math.round(((seg.value || 0) / total) * 100)}%
              </span>
            </div>
            <div className="pl-[1.125rem] font-semibold text-primary tabular-nums">
              {(seg.value || 0).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashDonutChart;
