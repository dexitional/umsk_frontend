import React from 'react';
// @ts-ignore
import { HiMiniAcademicCap } from 'react-icons/hi2';
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
}

function ResitCardItem({ data }: Props) {
  
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
        <div className="my-4 flex items-center space-x-4">
          <span className={`text-primary/80 text-xs  font-bold capitalize`}>{data?.course?.title?.toUpperCase()} - <span className="text-primary-dark/70">{data?.course?.id} ( {data?.course?.creditHour} credits )</span></span>
        </div>
        <div className="flex items-center space-x-4">
          <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-primary/70" />
          <span className={`${data?.student?.program?.longName ? 'text-gray-500':'text-red-500'} text-xs  font-bold capitalize`}>{data?.student?.program?.longName || 'Not assigned' }</span>
        </div>
       <div className="flex items-center space-x-4">
            <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-red-500/70" />
            <span className={`text-red-500/70 text-xs  font-bold capitalize`}>{data?.trailSession?.title} {data?.trailSession?.tag == 'SUB' ? ', JANUARY': 'MAIN'}</span>
      </div>
      <hr/>
      {data.registerSession && 
      <div className="flex items-center space-x-4">
            <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-green-700/70" />
            <span className={`text-green-700/70 text-xs  font-bold capitalize`}>{data?.registerSession?.title} {data?.registerSession?.tag == 'SUB' ? ', JANUARY': 'MAIN'}</span>
      </div>
      }
      {data.session && 
      <div className="flex items-center space-x-4">
            <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-green-700/70" />
            <span className={`text-green-700/70 text-xs  font-bold capitalize`}>{data?.session?.title} </span>
      </div>
      }
      <div className="flex justify-between">
          <div className="flex items-center space-x-1">
                {/* <FaLevelUpAlt className="h-4 w-5 text-primary/70" /> */}
                <span className="px-2 py-0 bg-green-50 rounded border font-bold text-xs text-gray-500">{data.paid ? 'PAID':'UNPAID'}</span>
            </div>
            <div className="flex items-center space-x-1">
                {/* <FaLevelUpAlt className="h-4 w-5 text-primary/70" /> */}
                <span className="px-2 py-0 bg-green-50 rounded border font-bold text-xs text-gray-500">{data.registerSessionId ? 'REGISTERED':'UNREGISTERED'} </span>
            </div>
            <div className="flex items-center space-x-1">
                {/* <FaLevelUpAlt className="h-4 w-5 text-primary/70" /> */}
                <span className="px-2 py-0 bg-green-50 rounded border font-bold text-xs text-gray-500">{data.taken ? 'TAKEN':'UNTAKEN'} </span>
            </div>
       </div>
     </div>
    <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="flex group-hover:hidden items-center justify-center space-x-3 text-center">
              <span className={`bg-green-950/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}>YEAR</span>
              <span className="font-semibold font-roboto text-base text-primary/60">{Math.ceil(data?.semesterNum/2)}</span>
          </div>
          <div className="flex group-hover:hidden items-center justify-center space-x-3 text-center">
              <span className={`bg-green-950/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}>YEAR</span>
              <span className="font-semibold font-roboto text-base text-primary/60">{Math.ceil(data?.semesterNum/2)}</span>
          </div>
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 hidden md:flex rounded-md border bg-white justify-between items-center space-x-2 group">
         <div className="hidden md:flex items-center justify-center space-x-3 text-center">
            <span className={`bg-primary-dark/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}>YEAR</span>
            <span className="font-semibold font-roboto text-base text-primary/60">{(Math.ceil(data?.semesterNum/2))}</span>
          </div>
          <div className="hidden md:flex items-center justify-center space-x-3 text-center">
            <span className={`${data.approveScore ? 'bg-green-600/60':'bg-amber-700/60'} py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}>NEW SCORE</span>
            <span className="font-semibold font-roboto text-base text-primary/60">{data?.totalScore ? data?.totalScore : '--' }</span>
          </div>
        
        </div>
    </div>
    
  </div>
  )
}

export default ResitCardItem