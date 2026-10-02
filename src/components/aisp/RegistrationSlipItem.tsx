import React from 'react'
import ListHeading from './ListHeading';

type Props = {
    row: any;
}

// Also rendered by print/PrintRegisterSlip — keep the print: variants intact.
function RegistrationSlipItem({ row }: Props) {

  return (
    <div className={`px-5 md:px-6 py-4 grid grid-cols-2 md:grid-cols-5 print:grid-cols-5 gap-3 md:gap-4 print:gap-x-2 md:items-center print:items-center text-xs text-slate-500 print:text-gray-700 border-b border-slate-100 print:border-slate-200 last:border-0 hover:bg-sky-50/40 transition-colors`}>
        <div className="flex flex-col print:items-start gap-1">
          <ListHeading title="Code"/>
          <div className="text-xs font-mono font-semibold text-sky-700 print:font-sans print:font-normal print:text-gray-700">{row?.courseId}</div>
        </div>

        <div className="col-span-2 order-first md:order-none print:order-none print:col-span-2 flex flex-col gap-1">
           <ListHeading title="Course"/>
           <div className="text-sm font-semibold text-slate-800 print:text-xs print:font-medium print:text-gray-700">{row?.course?.title}</div>
        </div>
        <div className="flex flex-col gap-1">
          <ListHeading title="Credit"/>
          <div className="text-sm text-slate-500 tabular-nums print:text-xs">{row?.course?.creditHour}</div>
        </div>
        <div className="flex flex-col gap-1">
          {row?.type == 'R' ? (
            <span className="w-fit px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200 text-[0.68rem] font-bold uppercase print:p-0 print:ring-0 print:bg-transparent print:text-xs print:font-normal print:text-gray-700">Resit</span>
          ) : null}
        </div>

    </div>
  )
}

export default RegistrationSlipItem
