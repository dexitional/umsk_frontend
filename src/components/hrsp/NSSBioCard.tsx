import React from 'react'
import { FiEdit } from "react-icons/fi";
import { useUserStore } from '../../utils/authService';
import { FcViewDetails } from 'react-icons/fc';
import { IconType } from 'react-icons';

type Props = {
  data?: any;
  label: string;
  value: string;
  Icon: IconType;
}

function NSSBioCard({ label, value, Icon }: Props) {

  return (
    <div className="py-2 px-4 shadow rounded-full flex space-x-4 bg-gradient-to-r from-blue-50 via-blue-50">
      <div className="flex flex-col space-y-2">
        <div className="p-2 border-4 border-slate-100 bg-white rounded-full">
          <Icon className="h-4 w-4 text-blue-950/60" />
        </div>
      </div>
      <div className="space-y-0.5">
          <span className="text-xs md:text-sm text-gray-500 tracking-wider">{label}</span>
          <p className="text-sm md:text-[0.95rem] font-semibold text-blue-950/60 tracking-wider">{value}</p>
      </div>
    </div>
  )
}

export default NSSBioCard