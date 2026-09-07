import React from 'react';
import Logo from '../assets/img/logo_portalbr_.png';
//import { useAuth } from '../utils/authService';
import { MdLogout } from 'react-icons/md';
import { Link, useNavigate } from "react-router-dom";

function HeaderLogin() {
  
  const navigate = useNavigate()
 
  return (
    <header className="w-full">
        <div className="w-full bg-blue-950">
            <div className="px-3 md:px-0 md:mx-auto w-full h-14 md:max-w-7xl flex items-center">
                <img src={Logo} alt="Logo" className="h-7 md:h-12" />
                <div className="flex-1 flex items-center justify-end space-x-2">
                    <img src={Logo} alt="" className="h-8 w-8 rounded-full object-cover bg-yellow-100/50 backdrop-blur-sm" />
                    <div className="p-1 rounded-md border md:border flex items-center space-x-1">
                        <Link to={`/login`} className={`bg-slate-50 h-6 w-6 rounded-r border flex items-center justify-center`}>
                            <MdLogout className="h-5 w-5 text-blue-950" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        <div className="h-2 w-full border-b-2 border-red-200/20 bg-red-100 /*bg-[url('./assets/img/adinkra.png')]*/ bg-center"></div>
    </header>
  )
}

export default HeaderLogin