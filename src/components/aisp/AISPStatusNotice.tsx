import React from "react";
import { IconType } from "react-icons";

type Tone = "good" | "warning" | "urgent" | "neutral";

type Props = {
  Icon: IconType;
  title: string;
  message: string;
  badge: string;
  tone: Tone;
  style?: React.CSSProperties;
};

const TONE_STYLES: Record<Tone, { badge: string; icon: string; glow: string; dot: string }> = {
  good: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
    icon: "from-emerald-400 to-teal-500 shadow-emerald-500/30",
    glow: "bg-emerald-400/[0.15]",
    dot: "bg-emerald-500",
  },
  warning: {
    badge: "bg-amber-50 text-amber-700 ring-amber-200/70",
    icon: "from-amber-400 to-orange-500 shadow-amber-500/30",
    glow: "bg-amber-400/[0.15]",
    dot: "bg-amber-500",
  },
  urgent: {
    badge: "bg-rose-50 text-rose-700 ring-rose-200/70",
    icon: "from-rose-500 to-pink-600 shadow-rose-500/30",
    glow: "bg-rose-400/[0.15]",
    dot: "bg-rose-500",
  },
  neutral: {
    badge: "bg-slate-100 text-slate-500 ring-slate-200/70",
    icon: "from-slate-400 to-slate-500 shadow-slate-500/20",
    glow: "bg-slate-300/20",
    dot: "bg-slate-400",
  },
};

function AISPStatusNotice({ Icon, title, message, badge, tone, style }: Props) {
  const styles = TONE_STYLES[tone];
  return (
    <div style={style} className="aisp-rise aisp-card relative overflow-hidden p-5 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/[0.06] transition-all duration-300 motion-reduce:hover:translate-y-0">
      <div className={`pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl ${styles.glow}`} />
      <div className="relative flex items-start justify-between gap-3">
        <div className={`h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shadow-lg ${styles.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-bold tracking-wider whitespace-nowrap ring-1 ring-inset ${styles.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${styles.dot} ${tone === "urgent" ? "animate-pulse" : ""}`} />
          {badge}
        </span>
      </div>
      <div className="relative space-y-1">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <p className="text-[0.8rem] leading-relaxed text-slate-500">{message}</p>
      </div>
    </div>
  );
}

export default AISPStatusNotice;
