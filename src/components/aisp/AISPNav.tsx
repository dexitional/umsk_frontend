import React from 'react';
import { CiUser } from "react-icons/ci";
import { MdOutlineAddTask, MdOutlineDashboard } from 'react-icons/md';
import { PiLockKey } from "react-icons/pi";
import AISPNavItem from './AISPNavItem';
import { GiVote } from 'react-icons/gi';
import { FaVoteYea } from 'react-icons/fa';
import { FaAddressCard } from 'react-icons/fa6';
import { BiSpreadsheet } from 'react-icons/bi';
import { TbChecklist } from 'react-icons/tb';
import { BsReceipt } from 'react-icons/bs';

type Props = {
  user: any;
}

function AISPNav({ user }: Props) {
  return (
    <div className="flex-1 flex flex-col space-y-1.5">
        <AISPNavItem title="Dashboard" url="dash" Icon={MdOutlineDashboard} />
        <AISPNavItem title="My Profile" url="profile" Icon={FaAddressCard} />
        <AISPNavItem title="Fees & Charges" url="fees" Icon={BsReceipt} />
        <AISPNavItem title="Course Registration" url="registration" Icon={TbChecklist} />
        <AISPNavItem title="Academic Results" url="results" Icon={BiSpreadsheet} />
        <AISPNavItem title="Service Requests" url="services" Icon={MdOutlineAddTask} />
        <AISPNavItem title="Evaluations" url="evaluation" Icon={MdOutlineAddTask} />
        <AISPNavItem title="Elections Portal" url="/evs/dash" Icon={FaVoteYea} />
        {/* <AISPNavItem title="MLK Circulars" url="notices" Icon={MdOutlineAddTask} /> */}
        {/* <NSSNavItem title="Discipline Cases" url="disciplinary" Icon={GoBriefcase} /> */}
        <div className="my-2 mx-6 border-t border-slate-100" />
        <AISPNavItem title="Change Password" url="changepwd" Icon={PiLockKey} />

    </div>
  )
}

export default AISPNav