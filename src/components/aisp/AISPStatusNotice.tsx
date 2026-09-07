import React from "react";
import { IconType } from "react-icons";

type Tone = "good" | "warning" | "urgent" | "neutral";

type Props = {
  Icon: IconType;
  title: string;
  message: string;
  badge: string;
  tone: Tone;
};

const TONE_STYLES: Record<Tone, { badge: string; icon: string }> = {
  good: { badge: "bg-green-50 text-green-600", icon: "bg-green-50 text-green-600" },
  warning: { badge: "bg-amber-50 text-amber-600", icon: "bg-amber-50 text-amber-600" },
  urgent: { badge: "bg-red-50 text-red-500", icon: "bg-red-50 text-red-500" },
  neutral: { badge: "bg-slate-100 text-slate-400", icon: "bg-slate-100 text-slate-400" },
};

function AISPStatusNotice({ Icon, title, message, badge, tone }: Props) {
  const styles = TONE_STYLES[tone];
  return (
    <div className="p-3 rounded-xl border border-slate-100 flex items-start space-x-4">
      <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${styles.icon}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col space-y-0.5">
        <h1 className="text-sm font-semibold text-primary">{title}</h1>
        <p className="text-xs text-slate-400">{message}</p>
      </div>
      <span className={`shrink-0 px-2.5 py-1 rounded-full text-[0.65rem] font-semibold tracking-wider whitespace-nowrap ${styles.badge}`}>
        {badge}
      </span>
    </div>
  );
}

export default AISPStatusNotice;
