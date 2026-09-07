import React from 'react'
import { Menu } from '@headlessui/react'
import { CgMenuGridO } from "react-icons/cg";
import { FaChartBar } from 'react-icons/fa';
import { useUserStore } from '../../utils/authService';
import HRSNavItem from './HRSNavItem';
import { GrDashboard } from 'react-icons/gr';
type Props = {}

function HRSRoleNav({}: Props) {

  const { user } = useUserStore(state => state)
  const hrsRole = user?.roles?.find(r => r?.app_tag?.toLowerCase() == 'hrs')
  
  return (
    <Menu as='div' className="relative">
        <div className="px-4 p-2 md:hidden flex items-center justify-between border-b-2 border-slate-200/50 bg-slate-100 text-gray-400">
         
          <div className="flex items-center">
             <span className="px-3 p-1 text-sm tracking-widest font-bold text-blue-950/60 bg-white border-2 border-blue-950/60 rounded-md"><span className="text-blue-300">UCC</span> HRMS</span>
          </div>
          <Menu.Button className="p-0.5 bg-white border shadow-sm rounded-md">
            <CgMenuGridO className="h-7 w-7 text-gray-500/70"/>
          </Menu.Button>
        </div>
        {/* Mobile Navigation Slide */}
        <Menu.Items className="z-20 absolute top-13 left-0 min-h-max w-full border-b-4 border-blue-100/90 bg-blue-100 backdrop-blur-sm backdrop-opacity-70 bg-opacity-70">
          <div className="py-4 px-6 flex-1 flex flex-col space-y-1 md:space-y-4">
           {['hrs techlead','hrs admin'].includes(hrsRole?.role_name?.toLowerCase()) && <Menu.Item as={HRSNavItem} title="Reports" url="System Reports" Icon={FaChartBar}></Menu.Item>}
            <Menu.Item as={HRSNavItem} title="NSS Module" url="nss" Icon={GrDashboard}></Menu.Item>
            {/* <Menu.Item as={DricNavItem} title="Dashboard" url="dash" Icon={GrDashboard}></Menu.Item>
            <Menu.Item as={DricNavItem} title="Funders" url="funders" Icon={TbReportMoney}></Menu.Item>
            <Menu.Item as={DricNavItem} title="Projects" url="projects" Icon={AiOutlineFundProjectionScreen}></Menu.Item>
            <Menu.Item as={DricNavItem} title="Investigators" url="investigators" Icon={BsPersonVcard}></Menu.Item>
            <Menu.Item as={DricNavItem} title="Personels" url="personels" Icon={BsPersonCircle}></Menu.Item> */}
            {/* {['hrs techlead','hrs admin'].includes(hrsRole?.role_name?.toLowerCase()) && <Menu.Item as={DricNavItem} title="Roles" url="roles" Icon={VscAccount} ></Menu.Item>} */}
          </div>
        </Menu.Items>
    </Menu>
  )
}

export default HRSRoleNav