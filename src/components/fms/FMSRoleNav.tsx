import React from 'react'
import { Menu } from '@headlessui/react'
import { CgMenuGridO } from "react-icons/cg";
import { FaChartBar } from 'react-icons/fa';
import { useUserStore } from '../../utils/authService';
import { GrDashboard } from 'react-icons/gr';
import AISNavItem from './FMSNavItem';
type Props = {
  user: any;
}

function FMSRoleNav({ user }: Props) {
  const fmsRoles = user?.roles?.filter((r: any) => r?.app?.toLowerCase() == 'fms')
  return (
    <Menu as='div' className="relative">
        <div className="px-4 p-2 md:hidden flex items-center justify-between border-b-2 border-slate-200/50 bg-slate-100 text-gray-400">
         
          <div className="flex items-center">
             <span className="px-3 p-1 text-sm tracking-widest font-bold text-primary/60 bg-white border-2 border-primary/60 rounded-md"><span className="text-primary/80">ACADEMICS</span>&reg;</span>
          </div>
          <Menu.Button className="p-0.5 bg-white border shadow-sm rounded-md">
            <CgMenuGridO className="h-7 w-7 text-gray-500/70"/>
          </Menu.Button>
        </div>
        {/* Mobile Navigation Slide */}
        <Menu.Items className="z-20 absolute top-13 left-0 min-h-max w-full border-b-4 border-blue-100/90 bg-blue-100 backdrop-blur-sm backdrop-opacity-70 bg-opacity-70">
          <div className="py-4 px-6 flex-1 flex flex-col space-y-1 md:space-y-4">
           { fmsRoles?.find((r:any) => ['finreport::admin'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Reports" url="System Reports" Icon={FaChartBar}></Menu.Item>)}
           { fmsRoles?.find((r:any) => ['dashboard::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="User Dashboard" url="dash" Icon={GrDashboard}></Menu.Item>)} 
           { fmsRoles?.find((r:any) => ['bill::admin','bill::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Student Bills" url="bills" Icon={GrDashboard}></Menu.Item>)} 
           { fmsRoles?.find((r:any) => ['charge::admin','charge::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Student Charges" url="charges" Icon={GrDashboard}></Menu.Item>)} 
           { fmsRoles?.find((r:any) => ['account::admin','account::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Student Accounts" url="accounts" Icon={GrDashboard}></Menu.Item>)} 
           { fmsRoles?.find((r:any) => ['debtor::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Student Debtors" url="debtors" Icon={GrDashboard}></Menu.Item>)} 
           { fmsRoles?.find((r:any) => ['payment::admin','payment::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Fees Payments" url="payments" Icon={GrDashboard}></Menu.Item>)} 
           { fmsRoles?.find((r:any) => ['transaction::admin','transaction::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Other Payments" url="transacts" Icon={GrDashboard}></Menu.Item>)} 
           { fmsRoles?.find((r:any) => ['vsale::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Voucher Sales" url="vsales" Icon={GrDashboard}></Menu.Item>)} 
           { fmsRoles?.find((r:any) => ['vprice::admin','vprice::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Voucher Prices" url="vcosts" Icon={GrDashboard}></Menu.Item>)} 
           { fmsRoles?.find((r:any) => ['scost::admin','scost::clerk'].includes(r?.role)) && (<Menu.Item as={AISNavItem} title="Service Costs" url="services" Icon={GrDashboard}></Menu.Item>)} 
          </div>
        </Menu.Items>
    </Menu>
  )
}

export default FMSRoleNav