import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { useUserStore } from '../../utils/authService'
import toast from 'react-hot-toast';

type Props = {
    data: any;
}

function LASCandidate({ data }: Props) {
   
   const lasChoose = useUserStore(state => state.lasChoose);
   const lasChosen = useUserStore(state => state.lasChosen);
   const user = useUserStore(state => state.user);

   const choose = (data) => {
     if(!lasChosen?.voted) {
        lasChoose({...data, regno: user?.user?.tag, voted: 0 });
        toast.success(`${data.name.toLowerCase()} is selected !`)
     } else {
        toast.error(`You have already voted !`)
     }
   }

  return (
    <button onClick={() => data.staff_no ? choose(data): null } className="relative px-3 py-7 h-fit border shadow  border-[#ccc] rounded-xl flex flex-col items-center space-y-6 text-center group">
          <div className="w-28 h-28 bg-[#d4dbe0] rounded-full overflow-hidden shadow">
            <img className="w-28 h-28 object-cover object-top" src={`https://cdn.ucc.edu.gh/photos/?tag=${data?.staff_no}`} loading="lazy" />
           </div>
        { lasChosen?.staff_no == data?.staff_no 
         ? <div className="w-fit absolute -top-4 right-2">
            <FaCheckCircle className="h-7 w-7 text-[#01A4A6]" />
           </div>
         : <div className="hidden group-hover:flex w-fit absolute -top-4 right-2">
            <FaCheckCircle className="h-7 w-7 text-blue-950/20" />
           </div>
         }
        <h1 className="text-zinc-500 leading-5 text-base capitalize">{data?.name.toLowerCase()}</h1>
        <p className="leading-5 text-sm text-blue-950/60 font-medium capitalize">{data?.department.toLowerCase()}</p>
    </button>
  )
}

export default LASCandidate