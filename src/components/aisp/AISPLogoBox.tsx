import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../assets/img/logo.webp'

type Props = {}

function AISPLogoBox({}: Props) {
  return (
    <Link to="/aisp/dash" className="flex items-center gap-3">
      <div className="h-11 w-11 shrink-0 p-1.5 rounded-2xl bg-white shadow-lg shadow-black/20 ring-1 ring-white/20 flex items-center justify-center">
        <img src={Logo} alt="" className="h-full w-full object-contain" />
      </div>
      <div className="leading-tight">
        <span className="block text-[0.95rem] font-bold text-white tracking-tight">Student Portal</span>
        <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sky-300/80">ehub · AKATSICO</span>
      </div>
    </Link>
  )
}

export default AISPLogoBox
