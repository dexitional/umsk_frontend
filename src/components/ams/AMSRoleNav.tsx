import React from 'react'
import { Menu } from '@headlessui/react'
import { CgMenuGridO } from "react-icons/cg";
import { FaChartBar } from 'react-icons/fa';
import { useUserStore } from '../../utils/authService';
import { GrDashboard } from 'react-icons/gr';
import AMSNavItem from './AMSNavItem';
import { FaDashcube } from 'react-icons/fa6'

type Props = {
  user: any;
}

function AMSRoleNav({ user }: Props) {
  const amsRoles = user?.roles?.filter((r:any) => r?.app?.toLowerCase() == 'ams')
  return (
    <Menu as='div' className="relative">
        <div className="px-4 p-2 md:hidden flex items-center justify-between border-b-2 border-slate-200/50 bg-slate-100 text-gray-400">
         
          <div className="flex items-center">
             <span className="px-3 p-1 text-sm tracking-widest font-bold text-primary/60 bg-white border-2 border-primary/60 rounded-md"><span className="text-primary/80">ADMISSIONS</span>&reg;</span>
          </div>
          <Menu.Button className="p-0.5 bg-white border shadow-sm rounded-md">
            <CgMenuGridO className="h-7 w-7 text-gray-500/70"/>
          </Menu.Button>
        </div>
        {/* Mobile Navigation Slide */}
        <Menu.Items className="z-20 absolute top-13 left-0 min-h-max w-full border-b-4 border-blue-200/90 bg-blue-100 backdrop-blur-sm backdrop-opacity-95 bg-opacity-95">
          <div className="py-4 px-6 flex-1 flex flex-col space-y-1 md:space-y-4">
           <Menu.Item as={AMSNavItem} title="Dashboard" url="dash" Icon={FaDashcube}></Menu.Item>
           { amsRoles?.find((r:any) => ['admreport::admin'].includes(r?.role)) && (<Menu.Item as={AMSNavItem} title="System Reports" url="reports" Icon={FaChartBar}></Menu.Item>)}
           { amsRoles?.find((r:any) => ['session::admin','session::clerk'].includes(r?.role)) && (<Menu.Item as={AMSNavItem} title="Session Module" url="sessions" Icon={GrDashboard}></Menu.Item>)} 
           { amsRoles?.find((r:any) => ['voucher::admin','voucher::clerk'].includes(r?.role)) && (<Menu.Item as={AMSNavItem} title="Voucher Module" url="vouchers" Icon={GrDashboard}></Menu.Item>)} 
           { amsRoles?.find((r:any) => ['aletter::admin','aletter::clerk'].includes(r?.role)) && (<Menu.Item as={AMSNavItem} title="Letters Module" url="letters" Icon={GrDashboard}></Menu.Item>)} 
           { amsRoles?.find((r:any) => ['applicant::admin-ug','applicant::clerk-ug','applicant::admin-pg','applicant::clerk-pg'].includes(r?.role)) && (<Menu.Item as={AMSNavItem} title="Applicant Module" url="applicants" Icon={GrDashboard}></Menu.Item>)}
           { amsRoles?.find((r:any) => ['shortlist::admin-ug','shortlist::clerk-ug','shortlist::admin-pg','shortlist::clerk-pg'].includes(r?.role)) && (<Menu.Item as={AMSNavItem} title="Shortlist Module" url="shortlists" Icon={GrDashboard}></Menu.Item>)}
           { amsRoles?.find((r:any) => ['matriculant::clerk-ug','matriculant::clerk-pg'].includes(r?.role)) && (<Menu.Item as={AMSNavItem} title="Admitted Students" url="matriculants" Icon={GrDashboard}></Menu.Item>)}
          </div>
        </Menu.Items>
    </Menu>
  )
}

export default AMSRoleNav