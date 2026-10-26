import React from 'react';
import type { IconType } from 'react-icons';

export function PageHero({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <header className={`relative isolate overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-sky-100 p-6 text-primary shadow-lg shadow-blue-900/10 sm:p-8 ${className}`}>
      <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-sky-300/30 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-36 right-28 h-64 w-64 rounded-full border border-blue-200/50 bg-white/30" />
      <div className="relative min-w-0 space-y-6">{children}</div>
    </header>
  );
}

export function PageHeroHeading({ eyebrow, title, description, Icon, action }: {
  eyebrow: string;
  title: React.ReactNode;
  description: React.ReactNode;
  Icon: IconType;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      <div className="flex w-full min-w-0 items-center gap-4 sm:w-auto sm:flex-1">
        <div className="hidden shrink-0 rounded-2xl border border-blue-200/60 bg-gradient-to-br from-white to-blue-100 p-3 sm:block">
          <Icon aria-hidden="true" className="h-8 w-8" />
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
          <h1 className="break-words text-2xl font-bold tracking-tight text-primary sm:text-3xl">{title}</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">{description}</p>
        </div>
      </div>
      {action && <div className="max-w-full">{action}</div>}
    </div>
  );
}

export function PageHeroBadge({ children, Icon }: { children: React.ReactNode; Icon: IconType }) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-2 text-xs font-medium text-primary">
      <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
      <span className="min-w-0 break-words">{children}</span>
    </span>
  );
}
