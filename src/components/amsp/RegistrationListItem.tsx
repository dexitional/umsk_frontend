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
     let newcourses = [...courses];
     const hasCode = newcourses.find((course:any) => course == code)
     newcourses = hasCode ? [...newcourses.filter((course:any) => course != code)] : [...newcourses,code]
     useUserStore.setState({ courses: newcourses })
  }

  const hasCode = courses.find((course:any) => course == row.code)
     

  return (
    <div className={`px-3 md:px-6 py-4 grid md:grid-cols-6 gap-y-1 md:gap-y-0 md:gap-x-2 md:place-items-center font-roboto font-medium text-xs text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group tracking-widest`}>
        <div className="capitalize flex flex-col space-y-2 md:place-self-start">
          <ListHeading title="Code"/>
          <span className="">{row?.code}</span>
        </div>
        
        <div className="md:col-span-2 md:place-self-start flex flex-col space-y-2">
           <ListHeading title="Course"/>
           <span className="">{row?.course}</span>
        </div>
        <div className="capitalize flex flex-col space-y-2">
          <ListHeading title="Credit"/>
          <span className="px-2">{row?.credit}</span>
        </div>
        <div className="capitalize flex flex-col space-y-2">
          <ListHeading title="Type"/>
          <span className="px-2 uppercase">{row.type == 'C' ? 'Compulsory' : row.type == 'E' ? 'Elective': row.type == 'R' ? 'Resit':'Optional'}</span>
        </div>
        <div className="flex flex-col space-y-2 md:text-center">
          <ListHeading title="Action" />
          <div>
            { hasCode 
            ? <div className="px-3 py-1 w-fit border border-primary-accent rounded-full text-primary-accent">CHOSEN</div>
            : <button onClick={() => choose(row?.code)} className="px-3 py-1 bg-primary/70 text-white font-bold rounded-full tracking-widest ">CHOOSE</button>
            }
          </div>
        </div>
    </div>
  )
}

export default RegistrationListItem