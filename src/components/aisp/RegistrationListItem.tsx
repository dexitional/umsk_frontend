import React from 'react'
import { HiCheck, HiOutlineLockClosed, HiOutlinePlus } from 'react-icons/hi2';
import ListHeading from './ListHeading';
import { useUserStore } from '../../utils/authService';
import toast from 'react-hot-toast';

type Props = {
    row: any;
}

const TYPE_STYLES: Record<string, { label: string; style: string }> = {
  C: { label: 'Compulsory', style: 'bg-indigo-50 text-indigo-700 ring-indigo-100' },
  E: { label: 'Elective', style: 'bg-sky-50 text-sky-700 ring-sky-100' },
  R: { label: 'Resit', style: 'bg-amber-50 text-amber-700 ring-amber-200' },
};

function RegistrationListItem({ row }: Props) {

  const courses  = useUserStore(state => state.courses)
  // Compulsory and locked electives are pre-selected and can't be dropped.
  const locked = row.type == 'C' || (row.type == 'E' && row.lock);
  const hasCode = courses.find((course:any) => course == row.code)

  const choose = (code) => {
    if (hasCode && locked) return;
    toast.success(hasCode ? `${code} Removed` : `${code} Selected!`)
    let newcourses = [ ...courses ];
    newcourses = hasCode ? [...newcourses.filter((course:any) => course != code)] : [...newcourses,code]
    useUserStore.setState({ courses: newcourses })
  }

  const type = TYPE_STYLES[row.type] || { label: 'Optional', style: 'bg-slate-100 text-slate-600 ring-slate-200' };

  return (
    <div className={`aisp-row grid-cols-2 md:grid-cols-6 ${hasCode ? 'bg-sky-50/40' : ''}`}>
        <div className="flex flex-col gap-1">
          <ListHeading title="Code"/>
          <span className="text-xs font-mono font-semibold text-sky-700">{row?.code}</span>
        </div>

        <div className="col-span-2 order-first md:order-none flex flex-col gap-1">
           <ListHeading title="Course"/>
           <span className="text-sm font-semibold text-slate-800">{row?.course}</span>
        </div>
        <div className="flex flex-col gap-1">
          <ListHeading title="Credit"/>
          <span className="text-sm text-slate-500 tabular-nums">{row?.credit}</span>
        </div>
        <div className="flex flex-col gap-1">
          <ListHeading title="Type"/>
          <span className={`inline-flex w-fit items-center px-2.5 py-1 rounded-full text-[0.68rem] font-bold uppercase tracking-wide ring-1 ring-inset ${type.style}`}>{type.label}</span>
        </div>
        <div className="flex flex-col gap-1 justify-end md:items-end">
          { hasCode
          ? (
            <button
              onClick={() => choose(row?.code)}
              disabled={locked}
              title={locked ? 'Required course' : 'Remove course'}
              className="h-9 px-3.5 w-fit inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition hover:brightness-110 disabled:hover:brightness-100 disabled:cursor-default"
            >
              {locked ? <HiOutlineLockClosed className="h-3.5 w-3.5" /> : <HiCheck className="h-3.5 w-3.5" />}
              {locked ? 'Required' : 'Chosen'}
            </button>
          )
          : (
            <button
              onClick={() => choose(row?.code)}
              className="h-9 px-3.5 w-fit inline-flex items-center gap-1.5 rounded-full bg-white text-primary text-xs font-bold ring-1 ring-inset ring-slate-200 hover:ring-sky-300 hover:bg-sky-50 transition"
            >
              <HiOutlinePlus className="h-3.5 w-3.5" />
              Choose
            </button>
          )
          }
        </div>
    </div>
  )
}

export default RegistrationListItem
