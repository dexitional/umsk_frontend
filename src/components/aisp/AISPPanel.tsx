import React from "react";
import { IconType } from "react-icons";

type Props = {
  title?: string;
  subtitle?: string;
  Icon?: IconType;
  action?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
};

// Standard white surface for portal content, with an optional titled header.
function AISPPanel({ title, subtitle, Icon, action, className = "", bodyClassName = "p-5 md:p-6", children }: Props) {
  return (
    <section className={`aisp-card aisp-rise overflow-hidden ${className}`}>
      {title ? (
        <header className="px-5 md:px-6 pt-5 md:pt-6 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {Icon ? (
              <div className="h-9 w-9 shrink-0 rounded-xl bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100 flex items-center justify-center">
                <Icon className="h-[1.1rem] w-[1.1rem]" />
              </div>
            ) : null}
            <div className="min-w-0">
              <h2 className="text-[0.95rem] font-bold text-slate-900 tracking-tight">{title}</h2>
              {subtitle ? <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p> : null}
            </div>
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export default AISPPanel;
