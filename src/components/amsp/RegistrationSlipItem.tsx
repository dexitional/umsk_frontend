import React from 'react'
import ListHeading from './ListHeading';

type Props = {
    row: any;
}

function RegistrationSlipItem({ row }: Props) {
  console.log(row)
  
  return (
    <div className={`px-3 md:px-6 pb-4 grid md:grid-cols-5 print:grid-cols-5 gap-y-1 md:gap-y-0 md:gap-x-2 md:place-items-center print:gap-y-0 print:gap-x-2 print:place-items-center font-roboto font-medium text-xs text-gray-500 print:text-gray-700 border-b border-slate-200 hover:bg-slate-50/50 group tracking-widest`}>
        <div className="capitalize flex flex-col space-y-2 md:place-self-start print:md:place-self-start">
          <ListHeading title="Code"/>
          <div className="px-2 md:px-0">{row?.courseId}</div>
        </div>
        
        <div className="md:col-span-2 print:col-span-2 md:place-self-start print:place-self-start flex flex-col space-y-2">
           <ListHeading title="Course"/>
           <div className="px-2 md:px-0">{row?.course?.title}</div>
        </div>
        <div className="capitalize flex flex-col space-y-2">
          <ListHeading title="Credit"/>
          <div className="px-2">{row?.course?.creditHour}</div>
        </div>
        <div className="capitalize flex flex-col space-y-2">
          <div className="px-2 uppercase">{row?.type == 'R' ? 'Resit':''}</div>
        </div>
        
    </div>
  )
}

export default RegistrationSlipItem