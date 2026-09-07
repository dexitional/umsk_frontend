import React from 'react'

type Props = {
  data: any;
  total: number;
}

function LASWinner({ data, total }: Props) {

  return (
    <div className="relative px-3 py-6 border shadow  border-[#01A4A6] rounded-xl flex flex-col items-center justify-center space-y-6 text-center group">
        <div className="relative w-52 h-52 bg-[#d4dbe0] rounded-xl overflow-hidden">
          <img className="w-52 h-52 object-cover object-top" src={`https://cdn.ucc.edu.gh/photos/?tag=${data?.vote}`} />
        </div>
        {/* <div className="w-fit absolute -top-4 right-2">
            <FaCheckCircle className="h-7 w-7 text-green-700/60" />
        </div> */}
        <div className="space-y-1">
            <h1 className="text-zinc-500 leading-5 text-base capitalize">{data?.fname?.toLowerCase()} {data?.lname?.toLowerCase()}</h1>
            <p className="leading-5 text-sm text-blue-950/60 font-medium capitalize">{data?.department?.toLowerCase()}</p>
        </div>
        <div className="space-y-2">
          <div className="px-4 py-1 bg-[#01A4A6] text-white border shadow-lg rounded-md font-semibold tracking-wider">Top Sopt</div>
          { total ? 
          <div className="px-4 py-1 bg-blue-950/60 text-sm text-white border shadow-lg rounded-lg font-medium tracking-wider flex items-center justify-center space-x-1">
              <span>{data?.votes}</span>
              <span> - </span>
              <span>{(data.votes/total * 100).toFixed(1)}%</span>
          </div>
          : null }
        </div>
        
    </div>
  )
}

export default LASWinner