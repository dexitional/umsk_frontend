import React from 'react';
import { HiOutlineReceiptPercent } from 'react-icons/hi2';
import AISPEmpty from './AISPEmpty';
import AISPPanel from './AISPPanel';
import FeeListItem from './FeeListItem';

type Props = {
  data: any;
}

function FeeListView({ data }: Props) {

  const sum = data?.reduce((sum:any,cur: any) => cur.amount+sum, 0);

  return (
    <AISPPanel
      title="Statement of Account"
      subtitle={`${data?.length || 0} transaction${data?.length == 1 ? '' : 's'}`}
      Icon={HiOutlineReceiptPercent}
      bodyClassName="pt-5"
    >
      <div className="aisp-thead grid-cols-6">
          <div className="col-span-2">Narrative</div>
          <div>Amount</div>
          <div>Type</div>
          <div>Reference</div>
          <div>Date</div>
      </div>
      <div>
        { data && data?.map((row:any) => (<FeeListItem key={row.id} data={row} />))}
        { !data?.length && (
          <AISPEmpty title="No transactions yet" message="Bills and payments posted to your account will appear here." Icon={HiOutlineReceiptPercent} />
        )}
      </div>
      { data?.length ? (
      <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Net {sum > 0 ? 'Debt' : 'Balance'}
          </span>
          <span className={`text-lg font-extrabold tracking-tight ${sum > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {data && data[0]?.currency} {Math.abs(sum).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
      </div>
      ): null }
    </AISPPanel>
  )
}

export default FeeListView
