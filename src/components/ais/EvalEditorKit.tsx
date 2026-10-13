import React from "react";
import { HiArrowLeft } from "react-icons/hi2";
import { Link } from "react-router-dom";

// Building blocks shared by the Evaluation Manager pages (form editor,
// rating-scale editor, form overview): inputs, switches, icon buttons,
// section cards and the header back button.

// Drafts carry a client-only `_key` (stable React key / expand state); strip
// it before posting so the save action's JSON diff is unaffected.
export type Keyed<T> = T & { _key: string };
export const uid = () => Math.random().toString(36).slice(2, 10);
export const strip = <T extends { _key?: string }>(rows: T[]) => rows.map(({ _key, ...r }) => r);

export const INPUT =
  "w-full rounded-xl border-0 bg-primary/[0.04] px-3.5 py-2.5 text-sm text-primary-dark/80 ring-1 ring-inset ring-primary/10 placeholder:text-slate-400 transition focus:bg-white focus:ring-2 focus:ring-secondary-accent";
export const INPUT_ERR = "!ring-2 !ring-rose-400 !bg-rose-50";

export function Switch({ checked, onChange, label, name }: { checked: boolean; onChange: (v: boolean) => void; label: string; name?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-xs font-semibold text-primary-dark/70"
    >
      <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ${checked ? "bg-secondary-accent" : "bg-slate-300"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-300 ${checked ? "left-[18px]" : "left-0.5"}`} />
      </span>
      {label}
      {name ? <input type="hidden" name={name} value={checked ? "1" : "0"} /> : null}
    </button>
  );
}

export function Segmented({ value, options, onChange }: { value: string; options: { value: string; label: string; Icon: any }[]; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex rounded-xl bg-primary/5 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            value === o.value ? "bg-white text-primary-dark/80 shadow-sm" : "text-slate-500 hover:text-primary-dark/70"
          }`}
        >
          <o.Icon className="h-4 w-4" /> {o.label}
        </button>
      ))}
    </div>
  );
}

export function IconBtn({ title, onClick, disabled, danger, children }: { title: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-primary/50 transition-colors disabled:opacity-30 ${
        danger ? "hover:bg-rose-600 hover:text-white" : "hover:bg-primary/5 hover:text-primary-dark/80"
      }`}
    >
      {children}
    </button>
  );
}

export function Section({ id, title, subtitle, Icon, action, delay = 0, children }: { id: string; title: string; subtitle?: string; Icon: any; action?: React.ReactNode; delay?: number; children: React.ReactNode }) {
  return (
    <section id={id} className="dash-fade-up scroll-mt-28 rounded-3xl bg-white p-5 ring-1 ring-primary/10 shadow-sm md:p-6" style={{ animationDelay: `${delay}ms` }}>
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/5 text-secondary-accent">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-primary-dark/80">{title}</h2>
            {subtitle ? <p className="text-xs text-slate-400">{subtitle}</p> : null}
          </div>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

// Back button for the Evaluation Manager's dark header bars: a frosted pill
// naming where it goes (phones get the round arrow only). Pass `to` for a
// plain link, or `onClick` when leaving needs a check (unsaved changes).
export function BackPill({ label, to, onClick, className = "" }: { label: string; to?: string; onClick?: () => void; className?: string }) {
  const cls = `group inline-flex shrink-0 items-center gap-2 rounded-full bg-white/10 p-1 text-xs font-semibold text-white/90 ring-1 ring-inset ring-white/20 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:pr-3.5 ${className}`;
  const body = (
    <>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary shadow-sm transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transition-none">
        <HiArrowLeft className="h-3.5 w-3.5" />
      </span>
      <span className="hidden sm:inline">{label}</span>
    </>
  );
  return to ? (
    <Link to={to} aria-label={`Back to ${label}`} className={cls}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onClick} aria-label={`Back to ${label}`} className={cls}>
      {body}
    </button>
  );
}
