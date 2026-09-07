import React from 'react'
import { Menu } from '@headlessui/react'
import { CgMenuGridO } from "react-icons/cg";
import { GrDashboard } from 'react-icons/gr';
import AISNavItem from '../ais/AISNavItem';
import { useHasRole } from '../../utils/roles';
type Props = {
  user: any;
}

function EVSRoleNav({ user }: Props) {
  const isEvsAdmin = useHasRole('evs', ['election::admin'])

  return (
    <Menu as='div' className="relative">
        <div className="px-4 p-2 md:hidden flex items-center justify-between border-b-2 border-slate-200/50 bg-slate-100 text-gray-400">

          <div className="flex items-center">
             <span className="px-3 p-1 text-sm tracking-widest font-bold text-primary/60 bg-white border-2 border-primary/60 rounded-md"><span className="text-primary/80">ELECTA </span>&reg;</span>
          </div>
          <Menu.Button className="p-0.5 bg-white border shadow-sm rounded-md">
            <CgMenuGridO className="h-7 w-7 text-gray-500/70"/>
          </Menu.Button>
        </div>
        {/* Mobile Navigation Slide */}
        <Menu.Items className="z-20 absolute top-13 left-0 min-h-max w-full border-b-4 border-blue-100/90 bg-blue-100 backdrop-blur-sm backdrop-opacity-70 bg-opacity-70">
          <div className="py-4 px-6 flex-1 flex flex-col space-y-1 md:space-y-4">
            {/* <Menu.Item as={AISNavItem} title="Reports" url="System Reports" Icon={FaChartBar}></Menu.Item> */}
            { isEvsAdmin && <Menu.Item as={AISNavItem} title="Election Module" url="elections" Icon={GrDashboard}></Menu.Item> }
          </div>
        </Menu.Items>
    </Menu>
  )
}

export default EVSRoleNav