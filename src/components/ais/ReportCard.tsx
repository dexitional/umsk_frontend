import React, { ReactNode } from 'react'
import { PiMicrosoftExcelLogo } from "react-icons/pi";
import { Form } from 'react-router-dom';

type Props = {
  index: number;
  type: string;
  title: string;
  description: string;
  Icon: any;
  gradient: string;
  glow: string;
  isSubmitting: boolean;
  children: ReactNode;
}

// React.Children.count doesn't look inside a Fragment (`<>{a}{b}</>` counts
// as 1 opaque child) — unwrap one before counting so a single-field report
// (passed as a lone element, not a Fragment) can still be told apart from a
// multi-field one (passed as a Fragment of several elements).
function countFields(children: ReactNode): number {
  if (React.isValidElement(children) && children.type === React.Fragment) {
    return React.Children.count((children.props as any)?.children);
  }
  return React.Children.count(children);
}

function ReportCard({ index, type, title, description, Icon, gradient, glow, isSubmitting, children }: Props) {
  const fieldCount = countFields(children);

  return (
    <div
      style={{ animationDelay: `${index * 90}ms` }}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm transition-all duration-300 animate-fade-in-up hover:-translate-y-1 hover:shadow-xl ${glow} hover:border-secondary-accent/30`}
    >
      {/* decorative glow blob */}
      <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition-transform duration-500 group-hover:scale-125 group-hover:opacity-20`} />

      <div className="relative flex items-center gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-sm md:text-base font-semibold text-gray-700 leading-tight">{title}</h3>
          <p className="text-[0.7rem] md:text-xs text-gray-400">{description}</p>
        </div>
      </div>

      <Form method="post" className="relative mt-5 space-y-3">
        <input type="hidden" name="type" value={type} />
        <div className={`grid gap-2 ${fieldCount <= 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>{children}</div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-700 to-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white shadow-md shadow-emerald-700/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-700/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              <span>Generating…</span>
            </>
          ) : (
            <>
              <PiMicrosoftExcelLogo className="h-4 w-4" />
              <span>Export</span>
            </>
          )}
        </button>
      </Form>
    </div>
  );
}

export default ReportCard
