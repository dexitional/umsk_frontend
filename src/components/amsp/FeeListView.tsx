import React from 'react'
import FeeListItem from './FeeListItem';

type Props = { 
  data: any;
}

function FeeListView({ data }: Props) {
   
  const sum = data?.reduce((sum:any,cur: any) => {
    if(['CHARGE','BILL'].includes(cur?.type)) return (cur.amount+sum);
    if(['PAYMENT'].includes(cur?.type)) return ((cur.amount * -1)+sum);
  }, 0) 

  return (
    <div className="py-6 grid grid-cols-1 gap-y-4 border bg-slate-50/50 rounded-xl">
      <div className="px-6 pb-4  hidden md:grid grid-cols-6 place-items-center   border-b border-slate-200 text-xs text-primary font-sans font-semibold uppercase tracking-widest">
          <div className="col-span-2 place-self-start">Narrative</div>
          <div>Amount</div>
          <div>Type</div>
          <div>Reference</div>
          <div>Date</div>
      </div>
      <div className="grid grid-cols-1 text-[0.75rem] text-slate-600 font-roboto font-medium tracking-wider">
        { data && data?.map((row:any) => (<FeeListItem key={row.id} data={row} />))}
        { !data.length && (<h1 className="w-full text-center text-gray-400 text-[0.65rem] font-semibold tracking-widest uppercase">No Record ...</h1>)}
      </div>
      { data.length ? (
      <div className={`${sum > 0 ? 'text-primary-accent/70' : 'text-primary/70'} px-6 pb-4 md:grid grid-cols-6 place-items-center border-slate-200 text-xs font-sans font-semibold uppercase tracking-widest`}>
          <div className="place-self-start">&nbsp;</div>
          <div className="col-span-5 place-self-start flex items-center justify-between"><span>NET NET { sum > 0 ? 'DEBT':'BALANCE'}:</span>&nbsp;&nbsp;&nbsp;<span>{data && data[0]?.currency} { Math.abs(sum) }</span></div>
      </div>
      ): null }
        
    </div>
  )
}

export default FeeListView