import React from 'react'
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi'
import { ImPlus } from 'react-icons/im';
import { PiListNumbersBold } from 'react-icons/pi'

type Props = {
    title: string;
  createtext?: string;
  createlink?: string;
}

function PageTitleShims({
    title,
    createtext,
    createlink
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
    <h1 className="text-sm md:text-xl text-primary-dark/70 font-medium uppercase tracking-widest">{title}</h1>
    <div className="flex items-center space-x-2 space-y-1 flex-wrap md:flex-nowrap md:space-y-0 animate-pulse">
     
        <div className="p-1 w-fit rounded border md:border-2 flex items-center justify-between space-x-1">
          <div className="flex items-center space-x-1">
            <button
              disabled
             className={`bg-blue-50 md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center group`}
            >
              <BiSolidLeftArrow className="h-4 w-4 md:h-5 md:w-5 group-disabled:text-red-950/10 text-primary/70" />
            </button>
            <button
              className={`bg-slate-50 md:h-8 md:w-fit h-6 w-fit rounded border flex items-center justify-center`}
            >
              <span className="px-2 w-fit h-4 md:h-5 font-semibold text-[0.65rem] md:text-sm text-primary-dark/30">1</span>
            </button>
            <button disabled className={`bg-blue-50 md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center group`}>
              <BiSolidRightArrow className="h-4 w-4 md:h-5 md:w-5 group-disabled:text-red-950/10 text-primary/70" />
            </button>
            <button className={`bg-amber-50 md:h-8 md:w-fit h-6 w-fit rounded border flex items-center justify-center`}>
              <span className="px-2 h-4 md:h-5 w-fit md:w-fit font-semibold text-[0.65rem] md:text-sm text-primary-dark/30">1</span>
            </button>
          </div>
          <div className="relative">
            {/* <input type="search" name="search" placeholder="Search Record ..." onChange={searchRecord} className="w-40 md:h-8 h-6 bg-slate-50 border border-slate-100 placeholder:text-gray-400 focus:border-slate-50 focus:outline-none rounded " /> */}
            <input
              disabled
              type="search"
              name="search"
              placeholder="Search Record ..."
              className="w-[40vw] md:w-52 md:h-8 h-6 font-roboto text-sm md:text-base placeholder:text-sm md:placeholder:text-base text-gray-500 placeholder:text-gray-200/80 bg-slate-50 border border-slate-100  focus:ring-0 focus:border-slate-300 focus:outline-none rounded "
            />
          </div>
          <button className={`bg-slate-100 md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}>
              <PiListNumbersBold className="h-4 w-4 md:h-5 md:w-5 text-gray-200" />
          </button>
          {/* <button onClick={() => setView('list')} className={`${view == 'list' ? 'bg-slate-200':'bg-slate-50'} md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}>
                  <GiHamburgerMenu className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
              </button>
              <button onClick={() => setView('card')} className={`${view == 'card' ? 'bg-slate-200':'bg-slate-50'} md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}>
                  <MdDashboard className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
              </button> */}
        </div>
     

      {createlink && createtext ? (
        <button
         disabled
         className="py-0 md:py-2 px-3 md:px-4 h-9 md:h-10 rounded-md border bg-primary/40 flex items-center space-x-3"
        >
          <ImPlus className="text-white h-3 w-3 md:h-4 md:w-4" />
          <span className="flex text-white text-sm md:text-base font-medium">
            {createtext}
          </span>
        </button>
      ) : null}
    </div>
  </div>
  )
}

export default PageTitleShims