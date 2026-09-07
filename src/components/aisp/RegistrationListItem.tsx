import React from 'react'
import ListHeading from './ListHeading';
import { useUserStore } from '../../utils/authService';
import toast from 'react-hot-toast';

type Props = {
    row: any;
}

function RegistrationListItem({ row }: Props) {
  
  const courses  = useUserStore(state => state.courses)
  const choose = (code) => {
    toast.success(`${code} Selected!`)
    let newcourses = [ ...courses ];
    const hasCode = newcourses.find((course:any) => course == code)
    newcourses = hasCode ? [...newcourses.filter((course:any) => course != code)] : [...newcourses,code]
    useUserStore.setState({ courses: newcourses })
  }
  
  const hasCode = courses.find((course:any) => course == row.code)

  return (
    <div className="px-4 md:px-6 py-4 grid md:grid-cols-6 gap-3 md:gap-4 md:items-center border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors">
        <div className="flex flex-col space-y-1.5">
          <ListHeading title="Code"/>
          <span className="text-sm text-slate-500">{row?.code}</span>
        </div>

        <div className="md:col-span-2 flex flex-col space-y-1.5">
           <ListHeading title="Course"/>
           <span className="text-sm font-medium text-primary">{row?.course}</span>
        </div>
        <div className="flex flex-col space-y-1.5">
          <ListHeading title="Credit"/>
          <span className="text-sm text-slate-500">{row?.credit}</span>
        </div>
        <div className="flex flex-col space-y-1.5">
          <ListHeading title="Type"/>
          <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium uppercase">{row.type == 'C' ? 'Compulsory' : row.type == 'E' ? 'Elective': row.type == 'R' ? 'Resit':'Optional'}</span>
        </div>
        <div className="flex flex-col space-y-1.5 md:items-end">
          <ListHeading title="Action" />
          { hasCode
          ? <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-accent/10 text-primary-accent text-xs font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-accent" />
              Chosen
            </span>
          : <button onClick={() => choose(row?.code)} className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary/90 transition-colors">Choose</button>
          }
        </div>
    </div>
  )
}

export default RegistrationListItem