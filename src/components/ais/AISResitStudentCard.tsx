import React from 'react';

const { REACT_APP_API_URL } = import.meta.env;

type Props = {
    data?: any;
    title?: string;
    
}

function AISResitStudentCard({ title,data }: Props) {
  return (
    <div className="w-full space-y-3 rounded">
    <h1 className="text-sm font-bold font-roboto tracking-wider text-primary-dark/60 flex flex-col md:flex-row justify-between">
      <span className="px-3 py-0.5 rounded bg-primary-dark/80 text-white">{title}</span>
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 rounded bg-primary/70 text-xs text-white font-bold flex items-center">{data?.length} STUDENTS</span>
        {/* <button className="px-3 py-1 rounded border border-primary/70 text-xs text-primary/70 font-bold flex items-center">PRINT</button> */}
        <button className="px-3 py-1 rounded border border-green-600/70 text-xs text-green-600/90 font-bold flex items-center">EXPORT</button>
      </div>
    </h1>
    <div className="w-full rounded-lg shadow-md text-xs overflow-x-scroll md:overflow-hidden">
          <div className="px-3 py-2 bg-primary/10 text-primary-dark/70 font-bold grid grid-cols-9 tracking-wider">
            <span className="col-span-3">STUDENT NAME</span>
            <span className="col-span-2">INDEX NUMBER</span>
            <span className="col-span-3">COURSE</span>
            <span>STATUS</span>
          </div>
          { data?.map((row:any, i:number) => (
            <div key={i} className="px-3 py-2 border-b grid grid-cols-9 font-medium text-xs text-primary/80">
               <span className="col-span-3 font-bold flex items-center space-x-2">
                <img crossOrigin="anonymous" src={`${REACT_APP_API_URL}/auth/photos/?tag=${row?.student?.id}`} className="h-8 w-8 border rounded-md bg-white object-contain" />
                <span>{(row.student?.fname+' '+(row.student?.mname ? row.student?.mname+' ': '')+row.student?.lname).toUpperCase()} </span>
               </span>
              <span className="col-span-2 font-bold self-center">{row.student.indexno}</span>
              <span className="col-span-3 font-bold self-center">{row.course.id} ( {row.course.creditHour} CR )</span>
              <span className={`${row.taken ? 'text-primary-accent/80  self-center':' self-center'}`}>{row.taken ? 'TAKEN':'NOT TAKEN'}</span>
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

export default AISResitStudentCard