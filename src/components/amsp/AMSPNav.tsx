import React from 'react'
import { MdOutlineAddTask, MdOutlineDashboard, MdPassword } from 'react-icons/md'
import { CiUser } from "react-icons/ci";
import AISPNavItem from './AMSPNavItem'

type Props = {
  user: any
}

function AMSPNav({ user }: Props) {
  return (
    <div className="py-4 flex-1 flex flex-col space-y-1 md:space-y-3">
      <AISPNavItem title="Dashboard" url="dash" Icon={MdOutlineDashboard} />
    </div>
  )
}

export default AMSPNav