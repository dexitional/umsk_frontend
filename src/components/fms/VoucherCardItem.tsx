import React from 'react';
import { MdOutlineDateRange } from 'react-icons/md';
// @ts-ignore
import moment from 'moment';
import { BiHash, BiPhone } from 'react-icons/bi';

const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
}

function VoucherCardItem({ data }: Props) {
  console.log(data)
  return (
  <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-2 md:group">
    <h2 className="text-base md:text-base font-semibold font-noto text-gray-500 uppercase">{data?.transtag}</h2>
    <div className="w-full flex items-center justify-between space-x-2">
      <div className="w-full flex items-center justify-between space-x-2">
          <div className="text-sm md:text-sm text-primary-dark/70 font-bold font-roboto capitalize">{ data?.activityFinanceVoucher[0]?.buyerName?.toUpperCase() }</div>
          {/* <div className="py-0.5 px-2 text-sm rounded bg-primary/60 text-white font-bold">{data?.activityFinanceVoucher?.buyerPhone}</div> */}
      </div>
   </div>
   <div className="space-y-2 font-roboto">
        <div className="mb-4 px-4 py-1 w-fit flex items-center space-x-4 rounded bg-primary-dark/10">
            <span className={`text-gray-500 text-sm  font-bold capitalize`}>{data.transtype?.title  }</span>
        </div>
        <div className="flex items-center space-x-4">
            <BiHash className="h-4 w-5 text-primary/70" />
            <span className="text-xs text-gray-500 font-semibold tracking-wide">SERIAL NUMBER:&nbsp;&nbsp; {data?.activityFinanceVoucher[0]?.serial || 'NOT ASSIGNED'}</span>
        </div>
        <div className="flex items-center space-x-4">
            <BiPhone className="h-4 w-5 text-primary/70" />
            <span className="text-xs text-gray-500 font-semibold tracking-wide">BUYER PHONE:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {data?.activityFinanceVoucher[0]?.buyerPhone || 'NOT ASSIGNED'}</span>
        </div>
        <div className="mt-10 flex items-center space-x-4">
            <MdOutlineDateRange className="h-4 w-5 text-primary/70" />
            <div className={`bg-green-50 px-2 py-0.5 rounded border text-xs font-semibold text-gray-500`}>{ data?.createdAt && moment(data?.createdAt).format("DD-MMM-YYYY h:mm a").toUpperCase() }</div>
        </div>
    </div>
    <div className="flex flex-col space-y-1">
        
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center md:justify-start space-x-2 group">
          {/* <Link to={`${encodeURIComponent(data?.id)}/profile`} className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60">
            <BiRefresh className="h-4 w-4 text-amber-200"/>
            <span className="text-sm text-white font-semibold">Retire</span>
          </Link>
          <Form method="post" action={`${data?.id}/destroy`} onSubmit={(e)=> { if(!confirm("Charge Late Registration Fine?")) e.preventDefault(); return false; }} className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60">
            <BsLightningChargeFill className="h-3 w-4 text-red-100" />
            <button type="submit" className="text-sm text-white font-semibold">Fine</button>
          </Form> */}
          <div className="flex items-center justify-center space-x-3 text-center">
              <span className={`bg-green-800/70 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}>AMOUNT</span>
              <span className="font-semibold font-roboto text-base text-primary/60">{ data?.currency == 'GHC' ? 'GH₵': data?.currency } { data?.amount }</span>
          </div>
        </div>
    </div>
    
  </div>
  )
}

export default VoucherCardItem