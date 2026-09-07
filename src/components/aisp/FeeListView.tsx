import React from 'react';
import FeeListItem from './FeeListItem';

type Props = {
  data: any;
}

function FeeListView({ data }: Props) {

  const sum = data?.reduce((sum:any,cur: any) => cur.amount+sum, 0);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-3 hidden md:grid grid-cols-6 gap-4 items-center border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <div className="col-span-2">Narrative</div>
          <div>Amount</div>
          <div>Type</div>
          <div>Reference</div>
          <div>Date</div>
      </div>
      <div>
        { data && data?.map((row:any) => (<FeeListItem key={row.id} data={row} />))}
        { !data?.length && (
          <div className="py-10 text-center text-slate-400 text-xs font-semibold uppercase tracking-widest">
            No Record ...
          </div>
        )}
      </div>
      { data?.length ? (
      <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-slate-50/50">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            NET {sum > 0 ? 'DEBT' : 'BALANCE'}
          </span>
          <span className={`text-base font-bold ${sum > 0 ? 'text-red-500' : 'text-primary'}`}>
            {data && data[0]?.currency} {Math.abs(sum)}
          </span>
      </div>
      ): null }

    </div>
  )
}

export default FeeListView
