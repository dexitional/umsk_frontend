import React from 'react'

type Props = {
    label: string;
    name: string;
    options: any;
}

function ReportDropdown({ label, name, options }: Props) {
  return (
    <div className="group flex flex-col space-y-0.5 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden transition-colors duration-200 focus-within:border-primary-accent/50 focus-within:bg-white focus-within:shadow-sm">
      <span className="px-2.5 py-1 w-fit text-[0.6rem] font-bold tracking-wider bg-amber-50 text-gray-500 rounded-br transition-colors duration-200 group-focus-within:bg-primary-accent/10 group-focus-within:text-primary-accent">{label}</span>
      <select name={name} className="border-0 bg-transparent text-[0.7rem] font-semibold uppercase text-primary-dark focus:ring-0">
        {/* { (['major'].includes(name)) && (<option value="">NO MAJOR</option>) } */}
        { (['rsession','session'].includes(name)) && (<option value="">----</option>) }
        { (['mode','year','program','major'].includes(name)) && (<option value="">----</option>) }
        {/* { (['rsession'].includes(name)) && (<option value="">NO MAJOR</option>) } */}
        { options.map((r,i) => (<option key={i} value={r.value}>{r.label}</option>))}
      </select>
    </div>
  )
}

export default ReportDropdown