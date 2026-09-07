import moment from 'moment';
import React from 'react';
import SubPageTitle from './SubPageTitle';

type Props = {
    data?: any;
}

function FMSFinanceCard({ data }: Props) {

  const sum = data?.reduce((sum:any,cur: any) => {
    //  if(['CHARGE','BILL'].includes(cur?.type)) return (cur.amount+sum);
    //  if(['PAYMENT'].includes(cur?.type)) return ((cur.amount * -1)+sum);
    return (cur.amount+sum)
  }, 0) 

  return (
    <div className="p-6 w-full space-y-3 rounded">
    {/* <h1 className="px-4 py-1 w-fit bg-slate-100/80 text-primary/80 rounded text-sm font-bold">{data && `${data[0]?.student?.fname} ${data[0]?.student?.mname ? data[0]?.student?.mname+' ':''}${data[0]?.student?.lname} - ${data[0]?.studentId}`}</h1> */}
    <SubPageTitle title={data && `${data[0]?.student?.fname} ${data[0]?.student?.mname ? data[0]?.student?.mname+' ':''}${data[0]?.student?.lname} - ${data[0]?.studentId}`} page="FINANCE STATEMENT" />
    <div className={`${data?.length ? 'shadow-md':''} w-full rounded-lg text-xs overflow-x-scroll md:overflow-hidden`}>
          { data?.length ? (
          <div className="px-3 py-2 bg-primary/10 border text-primary-dark/80 font-bold hidden md:grid gap-2 grid-cols-1 md:grid-cols-8 tracking-wider">
            <span>DATE</span>
            <span className="md:col-span-4">NARRATIVE</span>
            <span>TYPE</span>
            <span>PAYREF</span>
            <span>AMOUNT</span>
          </div>
          ): null}

          { data?.map((row:any) => (
          <div key={row.id} className="px-3 py-2 border-b grid gap-2 grid-cols-1 md:grid-cols-8 font-medium text-xs text-primary/90">
            <span className="flex flex-col space-y-1">
              <span className="px-3 py-0.5 md:hidden flex text-xs font-bold bg-slate-100/50 text-primary-dark">DATE</span>
              <span className="md:px-0 px-3">{row.createdAt && moment(row.createdAt).format('DD MMM YYYY')?.toUpperCase()}</span>
            </span>
            <span className="flex flex-col space-y-1 md:col-span-4 font-medium">
              <span className="px-3 py-0.5 md:hidden flex text-xs font-bold bg-slate-100/50 text-primary-dark">NARRATIVE</span>
              <span className="md:px-0 px-3">{row.narrative?.toUpperCase()}</span>
            </span>
            <span className="flex flex-col space-y-1">
              <span className="px-3 py-0.5 md:hidden flex text-xs font-bold bg-slate-100/50 text-primary-dark">TYPE</span>
              <span className="md:px-0 px-3">{row.type ? row.type : (row.amount > 0 ? 'CHARGE':'PAYMENT')}</span>
            </span>
            <span className="flex flex-col space-y-1">
              <span className="px-3 py-0.5 md:hidden flex text-xs font-bold bg-slate-100/50 text-primary-dark">PAYREF</span>
              <span className="md:px-0 px-3 italic underline">{ row.transactId ? row.transactId : '' }</span>
            </span>
            <span className="flex flex-col space-y-1">
              <span className="px-3 py-0.5 md:hidden flex text-xs font-bold bg-slate-100/50 text-primary-dark">AMOUNT</span>
              <span className="md:px-0 px-3 font-bold">{row.currency} {Math.abs(row.amount)}</span>
            </span>
           
          </div>
          ))}
          {/* Totals */}
          { data?.length ? (
          <div className="px-3 py-2 border-b grid md:grid-cols-8 font-bold text-sm md:text-xs text-primary-dark/90">
            <span className="md:pl-4 md:col-span-5 font-bold">NET { sum > 0 ? 'DEBT':'BALANCE'}:&nbsp;&nbsp;&nbsp;{data && data[0]?.currency} { Math.abs(sum) }</span>
            <span>&nbsp;</span>
            <span>&nbsp;</span>
            <span>&nbsp;</span>
          </div>
          ): null}
          { !data?.length ? (<div className="p-3 "><h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">No Financial Statement ...</h1></div>) : null}
          
          
    </div>
 </div>
  )
}

export default FMSFinanceCard