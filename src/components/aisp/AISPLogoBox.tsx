import React from 'react'

type Props = {}

function AISPLogoBox({}: Props) {
  return (
    <div className="px-2 py-1 flex items-center space-x-3">
        <div className="h-11 w-11 shrink-0 rounded-2xl bg-primary flex items-center justify-center">
            <span className="font-quicksand font-bold text-white text-lg">S</span>
        </div>
        <span className="font-quicksand font-bold text-primary text-lg leading-tight">
            Student Portal
        </span>
    </div>
  )
}

export default AISPLogoBox