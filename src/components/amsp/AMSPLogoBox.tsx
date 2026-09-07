import React from 'react'

type Props = {}

function AMSPLogoBox({}: Props) {
  return (
    <div className="my-2 px-4 py-2 bg-gradient-to-l to-primary-accent/90 via-primary-accent from-primary-accent/90">
        <div className="h-10 flex items-center justify-center s pace-x-0 font-sans text-sm rounded-full border-2 bg-slate-100 border-b-8 border-primary-accent/70 text-blue-950/70 tracking-widest">
            <span className="font-extrabold text-primary-accent/90">ADMISSION</span> 
            <span className="font-mono font-bold text-primary-accent/90">&nbsp;PORTAL</span>
        </div>
    </div>   
  )
}

export default AMSPLogoBox