import React from 'react';
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
    data?: any;
    title?: string;
    
}

function AISBacklogRecordCard({ title,data }: Props) {
  return (
    <div className="w-full space-y-3 rounded">
    <h1 className="text-sm font-bold font-roboto tracking-wider text-primary-dark/60 flex flex-col md:flex-row justify-between">
      <span className="px-3 py-0.5 rounded border border-primary/50">BACKLOG DATA</span>
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 rounded bg-primary/70 text-xs text-white font-bold flex items-center">{data?.meta?.length} RECORDS</span>
        {/* <button className="px-3 py-1 rounded border border-primary/70 text-xs text-primary/70 font-bold flex items-center">PRINT</button> */}
        {/* <button className="px-3 py-1 rounded border border-primary/70 text-xs text-primary/70 font-bold flex items-center">EXPORT</button> */}
      </div>
    </h1>
    <div className="w-full rounded-lg shadow-md text-xs overflow-x-scroll md:overflow-hidden">
          <div className={`px-3 py-2 bg-primary/10 text-primary-dark/70 font-bold grid ${ data.type == 'ASSESSMENT' ? 'grid-cols-9':'grid-cols-6'} tracking-wider`}>
            <span className="col-span-2">INDEX NUMBER</span>
            <span className="col-span-1">LEVEL</span> 
            <span>SEMESTER</span>
            
            <span>COURSE</span>
            { data.type == 'ASSESSMENT' ? <>
            <span>CLASS</span>
            <span>EXAMS</span>
            <span>TOTAL</span>
            </>: null }
           
            <span>RECORD TYPE</span>
          </div>
          { data?.meta?.map((row:any) => (
            <div key={row?.id} className={`px-3 py-2 border-b grid ${ data.type == 'ASSESSMENT' ? 'grid-cols-9':'grid-cols-6'} font-medium text-xs text-primary/80`}>
               <span className="col-span-2 font-bold flex items-center space-x-2">
                <img crossOrigin="anonymous" src={`${REACT_APP_API_URL}/auth/photos/?tag=${row?.student?.id}`} className="h-8 w-8 border rounded-md bg-white object-contain" />
                <span
                  className={row?.studentExists === false ? "border border-red-500 rounded px-1.5 py-0.5 text-red-600" : ""}
                  title={row?.studentExists === false ? "No matching student record found for this index number" : undefined}
                >
                  {row?.indexno}
                </span>
               </span>
              <span className="col-span-1 font-bold self-center">
                L {Math.ceil(row.semesterNum/2)*100}
              </span>
              <span className="col-span-1 font-bold self-center">
                {row.semesterNum%2 == 0 ? 'SEM 2':'SEM 1'}
              </span>
              <span className="col-span-1 font-bold self-center">{row.courseId}</span>
              { data.type == 'ASSESSMENT' ? <>
              <span className="col-span-1 font-bold self-center">{row.scoreClass}</span>
              <span className="col-span-1 font-bold self-center">{row.scoreExam}</span>
              <span className="col-span-1 font-bold self-center">{row.scoreTotal}</span>
              </>: null }
              <span className="col-span-1 font-bold self-center">{row.scoreType == 'N'?'ASSESSMENT':'RESIT'}</span>
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

export default AISBacklogRecordCard