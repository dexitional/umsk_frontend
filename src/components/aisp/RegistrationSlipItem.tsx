import React from 'react'
import ListHeading from './ListHeading';

type Props = {
    row: any;
}

function RegistrationSlipItem({ row }: Props) {
  
  return (
    <div className={`px-4 md:px-6 py-4 grid md:grid-cols-5 print:grid-cols-5 gap-3 md:gap-4 print:gap-x-2 md:items-center print:items-center text-xs text-slate-500 print:text-gray-700 border-b border-slate-50 print:border-slate-200 last:border-0 hover:bg-slate-50/70 transition-colors`}>
        <div className="flex flex-col print:items-start space-y-1.5">
          <ListHeading title="Code"/>
          <div className="text-sm text-slate-500 print:text-xs">{row?.courseId}</div>
        </div>

        <div className="md:col-span-2 print:col-span-2 flex flex-col space-y-1.5">
           <ListHeading title="Course"/>
           <div className="text-sm font-medium text-primary print:text-xs print:font-medium">{row?.course?.title}</div>
        </div>
        <div className="flex flex-col space-y-1.5">
          <ListHeading title="Credit"/>
          <div className="text-sm text-slate-500 print:text-xs">{row?.course?.creditHour}</div>
        </div>
        <div className="flex flex-col space-y-1.5">
          <div className="text-sm uppercase text-slate-400 print:text-xs">{row?.type == 'R' ? 'Resit':''}</div>
        </div>

    </div>
  )
}

export default RegistrationSlipItem