import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

function AISPPageHeader({ title, subtitle, children }: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-xs md:text-sm text-slate-400 mt-1">{subtitle}</p>
        ) : null}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  );
}

export default AISPPageHeader;
