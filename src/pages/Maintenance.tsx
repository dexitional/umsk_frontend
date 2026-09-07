import React, { useEffect, useState } from "react";
import Logo from "../assets/img/logo_sso.png";
// @ts-ignore
import { useNavigate } from "react-router-dom";
// import { useAuth } from '../utils/authService';
import { useUserStore } from "../utils/authService";
// @ts-ignore
const { REACT_APP_GOOGLE_CLIENT_ID } = import.meta.env;

function Login() {
  const navigate = useNavigate();
  //const { withCredential,withGoogle,isLoading,message,user,isAuthenticated } = useAuth();
  const { withCredential, withGoogle, message, user, isAuthenticated } =
    useUserStore((state) => state);
  const [form, setForm] = useState({ username: "", password: "" });
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showSSOForm, setShowSSOForm] = useState(false);
  const [showVoucherForm, setShowVoucherForm] = useState(false);

  useEffect(() => {
    setForm({ username: "", password: "" });
  }, [showStudentForm, showSSOForm, showVoucherForm]);

  const onChange = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const authenticateCredential = async (e) => {
    try {
      e.preventDefault();
      const { username, password } = form;
      await withCredential(username, password);
      //  if(user?.user?.group_id == 1){
      //    navigate('/aisp',{ replace: true })
      //  } else if(user?.user?.group_id == 3){
      //    navigate('/dash',{ replace: true })
      //  } else {
      //    navigate('/dash',{ replace: true })
      //  }
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const authenticateGoogle = async (response) => {
    try {
      const { profileObj: profile } = response;
      if (profile) {
        await withGoogle(profile.googleId, profile.email);
        navigate("/dash", { replace: true });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const errorGoogle = async (response) => {
    // const { type } = response;
    // if(type == 'error') {
    //    console.log(response)
    // }
  };

  // useEffect(() => {
  //    if(isAuthenticated()) navigate('/dash')
  // },[])

  return (
    <div className="w-full h-full bg-primary">
      <main className="mx-auto h-screen w-full md:max-w-7xl flex flex-col justify-center md:flex-row">
        <section className="px-4 py-20 md:py-8 flex-1 md:flex flex-col items-center justify-center md:items-start md:justify-start md:space-y-28">
          <div>
            {/* <img src={Logo} alt="" className="h-[6.5rem]"/> */}
            <img src={Logo} alt="" className="md:h-[6.5rem]" />
          </div>
          <div className="md:pl-10 text-white space-y-10">
            <h2 className="px-4 py-2 md:text-4xl font-bold rounded-md bg-primary-dark/70 text-slate-50 tracking-wider">
              SYSTEM UNDER MAINTENANCE
            </h2>
            <p className="text-xl font-semibold">
              We will get back to you soon...
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
