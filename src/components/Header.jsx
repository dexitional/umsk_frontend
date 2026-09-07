import React from 'react';
import { MdCancel, MdLogout, MdSpaceDashboard } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/img/logo_sso.png';
import { useUserStore } from '../utils/authService';
const { REACT_APP_API_URL } = import.meta.env;

function Header({ user = null,logout  = () => {}}) {
  
  const navigate = useNavigate()
  const { switchUser,tag } = useUserStore(state => state);
  // const { logout,user } = useAuth();
  const signout = async () => {
     const ok = window.confirm("Log Out?")
     if(ok){
       await logout();
       //navigate('/login', { replace: true })
       window.location.reload();
     }
  }

  const switchAccount = async (e) => {
    try {
        e.preventDefault();
        await switchUser(tag);
        window.location.href = '/'
    } catch (error) {
      console.log(error)
    }
 }

  return (
    <header className="w-full">
        <div className="w-full bg-primary">
            <div className="px-3 md:px-0 md:mx-auto w-full h-14 md:max-w-6xl flex items-center">
                <img src={Logo} alt="Logo" className="h-6 md:h-12" />
                <div className="flex-1 flex items-center justify-end space-x-2">
                    <img src={`${REACT_APP_API_URL}/auth/photos/?tag=${user?.user?.tag}`} alt="" className="h-8 w-8 rounded-full object-cover bg-yellow-100/50 backdrop-blur-sm" />
                    <div className="hidden md:flex px-3 py-1 rounded-md border border-gray-200  bg-primary/20 bg-opacity-50 backdrop-blur-sm text-white font-semibold capitalize">{user?.user?.fname?.toLowerCase()} { user?.user?.mname && user?.user?.mname?.toLowerCase()+' '}{user?.user?.lname?.toLowerCase()}</div>
                    <div className="p-1 rounded-md border md:border flex items-center space-x-1">
                        { tag && tag != user?.user?.tag ? 
                        <button onClick={switchAccount} className={`bg-slate-50 h-6 w-6 rounded border flex items-center justify-center`}>
                            <MdCancel className="h-5 w-5 text-primary-dark" />
                        </button> : null
                        }
                        <Link to="/dash" className={`bg-slate-200 h-6 w-6 rounded-l border flex items-center justify-center`}>
                            <MdSpaceDashboard className="h-5 w-5 text-primary-dark" />
                        </Link>
                        <button onClick={signout} className={`bg-slate-50 h-6 w-6 rounded-r border flex items-center justify-center`}>
                            <MdLogout className="h-5 w-5 text-primary-dark" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div className="h-2 w-full border-b-2 border-red-200/20 bg-red-100 /*bg-[url('./assets/img/adinkra.png')]*/ bg-center"></div>
    </header>
  )
}

export default Header