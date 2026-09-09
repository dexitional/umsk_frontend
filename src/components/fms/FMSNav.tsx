import React from 'react'
import { FaChartBar } from 'react-icons/fa'
import { GrDashboard } from 'react-icons/gr'
import FMSNavItem from './FMSNavItem'

type Props = {
  user:any;
}

function FMSNav({ user }: Props) {
  const fmsRoles = user?.roles?.filter((r:any) => r?.app?.toLowerCase() == 'fms');
  return (
    <div className="py-2 px-2 flex-1 flex flex-col space-y-1 md:space-y-2">
        { fmsRoles?.find((r:any) => ['finreport::admin'].includes(r?.role)) && (<FMSNavItem title="System Reports" url="reports" Icon={FaChartBar} />) } 
        { fmsRoles?.find((r:any) => ['dashboard::clerk'].includes(r?.role)) && (<FMSNavItem title="User Dashboard" url="dash" Icon={GrDashboard} />) } 
        { fmsRoles?.find((r:any) => ['bill::admin','bill::clerk'].includes(r?.role)) && (<FMSNavItem title="Student Bills" url="bills" Icon={GrDashboard} />) } 
        { fmsRoles?.find((r:any) => ['charge::admin','charge::clerk'].includes(r?.role)) && (<FMSNavItem title="Student Charges" url="charges" Icon={GrDashboard} />) } 
        { fmsRoles?.find((r:any) => ['account::admin','account::clerk'].includes(r?.role)) && (<FMSNavItem title="Student Accounts" url="accounts" Icon={GrDashboard} />) } 
        { fmsRoles?.find((r:any) => ['debtor::clerk'].includes(r?.role)) && (<FMSNavItem title="Student Debtors" url="debtors" Icon={GrDashboard} />) } 
        { fmsRoles?.find((r:any) => ['payment::admin','payment::clerk'].includes(r?.role)) && (<FMSNavItem title="Fees Payments" url="payments" Icon={GrDashboard} />) } 
        { fmsRoles?.find((r:any) => ['transaction::admin','transaction::clerk'].includes(r?.role)) && (<FMSNavItem title="Other Payments" url="transacts" Icon={GrDashboard} />) }
        { fmsRoles?.find((r:any) => ['scost::admin','scost::clerk'].includes(r?.role)) && (<FMSNavItem title="Service Costs" url="services" Icon={GrDashboard} />) }
    </div>
  )
}

export default FMSNav