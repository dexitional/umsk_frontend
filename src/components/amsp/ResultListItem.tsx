import React from 'react'
import ListHeading from './ListHeading';

type Props = {
    row: any;
}

function ResultListItem({ row }: Props) {
  return (
    <div className={`px-3 md:px-6 pb-4 grid md:grid-cols-6 gap-y-1 md:gap-y-0 md:gap-x-2 md:place-items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group`}>
        <div className="capitalize flex flex-col space-y-2 md:place-self-start">
          <ListHeading title="Code"/>
          <span className="">{row.courseId}</span>
        </div>
        
        <div className="md:col-span-2 md:place-self-start flex flex-col space-y-2">
           <ListHeading title="Course"/>
           <span className="">{row.course?.title}</span>
        </div>
        <div className="capitalize flex flex-col space-y-2">
          <ListHeading title="CR"/>
          <span className="px-2">{row?.credit}</span>
        </div>
        <div className="capitalize flex flex-col space-y-2">
          <ListHeading title="GD"/>
          <span className="px-2">{ (row.totalScore) ? row.grade : 'I'}</span>
        </div>
        <div className="flex flex-col space-y-2 md:text-center">
          <ListHeading title="GP" />
          <span className="px-2 capitalize">{row.totalScore ? (row.gradepoint * row.credit).toFixed(1) : ''}</span>
        </div>
    </div>
  )
}

export default ResultListItem