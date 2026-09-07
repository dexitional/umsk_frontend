import React from 'react'
import { SiMicrosoftexcel } from "react-icons/si";
import Service from '../../utils/aisService';
import { exportToExcel } from 'react-json-to-excel';
import toast from 'react-hot-toast';
import moment from 'moment'

type Props = {}

function ReportListView({  }: Props) {
   
  const exportData = async (report: string) => {
     
     if(report == 'funder-list'){
        const data = await Service.fetchFunders();
        console.log(data)
        if(data){
          exportToExcel(data, 'funders_list_'+moment().format('DDMMYYHHmmSS'));
        } else {
          toast.error("No data to export !!")
        }
      }

     if(report == 'project-list'){
      const data = await Service.fetchProjects()
      console.log(data)
      if(data){
        exportToExcel(data, 'projects_list_'+new Date())
      } else {
        toast.error("No data to export !!")
      }
     }

     if(report == 'investigator-list'){
      const data = await Service.fetchInvestigators()
      console.log(data)
      if(data){
        exportToExcel(data, 'investigators_list_'+new Date())
      } else {
        toast.error("No data to export !!")
      }
     }

     if(report == 'personel-list'){
      const data = await Service.fetchPersonels()
      console.log(data)
      if(data){
        exportToExcel(data, 'personels_list_'+moment().format('MMDDYYHHmmSS'))
      } else {
        toast.error("No data to export !!")
      }
     }
  }

  return (
    <div className="py-6 grid grid-cols-1 gap-y-4 border bg-slate-50/50 rounded-xl">
      <div className="px-6 pb-4  hidden md:grid grid-cols-6 place-items-center border-b border-slate-200 text-xs text-gray-500 font-sans font-semibold uppercase tracking-widest">
          <div className="col-span-3 place-self-start">REPORT NAME</div>
          <div className="col-span-2 place-self-start">PARAMETERS</div>
          <div>Action</div>
      </div>
      {/* List of Projects */}
      <div className="px-6 pb-4 grid md:grid-cols-6 gap-y-2 md:gap-y-0 place-items-center border-b border-slate-200 text-xs text-gray-400 font-sans font-semibold uppercase tracking-widest">
          <div className="md:col-span-3 md:place-self-start">Staff Promotion Report</div>
          <div className="md:col-span-2 md:place-self-start">NONE</div>
          <div><button onClick={() => exportData('project-list')} className="px-2 py-0.5 rounded bg-green-800/60 text-white text-[0.65rem] flex items-center space-x-1"><span>EXPORT</span><SiMicrosoftexcel className="h-4 w-4"/> </button></div>
      </div>
      <div className="px-6 pb-4 grid md:grid-cols-6 gap-y-2 md:gap-y-0 place-items-center border-b border-slate-200 text-xs text-gray-400 font-sans font-semibold uppercase tracking-widest">
          <div className="md:col-span-3 md:place-self-start">Staff Qualification Report</div>
          <div className="md:col-span-2 md:place-self-start">NONE</div>
          <div><button onClick={() => exportData('funder-list')} className="px-2 py-0.5 rounded bg-green-800/60 text-white text-[0.65rem] flex items-center space-x-1"><span>EXPORT</span><SiMicrosoftexcel className="h-4 w-4"/> </button></div>
      </div>
      <div className="px-6 pb-4 grid md:grid-cols-6 gap-y-2 md:gap-y-0 place-items-center border-b border-slate-200 text-xs text-gray-400 font-sans font-semibold uppercase tracking-widest">
          <div className="md:col-span-3 md:place-self-start">Staff On-leave Report</div>
          <div className="md:col-span-2 md:place-self-start">NONE</div>
          <div><button onClick={() => exportData('investigator-list')} className="px-2 py-0.5 rounded bg-green-800/60 text-white text-[0.65rem] flex items-center space-x-1"><span>EXPORT</span><SiMicrosoftexcel className="h-4 w-4"/> </button></div>
      </div>
      <div className="px-6 pb-4 grid md:grid-cols-6 gap-y-2 md:gap-y-0 place-items-center border-b border-slate-200 text-xs text-gray-400 font-sans font-semibold uppercase tracking-widest">
          <div className="md:col-span-3 md:place-self-start">Transfer Report</div>
          <div className="md:col-span-2 md:place-self-start">NONE</div>
          <div><button onClick={() => exportData('personel-list')} className="px-2 py-0.5 rounded bg-green-800/60 text-white text-[0.65rem] flex items-center space-x-1"><span>EXPORT</span><SiMicrosoftexcel className="h-4 w-4"/> </button></div>
      </div>
      <div className="px-6 pb-4 grid md:grid-cols-6 gap-y-2 md:gap-y-0 place-items-center border-b border-slate-200 text-xs text-gray-400 font-sans font-semibold uppercase tracking-widest">
          <div className="md:col-span-3 md:place-self-start">New Appointment Report</div>
          <div className="md:col-span-2 md:place-self-start">NONE</div>
          <div><button onClick={() => exportData('personel-list')} className="px-2 py-0.5 rounded bg-green-800/60 text-white text-[0.65rem] flex items-center space-x-1"><span>EXPORT</span><SiMicrosoftexcel className="h-4 w-4"/> </button></div>
      </div>

    </div>
  )
}

export default ReportListView