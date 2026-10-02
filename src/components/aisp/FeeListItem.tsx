import React from 'react'
import { HiOutlineArrowDownLeft, HiOutlineArrowUpRight } from 'react-icons/hi2'
// @ts-ignore
import ListHeading from './ListHeading';
import moment from 'moment';

type Props = {
    data: any;
}

function FeeListItem({ data }: Props) {
  const isPayment = data.type == 'PAYMENT' || (!data.type && data.amount <= 0);
  const Icon = isPayment ? HiOutlineArrowDownLeft : HiOutlineArrowUpRight;
  return (
    <div className="aisp-row md:grid-cols-6">
        <div className="md:col-span-2 flex flex-col gap-1.5">
           <ListHeading title="Narrative"/>
           <div className="flex items-center gap-3 min-w-0">
            <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ring-1 ring-inset ${isPayment ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' : 'bg-indigo-50 text-indigo-600 ring-indigo-100'}`}>
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-slate-800 truncate">{data?.narrative?.toUpperCase()}</span>
           </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <ListHeading title="Amount"/>
          <span className={`text-sm font-bold tabular-nums ${isPayment ? 'text-emerald-600' : 'text-slate-900'}`}>
            {data?.currency} {Math.abs(data?.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <ListHeading title="Type"/>
          <span className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.68rem] font-bold tracking-wide ring-1 ring-inset ${isPayment ? 'bg-emerald-50 text-emerald-700 ring-emerald-100' : 'bg-indigo-50 text-indigo-700 ring-indigo-100'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isPayment ? 'bg-emerald-500' : 'bg-indigo-500'}`} />
            {data.type ? data.type : (data.amount > 0 ? 'CHARGE':'PAYMENT')}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <ListHeading title="Reference"/>
          <span className="text-xs font-mono text-slate-500 truncate">{data?.transaction ? data?.transaction.transtag : 'ACADEMIC-DEBT'}</span>
        </div>
        <div className="flex flex-col gap-1.5">
          <ListHeading title="Date" />
          <span className="text-sm text-slate-500">{data?.createdAt && moment(data?.createdAt).format('MMM DD, YYYY')}</span>
        </div>
    </div>
  )
}

export default FeeListItem
