import React from 'react'
import { FaUsersBetweenLines } from 'react-icons/fa6';
type Props = {
   title: string;
   desc: string;
   tag?:string;
   Icon?: any;
   onClick?: any;
}

function ControlActionCard({ title,desc,Icon = FaUsersBetweenLines,tag,onClick }: Props) {

  return (
    <button onClick={onClick} className=" cursor-pointer overflow-hidden relative px-3 p-2 w-full h-fit border border-slate-300 rounded flex space-x-3 items-start">
      <div className="relative h-10 w-8 md:h-10 md:w-10 rounded-full bg-primary-accent/80 flex items-center justify-center">
          {/* <img src={`https://ehub.ucc.edu.gh/api/photos/?tag=15664`} className="rounded object-cover object-top h-10 w-10 md:h-14 md:w-14 bg-slate-200" alt="Voter" /> */}
          <Icon className="h-6 w-6 rounded-full focus:outline-none focus:ring-0  checked:bg-primary/80 text-white" />
      </div>
      <div className="flex-1 flex flex-col items-start justify-start">
          <span className="text-[0.68rem] md:text-[0.87rem] text-primary/80 md:text-primary/80 font-bold md:font-bold">{title}</span>
          <span className="text-xs md:text-sm text-gray-600 font-medium italic">{desc}</span>
      </div>
      <div className={`px-2 py-1 absolute -right-5 top-4 rotate-90  bg-primary/80 text-white text-[0.6rem] tracking-widest font-bold`}>{tag}</div>
    </button>
  )
}

export default ControlActionCard