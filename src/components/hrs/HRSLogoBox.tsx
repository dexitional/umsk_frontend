import React from 'react'

type Props = {}

function HRSLogoBox({}: Props) {
  return (
    <div className="my-2 p-4 rounded-l-md bg-gradient-to-l to-gray-200 via-white from-white">
        <div className="h-10 flex items-center justify-center space-x-0 font-sans text-xl rounded-t-md border-2 bg-white border-b-8 border-blue-950/70 text-blue-950/70 tracking-widest">
            <span className="font-extrabold">UCC</span> 
            <span className="font-mono">HRMS</span>
        </div>
    </div>   
  )
}

export default HRSLogoBox