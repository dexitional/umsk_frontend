import React from 'react'
import { FaPhone } from 'react-icons/fa'
// @ts-ignore
import moment from 'moment'
import { AiOutlineFieldNumber } from 'react-icons/ai'
import { HiMiniAcademicCap } from 'react-icons/hi2'
import Logo from '../../assets/img/logo/aucc/logo.png'

const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
}

function DebtCardItem({ data }: Props) {
  return (
  <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-2 md:group">
    <h2 className="text-base md:text-base font-semibold font-noto text-gray-500 uppercase">{data?.id}</h2>
    <div className="w-full flex items-center justify-between space-x-2">
      <div className="w-full flex items-center justify-between space-x-2">
          <div className="text-sm md:text-sm text-primary-dark/70 font-bold font-roboto capitalize">{(data?.fname+' '+(data?.mname ? data?.mname+' ': '')+data?.lname).toUpperCase()}</div>
          <div className="py-0.5 px-2 text-sm rounded bg-primary/60 text-white font-bold">{data?.gender}</div>
      </div>
      <img crossOrigin="anonymous" src={`${REACT_APP_API_URL}/auth/photos/?tag=${data?.id}` || Logo} className="p-1 h-12 w-12 border rounded-md bg-white object-contain" />
    </div>
    <div className="space-y-1.5 font-roboto">
        <div className="flex items-center space-x-4">
            <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-primary/70" />
            <span className={`${data.program?.longName ? 'text-gray-500':'text-red-500'} text-xs  font-bold capitalize`}>{data.program?.longName || 'Not assigned' }</span>
        </div>
        <div className="flex items-center space-x-4">
            <FaPhone className="rotate-90 h-4 w-5 text-primary/70" />
            <span className="text-sm text-gray-500">{data?.phone}</span>
        </div>
        <div className="flex items-center space-x-4">
            <AiOutlineFieldNumber className="h-4 w-5 text-primary/70" />
            <span className="text-xs text-gray-500 font-semibold tracking-wider">{data?.indexno || 'Not Set'}</span>
        </div>
       
        <div className="mt-10 flex items-center space-x-4">
            <AiOutlineFieldNumber className="h-4 w-5 text-primary/70" />
            <div className={`bg-green-50 px-2 py-0.5  rounded border text-xs font-semibold text-gray-500`}>LEVEL:  {(Math.ceil(data?.semesterNum/2) * 100) || 'COMPLETED'}</div>
        </div>
      
        
    </div>
    <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="flex group-hover:hidden items-center justify-center space-x-3 text-center">
              <span className={`${moment(data?.start_date).format("YYYY") == moment().format("YYYY") ? 'bg-green-950/60':'bg-red-950/60'} py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}>Level</span>
              <span className="font-semibold font-roboto text-base text-primary/60">{Math.ceil(data?.semesterNum/2) * 100}</span>
          </div>
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center md:justify-start space-x-2 group">
          <div className="hidden md:flex items-center justify-center space-x-3 text-center">
              <span className={`bg-red-800/80 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}>{ data?.accountNet > 0 ? 'DEBT':'BAL' }</span>
              <span className="font-bold font-roboto text-base text-primary/80">  {data.entryGroup == 'INT' ? 'USD':'GH₵'} {Math.abs(data?.accountNet)}</span>
          </div>
        </div>
    </div>
    
  </div>
  )
}

export default DebtCardItem