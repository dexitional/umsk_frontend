import React from 'react'
import ServiceListItem from './ServiceListItem';

type Props = {
  data: any;
}

function ServiceListView({ data }: Props) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-3 hidden md:grid grid-cols-8 gap-4 items-center border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <div className="col-span-2">Document</div>
          <div>Transact ID</div>
          <div>Type</div>
          <div>Quantity</div>
          <div>Status</div>
          <div>Created On</div>
          <div className="text-right">Action</div>
      </div>
      <div>
        { data && data?.map((row:any) => (<ServiceListItem key={row.id} data={row} />))}
        { !data?.length && (
          <div className="py-10 text-center text-slate-400 text-xs font-semibold uppercase tracking-widest">
            No Requests ...
          </div>
        )}
      </div>
    </div>
  )
}

export default ServiceListView
