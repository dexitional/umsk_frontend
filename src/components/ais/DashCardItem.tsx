import React from 'react'
import { FaChartLine, FaHeart, FaMarker } from 'react-icons/fa'
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md'

type Props = {
    theme: string;
    title?: string;
    total?: string;
    active?: string;
    added?: string;
}

function DashCardItem({ theme, title, total, active, added }: Props) {
   
  const themes = {
     info: { bgColor:'bg-blue-700', iconBgColor: 'bg-blue-300/30', iconBorderColor: 'border-blue-800/10'},
     warning: { bgColor:'bg-red-700/50', iconBgColor: 'bg-red-200/30', iconBorderColor: 'border-red-800/10'},
     dark: { bgColor:'bg-zinc-700', iconBgColor: 'bg-zinc-300/30', iconBorderColor: 'border-zinc-800/10'},
  }
  return (
    <div className={`py-6 px-6 min-h-fit ${themes[theme].iconBgColor} ${themes[theme].iconBorderColor} border rounded-3xl space-y-4`}>
        <div className="flex justify-between">
            <div className="pr-16 flex-1 flex space-x-3">
                <div className={`p-3 h-10 w-10 rounded-xl ${themes[theme].bgColor} text-white flex items-center justify-center`}>
                    {/* <FaMarker /> */}
                    <span className="text-white font-bold font-mono">{total || 0}</span>
                </div>
                <div className="py-1 flex flex-col justify-between space-y-2">
                    <span className="text-sm font-medium">{title}</span>
                    <span className="text-xs text-gray-500 font-medium">2,241 active</span>
                </div>
            </div>
            <FaHeart className="h-3 w-3 text-gray-400" />
        </div>
        
        <div className="hidden items-center justify-between">
            <div className="flex items-center space-x-3">
            <span className="text-base">$215,1000</span>
            <span className="text-sm text-green-500">+4.5%</span>
            </div>
            {/*  Use google-charts  */}
            {/* Funder Logo */}
            <FaChartLine className="w-20 h-10" /> 
        </div>
        
        <div className="px-2 grid grid-cols-2 gap-2 font-medium">
            <div className="flex items-center space-x-2 text-xs">
                {/* <MdArrowDownward className="h-6 w-6 text-red-500" /> */}
                <span>32</span>
                <span className="text-[0.6rem] text-gray-400">ADDED THIS YEAR</span>
            </div>
            <div className="hidden items-center space-x-2 text-xs">
                {/* <MdArrowUpward className="h-6 w-6 text-green-500" /> */}
                <span>$12000</span>
                <span className="text-[0.6rem] text-gray-400">OUTSTANDING</span>
            </div>
        </div>

    </div>
  )
}

export default DashCardItem