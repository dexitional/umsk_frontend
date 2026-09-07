import React from 'react'

type Props = {}

function AISLogoBox({}: Props) {
  return (
    <div className="my-2 p-4 rounded-l-md bg-gradient-to-l to-primary/10 via-white from-white">
        <div className="h-10 flex items-center justify-center space-x-0 font-sans text-xl rounded-t-md border-2 bg-white border-b-8 border-primary/70 text-primary/90 tracking-widest">
            <span className="font-extrabold">ACADEMICS</span> 
            <span className="font-mono">&reg;</span>
        </div>
    </div>   
  )
}

export default AISLogoBox