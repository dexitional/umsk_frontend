import React from 'react'
import { MdOutlinePayments } from 'react-icons/md'
// @ts-ignore
import ListHeading from './ListHeading';
import moment from 'moment';

type Props = {
    data: any;
}

function FeeListItem({ data }: Props) {
  const isPayment = data.type == 'PAYMENT';
  return (
    <div className="px-4 md:px-6 py-4 grid md:grid-cols-6 gap-3 md:gap-4 md:items-center border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors">
        <div className="md:col-span-2 flex flex-col space-y-1.5">
           <ListHeading title="Narrative"/>
           <div className="flex items-center space-x-3 min-w-0">
            <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center ${isPayment ? 'bg-primary/10' : 'bg-secondary-accent/10'}`}>
              <MdOutlinePayments className={`h-4 w-4 ${isPayment ? 'text-primary' : 'text-secondary-accent'}`} />
            </div>
            <span className="text-sm font-medium text-primary truncate">{data?.narrative?.toUpperCase()}</span>
           </div>
        </div>
        <div className="flex flex-col space-y-1.5">
          <ListHeading title="Amount"/>
          <span className="text-sm font-semibold text-primary">{data?.currency} {Math.abs(data?.amount)}</span>
        </div>
        <div className="flex flex-col space-y-1.5">
          <ListHeading title="Type"/>
          <span className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isPayment ? 'bg-primary/10 text-primary' : 'bg-secondary-accent/10 text-secondary-accent'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isPayment ? 'bg-primary' : 'bg-secondary-accent'}`} />
            {data.type ? data.type : (data.amount > 0 ? 'CHARGE':'PAYMENT')}
          </span>
        </div>
        <div className="flex flex-col space-y-1.5">
          <ListHeading title="Reference"/>
          <span className="text-sm text-slate-500 capitalize">{data?.transaction ? data?.transaction.transtag : 'ACADEMIC-DEBT'}</span>
        </div>
        <div className="flex flex-col space-y-1.5">
          <ListHeading title="Date" />
          <span className="text-sm text-slate-500">{data?.createdAt && moment(data?.createdAt).format('MMM DD, YYYY')?.toUpperCase()}</span>
        </div>
    </div>
  )
}

export default FeeListItem
