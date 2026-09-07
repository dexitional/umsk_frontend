import React from 'react'
import FunderListItem from './FunderListItem'
import ProjectListItem from './ProjectListItem'

type Props = {
  data: any
}

function ProjectListView({ data }: Props) {
  return (
    <div className="py-6 grid grid-cols-1 gap-y-4 border bg-slate-50/50 rounded-xl">
      <div className="px-6 pb-4 hidden md:grid grid-cols-6 place-items-center border-b border-slate-200 text-xs text-gray-500 font-sans font-semibold uppercase tracking-widest">
          <div className="col-span-2 place-self-start">Project</div>
          <div>Type</div>
          <div>Phases</div>
          <div>Estimated Cost</div>
          <div>Action</div>
      </div>
      <div className="grid grid-cols-1 gap-y-4 text-sm text-slate-600 font-noto font-medium">
          { data && data?.map((row:any) => (<ProjectListItem key={row.id} data={row} />))}
          { !data && (<h1 className="w-full text-center text-gray-400 text-[0.65rem] font-semibold tracking-widest uppercase">No Records ...</h1>)}
      </div>
    </div>
  )
}

export default ProjectListView