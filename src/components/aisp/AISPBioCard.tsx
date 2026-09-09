import React from 'react'
import { IconType } from 'react-icons';

type Props = {
  data?: any;
  label: string;
  value: string;
  Icon: IconType;
}

function AISPBioCard({ label, value, Icon }: Props) {

  return (
    <div className="py-3 px-4 rounded-xl border border-slate-100 flex items-center space-x-3.5">
      <div className="h-9 w-9 shrink-0 rounded-lg bg-secondary-accent/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-secondary-accent" />
      </div>
      <div className="min-w-0 flex-1">
          <span className="block text-[0.65rem] font-medium text-slate-400 uppercase tracking-wider">{label}</span>
          <p className="text-sm font-semibold text-primary tracking-wide truncate">{value?.toUpperCase()}</p>
      </div>
    </div>
  )
}

export default AISPBioCard