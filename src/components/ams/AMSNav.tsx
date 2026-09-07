import React from 'react'
import { FaChartBar, FaTools } from 'react-icons/fa'
import { GrDashboard } from 'react-icons/gr'
import { default as AISNavItem, default as AMSNavItem } from './AMSNavItem'
import { FaDashcube } from 'react-icons/fa6'

type Props = { user:any; }

function AMSNav({ user }: Props) {
  const amsRoles = user?.roles?.filter((r:any) => r?.app?.toLowerCase() == 'ams')
 
  return (
    <div className="py-2 px-2 flex-1 flex flex-col space-y-1 md:space-y-2">
      <AISNavItem title="Dashboard" url="dash" Icon={FaDashcube} /> 
      { amsRoles?.find((r:any) => ['admreport::admin'].includes(r?.role)) && (<AISNavItem title="System Reports" url="reports" Icon={FaChartBar} />) }
      { amsRoles?.find((r:any) => ['session::admin','session::clerk'].includes(r?.role)) && (<AMSNavItem title="Session Module" url="sessions" Icon={GrDashboard} />) }
      { amsRoles?.find((r:any) => ['voucher::admin','voucher::clerk'].includes(r?.role)) && (<AMSNavItem title="Voucher Module" url="vouchers" Icon={GrDashboard} />) }
      { amsRoles?.find((r:any) => ['aletter::admin','aletter::clerk'].includes(r?.role)) && (<AMSNavItem title="Letters Module" url="letters" Icon={GrDashboard} />) }
      { amsRoles?.find((r:any) => ['applicant::admin-ug','applicant::clerk-ug','applicant::admin-pg','applicant::clerk-pg'].includes(r?.role)) && (<AMSNavItem title="Applicant Module" url="applicants" Icon={GrDashboard} />) }
      { amsRoles?.find((r:any) => ['shortlist::admin-ug','shortlist::clerk-ug','shortlist::admin-pg','shortlist::clerk-pg'].includes(r?.role)) && (<AMSNavItem title="Shortlist Module" url="shortlists" Icon={GrDashboard} />) }
      { amsRoles?.find((r:any) => ['matriculant::clerk-ug','matriculant::clerk-pg'].includes(r?.role)) && (<AMSNavItem title="Admitted Students" url="matriculants" Icon={GrDashboard} />) }
      { amsRoles?.find((r:any) => ['applicant::admin-ug','applicant::admin-pg'].includes(r?.role)) && (<AMSNavItem title="Storage Tools" url="tools" Icon={FaTools} />) }
    </div>
  )
}

export default AMSNav