import React from 'react'
import ApplicantListItem from './ApplicantListItem'

type Props = {
  data: any
}

function ApplicantListView({ data }: Props) {
  return (
    <div className="py-6 grid grid-cols-1 gap-y-4 border bg-slate-50/50 rounded-xl">
      <div className="px-6 pb-4 hidden md:grid grid-cols-8 gap-y-4 md:gap-y-0 md:gap-x-4 place-items-center border-b border-slate-200 text-xs text-primary-dark/80 font-roboto font-medium uppercase tracking-widest">
          <div className="col-span-2 place-self-start">Applicant Name</div>
          <div>Applicant ID</div>
          <div className="col-span-2 place-self-start">Main Choice</div>
          <div className="place-self-start">Apply Mode</div>
          <div>Status</div>
          <div>Action</div>
      </div>
      <div className="grid grid-cols-1 gap-y-4 text-sm text-slate-600  font-noto font-medium">
          { data && data?.map((row:any) => (<ApplicantListItem key={row.id} data={row} />))}
          { !data && (<h1 className="w-full text-center text-gray-400 text-[0.65rem] font-semibold tracking-widest uppercase">No Records ...</h1>)}
      </div>
    </div>
  )
}

export default ApplicantListView