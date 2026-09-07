import React from 'react'
import { MdOutlineAddTask, MdOutlineDashboard, MdPassword } from 'react-icons/md'
import { CiUser } from "react-icons/ci";
import { PiLockKey } from "react-icons/pi";
import { GoBriefcase } from "react-icons/go";
import { SlEnvolopeLetter } from "react-icons/sl";
import { useUserStore } from '../../utils/authService'
import NSSNavItem from './NSSNavItem'

type Props = {}

function NSSNav({}: Props) {

  const { user } = useUserStore(state => state)
  const lasRole = user?.roles?.find(r => r?.app_tag?.toLowerCase() == 'las')
  
  return (
    <div className="py-4 flex-1 flex flex-col space-y-1 md:space-y-4">
        <NSSNavItem title="Dashboard" url="dash" Icon={MdOutlineDashboard} />
        <NSSNavItem title="NSS Profile" url="profile" Icon={CiUser} />
        <NSSNavItem title="NSS Notices" url="notices" Icon={MdOutlineAddTask} />
        {/* <NSSNavItem title="Discipline Cases" url="disciplinary" Icon={GoBriefcase} /> */}
        <NSSNavItem title="Service Requests" url="services" Icon={MdOutlineAddTask} />
        {/* <NSSNavItem title="Release Letter " url="release" Icon={SlEnvolopeLetter} /> */}
        <NSSNavItem title="Change Password" url="changepwd" Icon={PiLockKey} />

    </div>
  )
}

export default NSSNav