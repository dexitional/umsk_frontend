import React from 'react'
import SessionListItem from './SessionListItem'
import VoucherListItem from './VoucherListItem'

type Props = {
  data: any
}

function VoucherListView({ data }: Props) {
  return (
    <div className="py-6 grid grid-cols-1 gap-y-4 border bg-slate-50/50 rounded-xl">
      <div className="px-6 pb-4 hidden md:grid grid-cols-7 place-items-center border-b border-slate-200 text-xs text-primary-dark/80 font-sans font-semibold uppercase tracking-widest">
          <div className="place-self-start">Serial</div>
          <div className="place-self-start">Pin</div>
          <div>Sold</div>
          <div className="col-span-2 place-self-start">Buyer Name</div>
          <div>Buyer Phone</div>
          <div>Action</div>
      </div>
      <div className="grid grid-cols-1 gap-y-4 text-sm text-slate-600 font-noto font-medium">
          { data && data?.map((row:any) => (<VoucherListItem key={row.id} data={row} />))}
          { !data && (<h1 className="w-full text-center text-gray-400 text-[0.65rem] font-semibold tracking-widest uppercase">No Records ...</h1>)}
      </div>
    </div>
  )
}

export default VoucherListView