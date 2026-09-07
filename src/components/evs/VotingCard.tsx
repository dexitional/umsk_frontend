import React from 'react'
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
    data: any;
    chosen?: Boolean;
}

function VotingCard({ data, chosen }: Props) {
  return (
    <div className="px-2 p-2 w-full h-fit border-2 border-primary/10 bg-blue-300/5 rounded flex flex-col items-start group">
        <div className="px-1 p-2 w-full h-fit border border-slate-300 rounded flex  space-x-2 items-start">
            <div className="relative h-32 w-32 md:h-36 md:w-36 rounded bg-slate-200 overflow-hidden">
                <img loading="eager" crossOrigin="anonymous" src={`${REACT_APP_API_URL}/auth/pixo?eid=${data?.portfolio?.electionId}&tag=${data?.id}`} className="transition group-hover:scale-110 rounded object-cover object-top h-32 w-32 md:h-36 md:w-36 bg-slate-200" alt="Voter" />
            </div>
            <div className="flex-1 flex flex-col space-y-1.5">
                <div>
                    <div className="my-2 px-1 py-1 w-fit shadow rounded-full border-2 border-primary/20 text-sm md:text-base text-primary/80 md:text-primary/80 bg-white font-bold md:font-bold space-x-2">
                        { !chosen 
                          ? <button className="px-2 tracking-wider rounded-full bg-amber-50 group-hover:bg-green-100 font-bold group-hover:animate-pulse">CHOOSE</button>
                          : <button className="px-2 tracking-wider rounded-full bg-green-300 font-bold">CHOSEN</button>
                        }
                    </div>
                </div>
                <span className="text-xs md:text-base text-gray-600 font-bold italic text-left">{data?.teaser || data?.tag}</span>
                <div className="w-full flex items-center justify-between">
                <span className="w-fit text-3xl text-gray-500 font-bold tracking-widest group-hover:rotate-6 transition">#{data?.orderNo}</span>
                
                {/* <button className="p-0.5 px-2 text-[0.6rem] rounded bg-green-400 text-gray-800 font-extrabold tracking-widest">VOTED</button>
                <button className="p-0.5 px-2 text-[0.6rem] rounded bg-red-200 text-gray-900 font-extrabold tracking-widest">NOT VOTED</button> */}
                </div>
            </div>
        </div>
        <div className="pt-1 px-1">
            <span className="text-[0.68rem] md:text-sm text-primary/80 md:text-gray-600 font-bold md:font-bold uppercase">{data?.name}</span>
        </div>
    </div>
  )
}

export default VotingCard