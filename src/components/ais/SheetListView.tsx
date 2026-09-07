import React from 'react'
import SheetListItem from './SheetListItem'

type Props = {
  data: any
}

function SheetListView({ data }: Props) {
  return (
    <div className="py-6 grid grid-cols-1 gap-y-4 border bg-slate-50/50 rounded-xl">
      <div className="px-6 pb-4 hidden md:grid grid-cols-7 place-items-center border-b border-slate-200 text-xs text-primary-dark/80 font-sans font-semibold uppercase tracking-widest">
          <div className="col-span-2 place-self-start">Program</div>
          <div className="col-span-2 place-self-start">Course</div>
          <div className="col-span-2 place-self-start">Session</div>
          <div>Action</div>
      </div>
      <div className="grid grid-cols-1 gap-y-4 text-xs text-slate-600 font-noto font-medium">
          { data && data?.map((row:any) => (<SheetListItem key={row.id} data={row} />))}
          { !data && (<h1 className="w-full text-center text-gray-400 text-[0.65rem] font-semibold tracking-widest uppercase">No Records ...</h1>)}
      </div>
    </div>
  )
}

export default SheetListView