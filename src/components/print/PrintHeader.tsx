import React from 'react'
import PrintHeaderAucc from './PrintHeaderAucc'
import PrintNoHeader from './PrintNoHeader'
import { useLocation } from 'react-router'

type Props = {}

function PrintHeader({}: Props) {

  const location = useLocation();
  const { pathname } = location;
   
  if(pathname.includes('/ams/') || pathname.includes('/print/transwift/') || pathname.includes('/amsp/'))
    return (
      <div className="print:mt-2 print:mb-4">
        <div className="block print:block"><PrintHeaderAucc /></div>
      </div>
    )
  else
    return (
      <div>
        <div className="block print:hidden"><PrintHeaderAucc /></div>
        <div className="hidden print:block"><PrintNoHeader /></div>
      </div>
    )
}

export default PrintHeader