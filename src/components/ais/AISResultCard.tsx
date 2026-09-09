import React from 'react';
import Service from "../../utils/aisService";
import { useNavigate } from 'react-router';
import { useHasRole } from '../../utils/roles';

type Props = {
    data?: any;
    title?: string;
    meta?: { gpa: number | null; cgpa: number | null; credit: number; gradepoint: number };
}

function AISResultCard({ title,data,meta }: Props) {

  const navigate = useNavigate();
  const canManageResults = useHasRole("ais", ["sheet::admin"]);

  const deleteRecord = async (id) => {
      if(window.confirm(`Delete Assessment Record?`)){
        if(window.prompt(`Enter Authorization Pin`) == new Date().getFullYear().toString()){
          const resp = await Service.deleteStudentTranscript(id);
          if(resp) navigate(0);
        }
      }
  }

  const publishRecord = async (id) => {
    if(window.confirm(`Publish Score for this course?`)){
      if(window.prompt(`Enter Authorization Pin`) == new Date().getFullYear().toString()){
        const resp = await Service.publishStudentTranscript(id);
        if(resp) navigate(0);
      }
    }
}
  
  return (
    <div className="w-full space-y-3 rounded">
    <h1 className="text-sm font-bold font-roboto tracking-wider text-primary-dark/60 flex flex-col md:flex-row justify-between">
      <span>{title}</span>
      <span className="px-3 py-0.5 bg-primary/70 text-xs text-white font-bold">YEAR {data && (Math.ceil(data[0].semesterNum/2)) || 'NONE'}</span>
    </h1>
    <div className="w-full rounded-lg shadow-md text-xs overflow-x-scroll md:overflow-hidden">
          <div className="px-3 py-2 bg-primary/10 text-primary-dark/70 font-bold grid grid-cols-9 tracking-wider">
            <span >CODE</span>
            <span className="col-span-4">COURSE</span>
            <span>CH</span>
            <span>GRADE</span>
            <span>GPT</span>
            <span>&nbsp;</span>
          </div>
          { data.map((row:any) => (
            <div className="px-3 py-2 border-b grid grid-cols-9 font-medium text-xs text-primary/80">
              <span className="font-bold">{row.courseId}</span>
              <span className="col-span-4 font-medium flex flex-col">
                <span className="font-semibold">{row.course?.title}</span>
                {canManageResults ? (<span className="text-primary-dark">{row.session?.title} <br/>( Session ID:  {row.sessionId} )</span>) : null }
              </span>
              <span>{row.credit}</span>
              <span>{row.totalScore != null ? `(${row.totalScore})` : null } {row.grade}</span>
              <span>{isNaN(row.gradepoint * row.credit) ? '--': (row.gradepoint * row.credit).toFixed(1)}</span>
              
              {canManageResults ? (
              <div className="flex flex-col space-y-1">
                { !row.status ?
                  <button className="px-3 rounded-full shadow border border-red-300/50 text-red-400/50">
                    Unpublish
                  </button>
                  :
                  <button className="px-3 rounded-full shadow border border-green-400/50 text-green-500/50" onClick={() => row.totalScore ? publishRecord(row.id) : alert(`Incomplete score cannot be published.`) }>
                    Publish
                  </button>
                }
               
                 <button className="px-3 rounded-full shadow border border-red-300/50 text-red-400/50" onClick={() => deleteRecord(row.id) }>
                   Delete
                 </button>
              </div>) : <div className="">&nbsp;</div> }

             </div>
          ))}
          {/* Totals */}
          <div className="px-3 py-2 border-b grid grid-cols-8 font-bold text-xs text-secondary-accent/80">
            <span>&nbsp;</span>
            <span className="col-span-4 font-bold">CGPA:&nbsp;&nbsp;&nbsp;{ meta?.cgpa == null ? '--' : meta.cgpa }</span>
            <span>GPA:&nbsp;&nbsp;&nbsp;{ meta?.gpa == null ? '--' : meta.gpa }</span>
            <span>TCH:&nbsp;&nbsp;&nbsp;{ meta?.credit == null ? '--' : meta.credit.toFixed(1) }</span>
            <span>TGP:&nbsp;&nbsp;&nbsp;{ meta?.gradepoint == null ? '--' : meta.gradepoint.toFixed(1) }</span>
          </div>
    </div>
 </div>
  )
}

export default AISResultCard