import React from 'react';
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
    data?: any;
    title?: string;

}

// Narrower clone of AISBacklogRecordCard for the ExamScore Module --
// exam score batches only ever have one shape of row (INDEX, YEAR,
// SEMESTER, COURSE, EXAM, RECORD TYPE), so no type-branching is needed.
function AISExamScoreRecordCard({ title,data }: Props) {
  return (
    <div className="w-full space-y-3 rounded">
    <h1 className="text-sm font-bold font-roboto tracking-wider text-primary-dark/60 flex flex-col md:flex-row justify-between">
      <span className="px-3 py-0.5 rounded border border-primary/50">EXAM SCORE DATA</span>
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 rounded bg-primary/70 text-xs text-white font-bold flex items-center">{data?.meta?.length} RECORDS</span>
      </div>
    </h1>
    <div className="w-full rounded-lg shadow-md text-xs overflow-x-scroll md:overflow-hidden">
          <div className="px-3 py-2 bg-primary/10 text-primary-dark/70 font-bold grid grid-cols-7 tracking-wider">
            <span className="col-span-2">INDEX NUMBER</span>
            <span className="col-span-1">YEAR GROUP</span>
            <span>SEMESTER</span>
            <span>COURSE</span>
            <span>EXAM</span>
            <span>RECORD TYPE</span>
          </div>
          { data?.meta?.map((row:any) => (
            <div key={row?.id} className="px-3 py-2 border-b grid grid-cols-7 font-medium text-xs text-primary/80">
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
                YR {Math.ceil(row.semesterNum/2)}
              </span>
              <span className="col-span-1 font-bold self-center">
                {row.semesterNum%2 == 0 ? 'SEM 2':'SEM 1'}
              </span>
              <span className="col-span-1 font-bold self-center">{row.courseId}</span>
              <span className="col-span-1 font-bold self-center">{row.scoreExam}</span>
              <span className="col-span-1 font-bold self-center">{row.scoreType == 'N'?'ASSESSMENT':'RESIT'}</span>
             </div>
          ))}
    </div>
 </div>
  )
}

export default AISExamScoreRecordCard
