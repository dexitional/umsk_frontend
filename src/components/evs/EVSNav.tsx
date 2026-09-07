import React from 'react'
import { GrDashboard } from 'react-icons/gr'
import EVSAdminNavItem from './EVSAdminNavItem'
import { useHasRole } from '../../utils/roles'

type Props = {
  user:any
}

function EVSNav({ user }: Props) {
  const isEvsAdmin = useHasRole('evs', ['election::admin'])
  return (
    <div className="py-2 px-2 flex flex-col space-y-1 md:space-y-2 h-[75vh] overflow-y-scroll scrollbar-hide">
        {/* <EVSAdminNavItem title="System Reports" url="reports" Icon={FaChartBar} /> */}
        { isEvsAdmin && <EVSAdminNavItem title="Elections Module" url="elections" Icon={GrDashboard} /> }
    </div>
  )
}

export default EVSNav