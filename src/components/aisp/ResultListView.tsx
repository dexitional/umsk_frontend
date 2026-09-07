import React from 'react';
import ResultListItem from './ResultListItem';

type Props = {
  data?: any;
  title?: string;
  meta?: { gpa: number | null; cgpa: number | null; credit: number; gradepoint: number };
}

function ResultListView({ title, data, meta }: Props) {

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-slate-100">
        <h2 className="text-sm font-bold text-primary">{title}</h2>
        <span className="w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          YEAR {data && Math.ceil(data[0].semesterNum/2) || 'NONE'}
        </span>
      </div>
      <div className="px-6 py-3 hidden md:grid grid-cols-6 gap-4 items-center border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <div>Code</div>
          <div className="col-span-2">Course</div>
          <div>CR</div>
          <div>GD</div>
          <div>GP</div>
      </div>
      <div>
        { data && data?.map((row:any) => (<ResultListItem key={row.id} row={row} />))}
        { !data?.length && (
          <div className="py-10 text-center text-slate-400 text-xs font-semibold uppercase tracking-widest">
            No Record ...
          </div>
        )}
      </div>
      { data?.length ?
      <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-400">CGPA</span>
            <span className="font-bold text-primary">{ meta?.cgpa == null ? '--' : meta.cgpa }</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-400">GPA</span>
            <span className="font-bold text-primary">{ meta?.gpa == null ? '--' : meta.gpa }</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-400">TCR</span>
            <span className="font-bold text-primary">{ meta?.credit == null ? '--' : meta.credit.toFixed(1)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-400">TGP</span>
            <span className="font-bold text-primary">{ meta?.gradepoint == null ? '--' : meta.gradepoint.toFixed(1)}</span>
          </div>
      </div>
      : null }
    </div>
  )
}

export default ResultListView
