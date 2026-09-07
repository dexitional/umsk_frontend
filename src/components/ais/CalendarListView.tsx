import React from 'react'
import CalendarListItem from './CalendarListItem'

type Props = {
  data: any
}

function CalendarListView({ data }: Props) {
  return (
    <div className="py-6 grid grid-cols-1 gap-y-4 border bg-slate-50/50 rounded-xl">
      <div className="px-6 pb-4 hidden md:grid grid-cols-6 place-items-center border-b border-slate-200 text-xs text-primary-dark/80 font-sans font-semibold uppercase tracking-widest">
          <div className="col-span-2 place-self-start">Session Name</div>
          <div>Tag</div>
          <div>Semester</div>
          <div>Academic Year</div>
          <div>Action</div>
      </div>
      <div className="grid grid-cols-1 gap-y-4 text-xs text-slate-600 font-noto font-medium">
          { data && data?.map((row:any) => (<CalendarListItem key={row.id} data={row} />))}
          { !data && (<h1 className="w-full text-center text-gray-400 text-[0.65rem] font-semibold tracking-widest uppercase">No Records ...</h1>)}
      </div>
    </div>
  )
}

export default CalendarListView