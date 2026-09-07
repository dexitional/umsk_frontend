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
  return (
    <div className="px-4 md:px-6 py-4 grid md:grid-cols-6 gap-3 md:gap-4 md:items-center border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors">
        <div className="flex flex-col space-y-1.5">
          <ListHeading title="Code"/>
          <span className="text-sm text-slate-500">{row.courseId}</span>
        </div>

        <div className="md:col-span-2 flex flex-col space-y-1.5">
           <ListHeading title="Course"/>
           <span className="text-sm font-medium text-primary">{row.course?.title}</span>
        </div>
        <div className="flex flex-col space-y-1.5">
          <ListHeading title="CR"/>
          <span className="text-sm text-slate-500">{row?.credit}</span>
        </div>
        <div className="flex flex-col space-y-1.5">
          <ListHeading title="GD"/>
          <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded-md text-xs font-bold ${
            grade === '--' ? 'text-slate-400' : isIncomplete ? 'bg-amber-50 text-amber-600' : isFail ? 'bg-red-50 text-red-500' : 'bg-primary/10 text-primary'
          }`}>{grade}</span>
        </div>
        <div className="flex flex-col space-y-1.5">
          <ListHeading title="GP" />
          <span className="text-sm font-semibold text-primary">{row.totalScore && (!!row?.status) ? isNaN(row.gradepoint * row.credit) ? '--':(row.gradepoint * row.credit).toFixed(1) : '--' }</span>
        </div>
    </div>
  )
}

export default ResultListItem
