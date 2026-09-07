import React from 'react';
import { FaCertificate } from 'react-icons/fa';
import { GrCertificate } from 'react-icons/gr';
// @ts-ignore
import { HiMiniAcademicCap } from 'react-icons/hi2';
import { PiCertificate, PiCertificateBold } from 'react-icons/pi';
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
}

function GraduateCardItem({ data }: Props) {
  
  return (
  <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-2 md:group">
    <h2 className="text-base md:text-lg font-semibold font-noto text-gray-500 uppercase">{data?.student?.id}</h2>
    <div className="w-full flex items-center justify-between space-x-2">
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="text-sm md:text-sm text-primary-dark/70 font-bold font-roboto capitalize">{(data?.student?.fname+' '+(data?.student?.mname ? data?.student?.mname+' ': '')+data?.student?.lname).toUpperCase()}</div>
        <div className="py-0.5 px-2 text-sm rounded bg-primary/60 text-white font-bold">{data?.student?.gender}</div>
      </div>
      {/* <img src={`${REACT_APP_API_URL}/auth/photos/?tag=${data?.student?.id}` || Logo} className="p-1 h-12 w-12 border rounded-md bg-white object-contain" /> */}
    </div>
    <div className="w-full space-y-2 font-roboto">
        {/* <div className="my-4 flex items-center space-x-4">
          <span className={`text-primary/80 text-xs  font-bold capitalize`}>{data?.course?.title?.toUpperCase()} - <span className="text-primary-dark/70">{data?.course?.id} ( {data?.course?.creditHour} credits )</span></span>
        </div> */}
        <div className="flex items-center space-x-4">
          <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-primary/70" />
          <span className={`${data?.student?.program?.longName ? 'text-gray-500':'text-red-500'} text-xs  font-bold capitalize`}>{data?.student?.program?.longName || 'Not assigned' }</span>
        </div>
       
      <hr/>
     
      {data.session && 
      <div className="flex items-center space-x-4">
        <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-green-800/70" />
        <span className={`text-green-800/70 text-xs  font-bold capitalize`}>{data?.session?.title?.toUpperCase()} </span>
      </div>
      }
      {data.certNo && 
      <div className="flex items-center space-x-4">
        <PiCertificateBold className="h-5 w-5 text-green-800/70" />
        <span className="px-2 py-0 bg-green-50 rounded border font-bold text-xs text-gray-500">{data.certNo || '44323424242'}</span>
      </div>
      }
      
     </div>
    <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="flex group-hover:hidden items-center justify-center space-x-3 text-center">
              <span className={`bg-green-950/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}>CGPA</span>
              <span className="font-semibold font-roboto text-base text-primary/60">{data?.cgpa}</span>
          </div>
         
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 hidden md:flex rounded-md border bg-white justify-between items-center space-x-2 group">
         <div className="hidden md:flex items-center justify-center space-x-3 text-center">
            <span className={`bg-primary-dark/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}>CGPA</span>
            <span className="font-semibold font-roboto text-base text-primary/60">{data?.cgpa}</span>
          </div>
          
        
        </div>
    </div>
    
  </div>
  )
}

export default GraduateCardItem