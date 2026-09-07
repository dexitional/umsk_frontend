import React from 'react'
import { Menu } from '@headlessui/react'
import { CgMenuGridO } from "react-icons/cg";
import { VscAccount } from 'react-icons/vsc';
import { MdOutlineAddTask } from 'react-icons/md';
import { CiUser } from 'react-icons/ci';
import { PiLockKey } from 'react-icons/pi';
import AMSPNavItem from './AMSPNavItem';
import AISPNavItem from '../aisp/AISPNavItem';
import { useHasRole } from '../../utils/roles';

type Props = {
  user: any
}

function AMSPRoleNav({ user }: Props) {
  const canManageRoles = useHasRole('ais', ['hrm::admin'])

  return (
    <Menu as='div' className="relative">
        <div className="px-4 p-2 md:hidden flex items-center justify-between border-b-2 border-slate-200/50 bg-slate-100 text-gray-400">
         
          <div className="flex items-center">
             <span className="px-3 p-1 text-sm tracking-widest font-bold text-primary/60 bg-white border-2 border-primary/60 rounded-md"><span className="text-primary/40">ADMISSION</span> PORTAL</span>
          </div>
          <Menu.Button className="hidden p-0.5 bg-white border shadow-sm rounded-md">
            <CgMenuGridO className="h-7 w-7 text-gray-500/70"/>
          </Menu.Button>
        </div>
        {/* Mobile Navigation Slide */}
        <Menu.Items className="hidden z-20 absolute top-13 left-0 min-h-max w-full rounded-b-[2.5rem] md:rounded-none border-b-8 border-blue-100/90 bg-primary backdrop-blur-lg backdrop-opacity-50 bg-opacity-95">
          <div className="py-4 px-6 pr-0  flex-1 flex flex-col space-y-1 md:space-y-4">
            <Menu.Item as={AISPNavItem} title="Dashboard" url="/amsp" Icon={CiUser}></Menu.Item>
            {canManageRoles && <Menu.Item as={AMSPNavItem} title="Roles" url="roles" Icon={VscAccount} ></Menu.Item>}
          </div>
        </Menu.Items>
    </Menu>
  )
}

export default AMSPRoleNav