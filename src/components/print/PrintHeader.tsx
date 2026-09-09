import React from 'react'
import PrintHeaderAkatsico from './PrintHeaderAucc'
import PrintNoHeader from './PrintNoHeader'
import { useLocation } from 'react-router'

type Props = {}

function PrintHeader({}: Props) {

  const location = useLocation();
  const { pathname } = location;
   
  if(pathname.includes('/print/transwift/'))
    return (
      <div className="print:mt-2 print:mb-4">
        <div className="block print:block"><PrintHeaderAkatsico /></div>
      </div>
    )
  else
    return (
      <div>
        <div className="block print:hidden"><PrintHeaderAkatsico /></div>
        <div className="hidden print:block"><PrintNoHeader /></div>
      </div>
    )
}

export default PrintHeader