import React from 'react'
import No from '../../assets/img/no.png'

const { REACT_APP_API_URL } = import.meta.env;

type Props = {
    data: any;
    showResult?: Boolean;
    winner?: Boolean;
    vtotal: number;

}

function CandidateCardNo({ data, showResult, winner, vtotal }: Props) {
  return (
    <div className="px-2 p-2 w-full h-fit border-2 border-blue-950/10 bg-blue-300/5 rounded flex flex-col items-start">
        <div className="px-1 p-2 w-full h-fit border border-slate-300 rounded flex  space-x-2 items-start">
            <div className="relative h-32 w-32 md:h-36 md:w-36 rounded bg-slate-200">
                <img loading="eager" src={No} className="rounded object-cover object-top h-32 w-32 md:h-36 md:w-36 bg-slate-200" alt="Voter" />
            </div>
            <div className="flex-1 flex flex-col space-y-1.5">
                <div className={ showResult ? `block`: `hidden`}>
                    <div className="my-2 px-1 py-1 rounded border-2 border-blue-950/20 text-sm md:text-base text-blue-950/80 md:text-blue-950/80 bg-white font-bold md:font-bold space-x-2">
                        <span className="px-0.5 tracking-wider font-bold">{data?.votes}</span>
                        <span className="p-0.5 px-1.5 text-sm md:text-base italic rounded border bg-red-100 tracking-wide">{ !isNaN(data?.votes/vtotal * 100) ? (data?.votes/vtotal * 100).toFixed(1) : 0 }%</span>
                    </div>
                    { winner && <span className="px-2 w-fit rounded bg-green-600 text-xs md:text-sm text-white font-bold italic tracking-widest animate-ping">WINNER</span>}
                </div>
                <div className="w-full flex items-center justify-between">
                
                {/* <button className="p-0.5 px-2 text-[0.6rem] rounded bg-green-400 text-gray-800 font-extrabold tracking-widest">VOTED</button>
                <button className="p-0.5 px-2 text-[0.6rem] rounded bg-red-200 text-gray-900 font-extrabold tracking-widest">NOT VOTED</button> */}
                </div>
            </div>
        </div>
        <div className="pt-1 px-1">
            <span className="text-[0.68rem] md:text-sm text-primary/80 md:text-gray-600 font-bold md:font-bold uppercase">SKIPPED / (NO) VOTES</span>
        </div>
    </div>
  )
}

export default CandidateCardNo