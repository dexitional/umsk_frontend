import React from 'react'
import DricNavItem from './LASNavItem'
import { FaChartBar, FaRegChartBar } from 'react-icons/fa'
import { MdAccountCircle, MdSwitchAccount } from 'react-icons/md'
import { VscAccount } from 'react-icons/vsc'
import { BsPersonCircle, BsPersonVcard } from 'react-icons/bs'
import { AiOutlineFundProjectionScreen } from 'react-icons/ai'
import { TbReportMoney } from 'react-icons/tb'
import { GrDashboard } from 'react-icons/gr'
import { useUserStore } from '../../utils/authService'
import LASNavItem from './LASNavItem'

type Props = {}

function LASNav({}: Props) {

  const { user } = useUserStore(state => state)
  const lasRole = user?.roles?.find(r => r?.app_tag?.toLowerCase() == 'las')
  
  return (
    <div className="py-4 px-6 flex-1 flex flex-col space-y-1 md:space-y-4">
        <LASNavItem title="Dashboard" url="dash" Icon={GrDashboard} />
        {['las techlead','las admin'].includes(lasRole?.role_name?.toLowerCase()) && <LASNavItem title="Results" url="results" Icon={FaChartBar} /> }
        {['las techlead','las admin'].includes(lasRole?.role_name?.toLowerCase()) && <LASNavItem title="Settings" url="settings" Icon={TbReportMoney} />}
        {['las techlead','las admin'].includes(lasRole?.role_name?.toLowerCase()) && <LASNavItem title="Roles" url="roles" Icon={VscAccount} /> }
    </div>
  )
}

export default LASNav