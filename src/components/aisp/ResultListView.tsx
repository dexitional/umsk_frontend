import React from 'react';
import { HiOutlineBookOpen } from 'react-icons/hi2';
import AISPEmpty from './AISPEmpty';
import ResultListItem from './ResultListItem';

type Props = {
  data?: any;
  title?: string;
  meta?: { gpa: number | null; cgpa: number | null; credit: number; gradepoint: number };
}

function ResultListView({ title, data, meta }: Props) {
  const stats = [
    { label: 'GPA', value: meta?.gpa == null ? '--' : meta.gpa },
    { label: 'CGPA', value: meta?.cgpa == null ? '--' : meta.cgpa },
    { label: 'Credits', value: meta?.credit == null ? '--' : meta.credit.toFixed(1) },
    { label: 'Grade Pts', value: meta?.gradepoint == null ? '--' : meta.gradepoint.toFixed(1) },
  ];

  return (
    <section className="aisp-rise aisp-card overflow-hidden">
      <header className="px-5 md:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-sky-500 to-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-xs font-extrabold">Y{data && Math.ceil(data[0]?.semesterNum/2) || '–'}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 truncate">{title}</h2>
            <p className="text-xs text-slate-400">{data?.length || 0} course{data?.length == 1 ? '' : 's'} · Year {data && Math.ceil(data[0]?.semesterNum/2) || 'None'}</p>
          </div>
        </div>
        { data?.length ? (
          <div className="grid grid-cols-4 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="px-3 py-2 rounded-xl bg-slate-50 ring-1 ring-inset ring-slate-100 text-center md:min-w-[4.5rem]">
                <span className="block text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-slate-400">{s.label}</span>
                <span className="block text-sm font-extrabold text-slate-900 tabular-nums">{s.value}</span>
              </div>
            ))}
          </div>
        ) : null }
      </header>
      <div className="aisp-thead grid-cols-6">
          <div>Code</div>
          <div className="col-span-2">Course</div>
          <div>Credit</div>
          <div>Grade</div>
          <div>Grade Point</div>
      </div>
      <div>
        { data && data?.map((row:any) => (<ResultListItem key={row.id} row={row} />))}
        { !data?.length && (
          <AISPEmpty title="No courses recorded" Icon={HiOutlineBookOpen} />
        )}
      </div>
    </section>
  )
}

export default ResultListView
