import React from 'react'
import NoticeListItem from './NoticeListItem';

type Props = {
  data: any;
}

function NoticeListView({ data }: Props) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-3 hidden md:grid grid-cols-7 gap-4 items-center border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <div className="col-span-4">Title</div>
          <div>Reference</div>
          <div>Date</div>
          <div className="text-right">Action</div>
      </div>
      <div>
        { data && data?.map((row:any) => (<NoticeListItem key={row.id} data={row} />))}
        { !data?.length && (
          <div className="py-10 text-center text-slate-400 text-xs font-semibold uppercase tracking-widest">
            No Messages ...
          </div>
        )}
      </div>
    </div>
  )
}

export default NoticeListView
