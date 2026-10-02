import React from "react";
import { IconType } from "react-icons";

type Props = {
  label: string;
  value?: React.ReactNode;
  Icon: IconType;
  className?: string;
};

// Label/value tile for the portal's detail pages (profile, service request).
function AISPInfoTile({ label, value, Icon, className = "" }: Props) {
  return (
    <div className={`group p-3.5 rounded-2xl bg-slate-50/70 ring-1 ring-inset ring-slate-100 hover:bg-white hover:ring-sky-100 hover:shadow-sm transition flex items-center gap-3.5 ${className}`}>
      <div className="h-10 w-10 shrink-0 rounded-xl bg-white text-slate-400 ring-1 ring-slate-100 group-hover:text-sky-600 group-hover:ring-sky-100 flex items-center justify-center transition-colors">
        <Icon className="h-[1.1rem] w-[1.1rem]" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</span>
        <p className="mt-0.5 text-sm font-semibold text-slate-800 truncate" title={typeof value === "string" ? value : undefined}>
          {value || "Not Set"}
        </p>
      </div>
    </div>
  );
}

export default AISPInfoTile;
