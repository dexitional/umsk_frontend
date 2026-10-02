import React from 'react';
import ListHeading from './ListHeading';

type Props = {
    row: any;
}

function ResultListItem({ row }: Props) {
  // Distinguish "Incomplete" (no score yet) from "graded but not yet
  // published" — both used to collapse to '--', leaving no way for a
  // student to see which of their courses is actually an IC.
  const grade = row.totalScore == null ? 'I' : (!!row?.status ? row.grade : '--');
  const isFail = grade === 'F';
  const isIncomplete = grade === 'I';
  const gradeStyle =
    grade === '--' ? 'bg-slate-50 text-slate-400 ring-slate-100'
    : isIncomplete ? 'bg-amber-50 text-amber-700 ring-amber-200'
    : isFail ? 'bg-rose-50 text-rose-600 ring-rose-200'
    : 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  return (
    <div className="aisp-row grid-cols-2 md:grid-cols-6">
        <div className="flex flex-col gap-1">
          <ListHeading title="Code"/>
          <span className="text-xs font-mono font-semibold text-sky-700">{row.courseId}</span>
        </div>

        <div className="col-span-2 md:col-span-2 order-first md:order-none flex flex-col gap-1">
           <ListHeading title="Course"/>
           <span className="text-sm font-semibold text-slate-800">{row.course?.title}</span>
        </div>
        <div className="flex flex-col gap-1">
          <ListHeading title="Credit"/>
          <span className="text-sm text-slate-500 tabular-nums">{row?.credit}</span>
        </div>
        <div className="flex flex-col gap-1">
          <ListHeading title="Grade"/>
          <span className={`inline-flex w-fit min-w-[2.25rem] justify-center items-center px-2 py-1 rounded-lg text-xs font-extrabold ring-1 ring-inset ${gradeStyle}`}>{grade}</span>
        </div>
        <div className="flex flex-col gap-1">
          <ListHeading title="Grade Point" />
          <span className="text-sm font-bold text-slate-900 tabular-nums">{row.totalScore && (!!row?.status) ? isNaN(row.gradepoint * row.credit) ? '--':(row.gradepoint * row.credit).toFixed(1) : '--' }</span>
        </div>
    </div>
  )
}

export default ResultListItem
