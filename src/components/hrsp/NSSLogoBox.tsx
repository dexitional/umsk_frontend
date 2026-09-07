import React from 'react'

type Props = {}

function NSSLogoBox({}: Props) {
  return (
    <div className="my-2 mx-4 p-4 rounded-md bg-gradient-to-l to-blue-900/90 via-blue-950/70 from-blue-900/90">
        <div className="h-10 flex items-center justify-center s pace-x-0 font-sans text-lg rounded-full border-2 bg-lime-100 border-b-8 border-blue-950/70 text-blue-950/70 tracking-widest">
            <span className="font-extrabold text-blue-900/90">NSS</span> 
            <span className="font-mono font-medium">&nbsp;PORTAL</span>
        </div>
    </div>   
  )
}

export default NSSLogoBox