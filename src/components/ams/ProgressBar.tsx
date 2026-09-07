import React from 'react'

type Props = {
    value: number
}

function ProgressBar({ value }: Props) {
  return (
    <div className="mb-5 h-2 rounded-full bg-gray-200">
        <div className={`h-2 rounded-full ${value == 100 ? 'bg-green-600/60':'bg-blue-950/40'}`} style={{ width: value+'%'}}></div>
    </div>
  )
}

export default ProgressBar