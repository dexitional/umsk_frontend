import React from 'react'
import DricNavItem from './HRSNavItem'
import { FaChartBar, FaRegChartBar } from 'react-icons/fa'
import { MdAccountCircle, MdSwitchAccount } from 'react-icons/md'
import { VscAccount } from 'react-icons/vsc'
import { BsPersonCircle, BsPersonVcard } from 'react-icons/bs'
import { AiOutlineFundProjectionScreen } from 'react-icons/ai'
import { TbReportMoney } from 'react-icons/tb'
import { GrDashboard } from 'react-icons/gr'
import { useUserStore } from '../../utils/authService'
import HRSNavItem from './HRSNavItem'

type Props = {}

function HRSNav({}: Props) {

  const { user } = useUserStore(state => state)
  const hrsRole = user?.roles?.find(r => r?.app_tag?.toLowerCase() == 'hrs')
  
  return (
    <div className="py-2 px-2 flex-1 flex flex-col space-y-1 md:space-y-2">
        {['hrs techlead','hrs admin'].includes(hrsRole?.role_name?.toLowerCase()) && <HRSNavItem title="System Reports" url="reports" Icon={FaChartBar} /> }
        <HRSNavItem title="NSS Module" url="nss" Icon={GrDashboard} /> {/* Active Personel, In-active Personel */}
        {/* <HRSNavItem title="Circular Module" url="nss" Icon={GrDashboard} />  */}
       
        
        {/* <HRSNavItem title="Dashboard" url="dash" Icon={GrDashboard} />
        <HRSNavItem title="Funders" url="funders" Icon={TbReportMoney} />
        <HRSNavItem title="Projects" url="projects" Icon={AiOutlineFundProjectionScreen} />
        <HRSNavItem title="Investigators" url="investigators" Icon={BsPersonVcard} />
        <HRSNavItem title="Personels" url="personels" Icon={BsPersonCircle} />
        {['hrs techlead','dric admin'].includes(dricRole?.role_name?.toLowerCase()) && <HRSNavItem title="Roles" url="roles" Icon={VscAccount} /> } */}
    </div>
  )
}

export default HRSNav