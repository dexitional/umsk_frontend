import React from 'react'
import { FcViewDetails } from 'react-icons/fc'

type Props = {
  title: string;
  children: React.ReactNode
}

function NSSInstructCard({ title, children }: Props) {
  return (
    <div className="p-4 rounded-lg shadow flex space-x-4 bg-gradient-to-r from-blue-50 via-blue-50">
        <div className="flex flex-col space-y-3">
          {/* <span className="text-xs text-gray-400 tracking-wider italic">Aug 12,23</span> */}
          <button className="p-2 w-fit h-fit border-4 border-slate-100 bg-white rounded-full flex items-center justify-center">
              <FcViewDetails className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col space-y-3">
          <h1 className="font-semibold text-lg text-gray-500 line-clamp-1">{title}</h1>
          <div className="space-y-2">
            {children}
          </div>
        </div>
    </div>
  )
}

export default NSSInstructCard