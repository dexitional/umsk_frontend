import moment from 'moment';
import React from 'react'

type Props = {
    data?: any;
}

function AISFinanceCard({ data }: Props) {

  const sum = data?.reduce((sum:any,cur: any) => {
    //  if(['CHARGE','BILL'].includes(cur?.type)) return (cur.amount+sum);
    //  if(['PAYMENT'].includes(cur?.type)) return ((cur.amount * -1)+sum);
    return (cur.amount+sum)
  }, 0) 

  return (
    <div className="w-full space-y-3 rounded">
    <div className={`${data.length ? 'shadow-md':''} w-full rounded-lg text-xs overflow-x-scroll md:overflow-hidden`}>
          { data.length ? (
          <div className="px-3 py-2 bg-primary/20 text-primary-dark/80 font-bold grid grid-cols-7 tracking-wider">
            <span>DATE</span>
            <span className="col-span-4">NARRATIVE</span>
            <span>TYPE</span>
            <span>AMOUNT</span>
          </div>
          ): null}

          { data.map((row:any) => (
          <div key={row.id} className="px-3 py-2 border-b grid grid-cols-7 font-medium text-xs text-primary/90">
            <span>{row.createdAt && moment(row.createdAt).format('DD MMM YYYY')?.toUpperCase()}</span>
            <span className="col-span-4 font-medium">{row.narrative?.toUpperCase()}</span>
            <span>{row.type}</span>
            <span className="font-bold">{row.currency} {Math.abs(row.amount)}</span>
          </div>
          ))}
          {/* Totals */}
          { data.length ? (
          <div className="px-3 py-2 border-b grid grid-cols-8 font-bold text-xs text-primary-accent/90">
            <span>&nbsp;</span>
            <span className="col-span-4 font-bold">NET { sum > 0 ? 'DEBT':'BALANCE'}:&nbsp;&nbsp;&nbsp;{data && data[0]?.currency} { Math.abs(sum) }</span>
            <span>&nbsp;</span>
            <span>&nbsp;</span>
            <span>&nbsp;</span>
          </div>
          ): null}
          { !data.length ? (<div className="p-3 "><h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">No Financial Statement ...</h1></div>) : null}
          
          
    </div>
 </div>
  )
}

export default AISFinanceCard