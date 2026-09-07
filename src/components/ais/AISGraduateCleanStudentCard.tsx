import React, { useState } from 'react';
import { Navigate, useLoaderData, useNavigate, useRouteLoaderData } from 'react-router';
import Service from "../../utils/aisService";
import { FiLoader } from 'react-icons/fi';
import { TbLoader } from 'react-icons/tb';
import { useHasRole } from "../../utils/roles";

const { REACT_APP_API_URL } = import.meta.env;

type Props = {
    data?: any;
    title?: string;
    index?: number;

}

function AISGraduateCleanStudentCard({ title,data, index }: Props) {
  const [ loading, setLoading ]:any = useState({ [`sheet${index}`]:false, [`cert${index}`]: false });
  const navigate = useNavigate();
  const canPrintCert = useHasRole("ais", ["graduation::admin", "graduation::registry"]);
 
  const generateSheet = async () => {
    setLoading((prev) => ({ ... prev, [`sheet${index}`]: true }))
    const ok = window.confirm("Goto Graduation Broadsheet?");
    if (ok) {
      const dm = await Service.fetchStudentTranscripts({ data: data?.filter((r) => r.verified)?.map( r => r.student?.indexno), key: index });
      if(dm) navigate(`../print`,  { state: { data: dm } });
    } setLoading((prev) => ({ ... prev, [`sheet${index}`]: false }))
  };

  const printCert = async () => {
    setLoading((prev) => ({ ... prev, [`cert${index}`]: true }))
    const ok = window.confirm("View Graduates Certificates?");
    if (ok) {
      const dm = await Service.fetchStudentTranscripts({ data: data?.filter((r) => r.verified)?.map( r => r.student?.indexno), key: index});
      if(dm) navigate(`../certs`,  { state: { data: dm } });
    } setLoading((prev) => ({ ... prev, [`cert${index}`]: true }))
  }

  const exportList = async () => {
    const ok = window.confirm("Generate New Graduation List?");
    if (ok) {
      await Service.generateGraduates(data?.id);
      navigate(0);
    }
  };

  const excludeStudent = async (indexno) => {
    const ok = window.confirm("Add Student to exclusion ?");
    if (ok) {
      const ins = await Service.excludeGraduate(indexno,{ graduateStatus: true });
      // if(ins?.success) navigate(0);
    }
  };


  return (
    <div className="w-full space-y-3 rounded">
    <h1 className="w-full text-sm font-bold font-roboto tracking-wider text-primary-dark/60 flex flex-col md:flex-row justify-between">
      <span className="px-3 py-0.5 rounded bg-primary-dark/80 w-3/5 text-white truncate">{title}</span>
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 rounded bg-primary/70 text-xs text-white font-bold flex items-center">{data?.filter((r) => r.verified)?.length } </span>
        { data?.filter((r) => r.verified)?.length && (<>
        <button onClick={generateSheet} className="px-3 py-1 rounded border border-primary/70 text-xs text-primary/70 font-bold flex items-center">
          { loading[`sheet${index}`] 
            ? <div className="flex flex-row items-center space-x-2">
               <TbLoader className="animate-spin" />
               <span className="animate-pulse">LOADING</span>
              </div>
            : <span>BROADSHEET</span>
          }
        </button>
        {canPrintCert ? (
          <button onClick={printCert} className="px-3 py-1 rounded border border-primary/70 text-xs text-primary/70 font-bold flex items-center">
            { loading[`cert${index}`]
              ? <div className="flex flex-row items-center space-x-2">
                 <FiLoader className="animate-spin" />
                 <span className="animate-pulse">LOADING</span>
                </div>
              : <span>PRINT CERTIFICATES</span>
            }
          </button>
        ) : null}
     
        </>
        ) || null}

        {/* <button onClick={exportList} className="px-3 py-1 rounded border border-green-600/70 text-xs text-green-600/90 font-bold flex items-center">EXPORT</button> */}
      </div>
    </h1>
    <div className="w-full rounded-lg shadow-md text-xs overflow-x-scroll md:overflow-hidden">
      <div className="px-3 py-2 bg-primary/10 text-primary-dark/70 font-bold grid grid-cols-11 tracking-wider">
        <span className="col-span-3">STUDENT NAME</span>
        <span className="col-span-2">INDEX NUMBER</span>
        <span className="col-span-3">PROGRAM</span>
        <span className="col-span-1">CGPA</span>
        <span className="col-span-2">CLASS</span>
      </div>
      { data?.filter((r) => r.verified)?.map((row:any, i:number) => (
        <div key={i} className="px-3 py-2 border-b grid grid-cols-11 font-medium text-xs text-primary/80">
          <span className="col-span-3 font-bold flex items-center space-x-2">
            <img crossOrigin="anonymous" src={`${REACT_APP_API_URL}/auth/photos/?tag=${row?.student?.id}`} className="h-8 w-8 border rounded-md bg-white object-contain" />
            <span>{(row.student?.lname+', '+row.student?.fname+' '+(row.student?.mname ? row.student?.mname+' ': '')).toUpperCase()} </span>
          </span>
          <span className="col-span-2 font-bold self-center">{row.student?.indexno}</span>
          <span className="col-span-3 font-bold self-center">{row.student?.program?.shortName}</span>
          <span className={`${row.taken ? 'text-primary-accent/80  self-center':' self-center'}`}>{row?.cgpa }</span>
          <span className={`${row.taken ? 'text-primary-accent/80  self-center':' self-center'} col-span-2`}>{row?.class?.toUpperCase()}</span>
        </div>
      ))}
      
      { !data?.filter((r) => r.verified)?.length && (
        <div className="px-3 py-4 border-b grid font-medium text-xs text-primary/80">
          <div className="font-semibold text-center italic">No Data !</div>
        </div>
      )}

    </div>
    
 </div>
  )
}

export default AISGraduateCleanStudentCard