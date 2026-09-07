import React from 'react'
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
    data?: any;
    title?: string;
    
}

function EVSVoterCard({ title,data }: Props) {
  return (
    <div className="w-full space-y-3 rounded">
    <h1 className="text-sm font-bold font-roboto tracking-wider text-primary-dark/60 flex flex-col md:flex-row justify-between">
      <span className="px-3 py-0.5 rounded border border-primary/50">{title}</span>
      <span className="px-3 py-0.5 rounded bg-primary/70 text-xs text-white font-bold flex items-center">{data?.length} STUDENTS</span>
    </h1>
    <div className="w-full rounded-lg shadow-md text-xs overflow-x-scroll md:overflow-hidden">
          <div className="px-3 py-2 bg-primary/10 text-primary-dark/70 font-bold grid grid-cols-9 tracking-wider">
            <span className="col-span-2">STUDENT NUMBER</span>
            <span className="col-span-2">INDEX NUMBER</span>
            <span className="col-span-3">FULL NAME</span>
            <span>GENDER</span>
            <span>STATUS</span>
          </div>
          { data.map((row:any) => (
            <div className="px-3 py-2 border-b grid grid-cols-9 font-medium text-xs text-primary/80">
               <span className="col-span-2 font-bold flex items-center space-x-2">
                <img crossOrigin="anonymous" src={`${REACT_APP_API_URL}/auth/photos/?tag=${row?.id}`} className="h-8 w-8 border rounded-md bg-white object-contain" />
                <span>{row?.id}</span>
               </span>
              <span className="col-span-2 font-bold self-center">{row.indexno}</span>
              <span className="col-span-3 font-medium self-center">{(row.fname+' '+(row.mname && row.mname+' ')+row.lname).toUpperCase()} </span>
              <span className='self-center'>{row.gender == 'M' ? 'MALE':'FEMALE'}</span>
              <span className={`${row.deferStatus ? 'text-primary-accent/80 self-center':'self-center'}`}>{row.deferStatus ? 'DEFERRED':'ACTIVE'}</span>
            </div>
          ))}
          {/* Totals */}
          {/* <div className="px-3 py-2 border-b grid grid-cols-8 font-bold text-xs text-primary-accent/80">
            <span>&nbsp;</span>
            <span className="col-span-4 font-bold">CGPA:&nbsp;&nbsp;&nbsp;{ cgpa && cgpa[index] || 0 }</span>
            <span>GPA:&nbsp;&nbsp;&nbsp;{gpa?.toFixed(1)}</span>
            <span>TCR:&nbsp;&nbsp;&nbsp;{ credit?.toFixed(1) }</span>
            <span>TGP:&nbsp;&nbsp;&nbsp;{ gradepoint?.toFixed(1) }</span>
          </div> */}
    </div>
 </div>
  )
}

export default EVSVoterCard