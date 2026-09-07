import React from 'react'
import NSSListItem from './NSSListItem'

type Props = {
  data: any
}

function NSSListView({ data }: Props) {
  return (
    <div className="py-6 grid grid-cols-1 gap-y-4 border bg-slate-50/50 rounded-xl">
      <div className="px-6 pb-4 hidden md:grid grid-cols-7 place-items-center border-b border-slate-200 text-xs text-gray-500 font-sans font-semibold uppercase tracking-widest">
          <div className="col-span-2 place-self-start">Full Name</div>
          <div className="col-span-2 place-self-start">Department</div>
          <div>Contact</div>
          <div>Ezwich No</div>
          <div>Action</div>
      </div>
      <div className="grid grid-cols-1 gap-y-4 gap-x-2 text-sm text-slate-600 font-noto font-medium">
        { data && data?.map((row:any) => (<NSSListItem key={row.id} data={row} />))}
        { !data && (<h1 className="w-full text-center text-gray-400 text-[0.65rem] font-semibold tracking-widest uppercase">No Records ...</h1>)}
      </div>
    </div>
  )
}

export default NSSListView