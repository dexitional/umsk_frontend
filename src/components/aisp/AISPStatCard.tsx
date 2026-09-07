import React from "react";
import { IconType } from "react-icons";

type Tone = "good" | "warning" | "urgent" | "neutral";

type Props = {
  Icon: IconType;
  title: string;
  badge: string;
  message: string;
  tone: Tone;
};

const TONE_STYLES: Record<Tone, { icon: string; caption: string }> = {
  good: { icon: "bg-green-50 text-green-600", caption: "text-green-600" },
  warning: { icon: "bg-amber-50 text-amber-600", caption: "text-amber-600" },
  urgent: { icon: "bg-red-50 text-red-500", caption: "text-red-500" },
  neutral: { icon: "bg-slate-100 text-slate-400", caption: "text-slate-400" },
};

function AISPStatCard({ Icon, title, badge, message, tone }: Props) {
  const styles = TONE_STYLES[tone];
  return (
    <div className="dash-fade-up p-4 md:p-5 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col space-y-3">
      <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${styles.icon}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-0.5">
        <h1 className="text-lg font-bold text-primary tracking-tight">{badge}</h1>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
      </div>
      <p className={`text-xs font-medium truncate ${styles.caption}`}>{message}</p>
    </div>
  );
}

export default AISPStatCard;
