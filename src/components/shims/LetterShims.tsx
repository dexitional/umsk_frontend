import React, { useState } from 'react'
import PageTitle from '../ais/PageTitle'
import PageTitleShims from './PageTitleShims'
import { useUserStore } from '../../utils/authService'

type Props = {}

function LetterShims({}: Props) {
  const [ view, setView ] = useState('card')
  const lm = useUserStore.getState().limit;
  const pglimit  = lm?.serviceletters;
  if(!pglimit) useUserStore.setState({ limit: { ...lm, 'serviceletters': 9 }});
  const limit = (pglimit || 9);
  

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitleShims title="Service letters" createtext="New" createlink="create"  />
      <div className="">
         { view == 'card' && (
            <div className="grid md:grid-cols-3 gap-3 md:gap-6">
                 {/* Card Shim */}
                { Array(limit).fill(limit).map((_,i) => (
                <div key={i} className="p-4 md:p-6 min-h-max border border-slate-200 rounded-xl bg-slate-50/50 space-y-7 animate-pulse delay-75">
                    <div className="w-4/5 h-5 bg-slate-200 rounded-lg"></div>
                    <div className="w-full flex items-center justify-between space-x-2 transition-all animate-pulse">
                        <div className="w-3/5 h-3 bg-gray-200 rounded-lg"></div>
                        <div className="w-1/5 h-5 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="w-4/5 h-2 bg-gray-200 rounded-lg"></div>
                        <div className="w-2/3 h-2 bg-gray-200 rounded-lg"></div>
                        <div className="w-4/5 h-2 bg-gray-200 rounded-lg"></div>
                        <div className="w-6/7 h-2 bg-gray-200 rounded-lg"></div>
                        <div className="w-4/5 h-2 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div className="w-5/5 h-5 bg-slate-200 rounded-lg"></div>
                </div>
               ))}
            </div>
         )}


         {/* { view == 'list' && (
           <StudentListView data={data} />
         )} */}

      </div>
    </div>
  )
}

export default LetterShims

