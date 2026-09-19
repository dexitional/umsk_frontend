import React from 'react'
import RefundListItem from './RefundListItem'

type Props = {
  data: any
}

// Note: unlike ChargeListView (which passes the whole {totalPages,
// totalData, data} response object straight through and tries to .map()
// it, and whose ChargeListItem renders unrelated student-profile fields
// that don't exist on a charge row), this reads data?.data -- the actual
// array -- and RefundListItem renders the refund record itself.
function RefundListView({ data }: Props) {
  return (
    <div className="py-6 grid grid-cols-1 gap-y-4 border bg-slate-50/50 rounded-xl">
      <div className="px-6 pb-4 hidden md:grid grid-cols-7 place-items-center border-b border-slate-200 text-xs text-primary-dark/80 font-roboto font-medium uppercase tracking-widest">
          <div className="col-span-2 place-self-start">Student</div>
          <div>Type</div>
          <div>Narrative</div>
          <div>Amount</div>
          <div>Date</div>
          <div>Action</div>
      </div>
      <div className="grid grid-cols-1 gap-y-4 text-xs text-slate-600 font-medium">
          { data?.data && data?.data?.map((row:any) => (<RefundListItem key={row.id} data={row} />))}
          { !data?.data?.length && (<h1 className="w-full text-center text-gray-400 text-[0.65rem] font-semibold tracking-widest uppercase">No Records ...</h1>)}
      </div>
    </div>
  )
}

export default RefundListView
