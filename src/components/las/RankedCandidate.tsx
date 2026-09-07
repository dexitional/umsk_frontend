import React from 'react'
import { IconType } from 'react-icons'
import { TbCircleNumber1,TbCircleNumber2,TbCircleNumber3 } from "react-icons/tb";

type Props = {
    count: number;
    data: any;
    total: number;
}

function RankedCandidate({ count, data, total }: Props) {
   console.log(data)
  const LoadIcon = () => {
       if(count == 1) return <TbCircleNumber1 className="h-10 w-10 text-[#01A4A6]" />;
       if(count == 2) return <TbCircleNumber2 className="h-10 w-10 text-[#01A4A6]" />;
       if(count == 3) return <TbCircleNumber3 className="h-10 w-10 text-[#01A4A6]" />;
  }

  return (
    <button className="relative px-3 py-7 h-fit border shadow  border-[#ccc] rounded-xl flex flex-col items-center space-y-6 text-center group">
        <div className="w-28 h-28 bg-[#d4dbe0] rounded-full overflow-hidden shadow">
            <img className="w-28 h-28 object-cover object-top" src={`https://cdn.ucc.edu.gh/photos/?tag=${data?.vote}`} loading="lazy" />
        </div>
        <div className="w-fit absolute -top-4 right-2">
            {/* <Icon className="h-10 w-10 text-[#01A4A6]" /> */}
            { LoadIcon() }
        </div>
        <h1 className="text-zinc-500 leading-5 font-medium text-sm capitalize line-clamp-2">{data?.fname} {data?.lname}</h1>
        <p className="leading-5 text-sm text-blue-950/60 font-medium capitalize line-clamp-2">{data?.department}</p>
        <p className="px-3 py-0.5 rounded-md border bg-blue-200/20 leading-5 text-sm text-blue-950/60 font-semibold line-clamp-2 italic">{data.votes} votes - {(data.votes/total * 100).toFixed(1)}%</p>
    </button>
  )
}

export default RankedCandidate