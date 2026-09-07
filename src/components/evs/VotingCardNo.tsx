import React from 'react'
import No from '../../assets/img/no.png'
const { REACT_APP_API_URL } = import.meta.env;


type Props = {
    data: any;
    chosen?: Boolean;
}

function VotingCardNo({ data, chosen }: Props) {
  return (
    <div className="px-2 p-2 w-full h-fit border-2 border-primary/10 bg-primary/5 rounded flex flex-col items-start">
        <div className="px-3 p-2 w-full h-fit border border-slate-300 rounded flex  space-x-2 items-start">
            <div className="relative h-32 w-32 md:h-36 md:w-36 rounded ">
                <img loading="eager" crossOrigin="anonymous" src={No} className="rounded-full object-cover object-top h-32 w-32 md:h-36 md:w-36 animate-pulse" alt="No/Skip" />
            </div>
            <div className="flex-1 flex flex-col space-y-1.5">
                <div>
                    <div className="my-2 px-1 py-1 w-fit shadow rounded-full border-2 border-primary/20 text-sm md:text-base text-primary/80 md:text-primary/80 bg-white font-bold md:font-bold space-x-2">
                        { !chosen 
                          ? <button className="px-2 tracking-wider rounded-full bg-amber-50 font-bold">CHOOSE</button>
                          : <button className="px-2 tracking-wider rounded-full bg-green-300 font-bold">CHOSEN</button>
                        }
                    </div>
                </div>
                
            </div>
        </div>
        <div className="pt-1 px-1">
            <h3 className="text-[0.68rem] md:text-sm text-red-600 md:text-red-600 font-extrabold md:font-bold uppercase">NO</h3>
        </div>
    </div>
  )
}

export default VotingCardNo