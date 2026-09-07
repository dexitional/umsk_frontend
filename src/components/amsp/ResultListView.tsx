import React from 'react'
import ResultListItem from './ResultListItem';

type Props = { 
  data?: any;
  title?: string;
  index: number;
  cgpa?: any
}

function ResultListView({ title,data,index,cgpa }: Props) {

  let credit = data.reduce((sum,cur) => cur.credit+sum, 0);
  let gradepoint = data.reduce((sum,cur) => (cur.credit*cur.gradepoint)+sum,0);
  let gpa = gradepoint/credit;
  console.log(cgpa)

  return (
    <div className="space-y-2">
      <div className="px-3 flex flex-col md:flex-row items-center justify-between">
        <h1 className="w-full text-sm md:text-base font-bold font-roboto tracking-wider text-primary-accent/80 flex flex-col md:flex-row justify-between">
          <span>{title}</span>
          <span className="px-3 py-0.5 bg-primary-accent/80 text-xs md:text-sm text-white md:font-bold">LEVEL {data && Math.ceil((data[0].semesterNum/2) * 100) || 'NONE'}</span>
        </h1>
      </div>
      <div className="pt-6 grid grid-cols-1 gap-y-4 border bg-slate-50/50 rounded-xl">
        <div className="px-6 pb-4  hidden md:grid grid-cols-6 place-items-center border-b border-slate-200 text-xs text-primary font-sans font-semibold uppercase tracking-widest">
            <div className="place-self-start">Code</div>
            <div className="col-span-2 place-self-start">Course</div>
            <div>CR</div>
            <div>GD</div>
            <div>GP</div>
        </div>
        <div className="grid grid-cols-1 text-xs text-slate-600 font-roboto font-medium tracking-widest">
          { data && data?.map((row:any) => (<ResultListItem key={row.id} row={row} />))}
          { !data && (<h1 className="w-full text-center text-gray-400 text-[0.65rem] font-semibold tracking-widest uppercase">No Record ...</h1>)}
        </div>
        { data && 
        <div className="px-6 pb-4 md:grid grid-cols-6 place-items-center border-slate-200 text-xs text-primary/70 font-sans font-semibold uppercase tracking-widest">
            <div className="place-self-start">&nbsp;</div>
            <div className="col-span-2 place-self-start flex items-center justify-between"><span>CGPA:</span>&nbsp;&nbsp;&nbsp;<span>{ cgpa && cgpa[index] || 0 }</span></div>
            <div className="flex items-center justify-between"><span>GPA:</span>&nbsp;&nbsp;&nbsp;<span>{gpa?.toFixed(1)}</span></div>
            <div className="flex items-center justify-between"><span>TCR:</span>&nbsp;&nbsp;&nbsp;<span>{ credit?.toFixed(1)}</span></div>
            <div className="flex items-center justify-between"><span>TGP:</span>&nbsp;&nbsp;&nbsp;<span>{ gradepoint?.toFixed(1)}</span></div>
        </div>
        }
      </div>
    </div>
  )
}

export default ResultListView