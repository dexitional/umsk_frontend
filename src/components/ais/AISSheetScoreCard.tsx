import React from 'react'
import { jsonToExcel } from '../../utils/util';
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
    data?: any;
    title?: string;
    
}

function AISSheetScoreCard({ title,data }: Props) {

  const exportSheet = () => {
    var fileName,output:any = [];
      if (data?.length) {
        for (var row of data) {
          let ds:any = {
            "STUDENT NUMBER": row?.student?.id,
            "INDEX NUMBER": row.indexno,
            "LAST NAME": row.student?.lname?.toUpperCase(),
            "OTHER NAME(S)": (row.student?.fname+' '+(row.student?.mname)).toUpperCase(),
            "COURSE": row.course?.title+' - '+row.courseId,
            "CLASS": row.classScore,
            "EXAMS": row.examScore,
            "TOTAL": row.totalScore,
            "GRADE": row.grade
          };
          output.push(ds);
        }
        fileName = 'SCORES - '+data[0].session?.title+' - '+data[0].session?.tag+' - '+data[0].course?.title+' - '+data[0].courseId+' - L'+(Math.ceil(data[0].semesterNum/2)*100)+' - '+data[0].student?.studyMode;
        return jsonToExcel(output, fileName);
      }
  }


  return (
    <div className="w-full space-y-3 rounded">
    <h1 className="text-sm font-bold font-roboto tracking-wider text-primary-dark/60 flex flex-col md:flex-row justify-between">
      <span className="px-3 py-0.5 rounded border border-primary/50">COURSE ASSESSMENTS</span>
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 rounded bg-primary/70 text-xs text-white font-bold flex items-center">{data?.length} STUDENTS</span>
        {/* <button className="px-3 py-1 rounded border border-primary/70 text-xs text-primary/70 font-bold flex items-center">PRINT</button> */}
        <button onClick={exportSheet} className="px-3 py-1 rounded border border-primary/70 text-xs text-primary/70 font-bold flex items-center">EXPORT</button>
      </div>
    </h1>
    <div className="w-full rounded-lg shadow-md text-xs overflow-x-scroll md:overflow-hidden">
          <div className="px-3 py-2 bg-primary/10 text-primary-dark/70 font-bold grid grid-cols-10 tracking-wider">
            <span className="">PHOTO</span>
            <span className="col-span-2">INDEX NUMBER</span>
            <span className="col-span-3">FULL NAME</span>
            <span>CLASS</span>
            <span>EXAMS</span>
            <span>TOTAL</span>
            <span>GRADE</span>
          </div>
          { data.map((row:any) => (
            <div className="px-3 py-2 border-b grid grid-cols-10 font-medium text-xs text-primary/80">
              <img crossOrigin="anonymous" src={`${REACT_APP_API_URL}/auth/photos/?tag=${row?.student?.id}`} className="h-8 w-8 border rounded-md bg-white object-contain" />
              <span className="col-span-2 font-bold self-center">{row.indexno}</span>
              <span className="col-span-3 font-bold self-center">{(row.student?.fname+' '+(row.student?.mname ? row.student?.mname+' ':'')+row.student?.lname).toUpperCase()} </span>
              <span className="font-medium text-sm self-center">{row.classScore}</span>
              <span className="font-medium text-sm self-center">{row.examScore}</span>
              <span className="font-bold text-sm self-center">{row.totalScore}</span>
              <span className="font-bold text-sm self-center text-primary-accent">{row.grade}</span>
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

export default AISSheetScoreCard