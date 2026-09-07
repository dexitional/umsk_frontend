import React from 'react'
const { REACT_APP_API_URL } = import.meta.env;
type Props = {
  data: any;
  vmask: Boolean;
  isAdmin: Boolean;
}

function VoterCard({ data, vmask, isAdmin }: Props) {
  
  return (
    <div className={`px-3 p-2 w-full h-fit border ${data.voteStatus && vmask  ? 'border-green-600':'border-slate-300'}  rounded flex space-x-3 items-start`}>
        <div className="relative h-10 w-10 md:h-14 md:w-14 rounded bg-slate-200">
            <img loading="eager" crossOrigin="anonymous" src={`${REACT_APP_API_URL}/auth/photos?tag=${data?.tag}`} className="rounded object-cover object-top h-10 w-10 md:h-14 md:w-14 bg-slate-200" alt="Voter" />
        </div>
        <div className="flex-1 flex flex-col items-start justify-start">
            <span className="text-[0.68rem] md:text-[0.87rem] text-primary/90 md:text-primary/90 font-bold md:font-bold uppercase">{data?.name}</span>
            { isAdmin ? <span className="text-xs md:text-sm text-gray-500 font-medium italic">{data?.username} {data?.pin && `| ${data?.pin}`}</span> : null }
            { isAdmin && data?.phone ? <span className="text-xs md:text-sm text-gray-500 font-medium italic">Phone: {data?.phone}</span> : null }
            <div className="w-full flex items-center justify-between">
              <span className="w-fit text-xs text-gray-500 font-bold tracking-widest">VOTER ID: {data?.tag}</span>
              { data.voteStatus && vmask  ? <button className="p-0.5 px-2 text-[0.6rem] rounded bg-green-400 text-gray-800 font-extrabold tracking-widest">VOTED</button> : null }
              {/* <button className="p-0.5 px-2 text-[0.6rem] rounded bg-red-200 text-gray-900 font-extrabold tracking-widest">NOT VOTED</button> */}
            </div>
            
        </div>
    </div>
  )
}

export default VoterCard