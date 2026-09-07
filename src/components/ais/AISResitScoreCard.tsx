import React from 'react';
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
    data?: any;
    title?: string;
    
}

function AISResitScoreCard({ title,data }: Props) {
  return (
    <div className="w-full space-y-3 rounded">
    <h1 className="text-sm font-bold font-roboto tracking-wider text-primary-dark/60 flex flex-col md:flex-row justify-between">
      <span className="px-3 py-0.5 rounded border bg-primary-dark/80 text-white">{title}</span>
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 rounded bg-primary/70 text-xs text-white font-bold flex items-center">{data?.length} STUDENTS</span>
        <button className="px-3 py-1 rounded border border-green-600/70 text-xs text-green-600/90 font-bold flex items-center">EXPORT</button>
        <button className="px-3 py-1 rounded bg-green-600/90 text-xs text-white font-bold flex items-center">PUBLISH SCORES</button>
      </div>
    </h1>
    <div className="w-full rounded-lg shadow-md text-xs overflow-x-scroll md:overflow-hidden">
          <div className="px-3 py-2 bg-primary/10 text-primary-dark/70 font-bold grid grid-cols-9 tracking-wider">
            <span className="">PHOTO</span>
            <span className="col-span-2">INDEX NUMBER</span>
            <span className="col-span-3">STUDENT NAME</span>
            <span>COURSE</span>
            <span>SCORE</span>
            <span>GRADE</span>
          </div>
          { data.map((row:any) => (
            <div className="px-3 py-2 border-b grid grid-cols-9 font-medium text-xs text-primary/80">
              <img crossOrigin="anonymous" src={`${REACT_APP_API_URL}/auth/photos/?tag=${row?.student?.id}`} className="h-8 w-8 border rounded-md bg-white object-contain" />
              <span className="col-span-2 font-bold self-center">{row.indexno}</span>
              <span className="col-span-3 font-bold self-center">{(row.student?.fname+' '+(row.student?.mname && row.student?.mname+' ')+row.student?.lname).toUpperCase()} </span>
              <span className="font-medium text-sm self-center">{row.course?.id}</span>
              <span className="font-bold text-sm self-center">{row.totalScore || '--'}</span>
              <span className={`font-bold text-sm self-center ${ data.approveScore ? 'text-green-700':'text-primary-accent'}`}>{row.grade}</span>
            </div>
          ))}
         
    </div>
 </div>
  )
}

export default AISResitScoreCard