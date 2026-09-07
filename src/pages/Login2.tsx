import React, { useEffect, useState } from "react";
import Adinkra2 from "../assets/img/adinkra-bullet.png";
// import Adinkra from '../assets/img/logo/aucc/logo.png'
import Adinkra from "../assets/img/adinkra-bullet.png";
import Logo from "../assets/img/logo_sso.png";
// @ts-ignore
import { FaArrowLeft, FaLock } from "react-icons/fa";
import { FcLock } from "react-icons/fc";
import { ImProfile } from "react-icons/im";
import { MdWarning } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from '../utils/authService';
import { PiStudentBold } from "react-icons/pi";
import { useUserStore } from "../utils/authService";
// @ts-ignore
const { REACT_APP_GOOGLE_CLIENT_ID } = import.meta.env;

function Login() {
  const navigate = useNavigate();
  const {
    withCredential,
    withGoogle,
    forgetPassword,
    message,
    user,
    isAuthenticated,
    loading,
    loginform,
    setLoginform,
  } = useUserStore((state) => state);
  const [form, setForm] = useState({ username: "", password: "" });
  const [fgform, setFgForm] = useState({ tag: "", phone: "" });

  useEffect(() => {
    setForm({ username: "", password: "" });
  }, [loginform]);

  const onChange = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onForgetChange = (e) => {
    e.preventDefault();
    setFgForm({ ...fgform, [e.target.name]: e.target.value });
  };

  const resetPassword = async (e) => {
    try {
      e.preventDefault();
      const { tag, phone } = fgform;
      await forgetPassword(tag, phone);
      // if (await isAuthenticated) window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const authenticateCredential = async (e) => {
    try {
      e.preventDefault();
      const { username, password } = form;
      await withCredential(username, password);
      if (await isAuthenticated) window.location.reload();
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
        <section className="md:py-8 flex-1 hidden md:flex flex-col items-start justify-start md:space-y-28">
          <div>
            {/* <img src={Logo} alt="" className="h-[6.5rem]"/> */}
            <img src={Logo} alt="" className="h-[6.5rem]" />
          </div>
          <div className="pl-10 text-white space-y-10">
            <h2 className="px-4 py-0.5 text-[1.1rem] font-bold rounded-md bg-primary-dark/70 text-slate-50 tracking-wider">
              All Services in One location for Easy access.
            </h2>
            <ul className="space-y-4 text-white">
              <li className="flex items-center space-x-4">
                <img src={Adinkra2} alt="" className="h-4" />
                <span className="text-[1.1rem] font-semibold">
                  Easy access to Admission Management System.
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <img src={Adinkra2} alt="" className="h-4" />
                <span className="text-[1.1rem] font-semibold">
                  Easy access to Academic Management System.
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <img src={Adinkra2} alt="" className="h-4" />
                <span className="text-[1.1rem] font-semibold">
                  Easy access to Financial Management System.
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <img src={Adinkra2} alt="" className="h-4" />
                <span className="text-[1.1rem] font-semibold">
                  Easy access to Election Management System.
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <img src={Adinkra2} alt="" className="h-4" />
                <span className="text-[1.1rem] font-semibold">
                  Easy access to Student Portal Services.
                </span>
              </li>

              {/* <li className="flex items-center space-x-2">
                        <img src={Adinkra} alt="" className="h-4"/>
                        <span className="text-[1.2rem] font-bold">Easy access to Helpdesk & Support Management Services.</span>
                    </li>
                    <li className="flex items-center space-x-2">
                        <img src={Adinkra} alt="" className="h-4"/>
                        <span className="text-[1.2rem] font-bold">Easy access to UCC Artificial Intelligence ( AI )</span>
                    </li> */}
            </ul>
          </div>
        </section>
        <section className="mx-2 my-1 py-2 shadow rounded-t-xl border-[3px] border-primary/20 backdrop-blur-lg bg-primary-dark/50 bg-[url('./assets/img/eagle.png')] bg-no-repeat bg-bottom flex md:hidden items-center justify-center">
          <img src={Logo} alt="" className="h-10 w-fit" />
        </section>
        <section className="m-2 my-1 md:my-10 md:mx-4 md:w-[28rem] rounded-b-xl md:rounded-xl border-[3px] border-primary-dark/20 backdrop-blur-lg bg-primary bg-[url('./assets/img/eagle.png')] bg-no-repeat bg-bottom flex flex-col justify-between overflow-y-scroll scrollbar-hide">
          <div className="p-6 flex-1 flex flex-col items-center">
            {/* <h1 className="my-4 md:my-10 text-3xl md:text-4xl text-white">Unified Portal</h1> */}
            <img
              src={Adinkra}
              alt=""
              className="mt-20 p-2 h-22 md:h-24 rounded-md border-2 border-dashed opacity-40 shadow-lg -rotate-45 "
            />
            <div className="my-6 md:my-14 w-full space-y-8">
              {/* Buttons */}
              <div
                className={`${
                  loginform ? "hidden" : "flex"
                } mx-auto md:w-[90%] flex-col space-y-4`}
              >
                {/* <GoogleLogin
                            clientId={ REACT_APP_GOOGLE_CLIENT_ID }
                            render={renderProps => (
                              <button onClick={renderProps.onClick} disabled={renderProps.disabled} className={`${showStudentForm || showSSOForm ? 'hidden':'flex'} py-2.5 px-4 md:px-6 w-full flex items-center space-x-4 shadow rounded bg-white font-bold tracking-wider`}>
                                <FcGoogle className="h-6 w-6"/>
                                <span className="text-sm md:text-base">Sign In with MLK Staff Email</span>
                              </button>
                            )}
                            onSuccess={authenticateGoogle}
                            onFailure={errorGoogle}
                            cookiePolicy={'single_host_origin'}
                            hostedDomain={'ucc.edu.gh'}
                        /> */}

                {/* <GoogleLogin
                           onSuccess={authenticateGoogle}
                            onError={() => errorGoogle}
                            hosted_domain={'aucb.edu.gh'}
                            auto_select={true}
                            ux_mode="redirect"
                            // ux_mode="popup"
                            // redirect_uri="https:// - for popup"
                      /> */}
                <button
                  onClick={async () => await setLoginform("voucher")}
                  className={`${
                    loginform ? "hidden" : "flex"
                  }  py-2.5 px-4 md:px-6 w-full flex items-center space-x-4 shadow rounded bg-white font-bold tracking-wider`}
                >
                  <PiStudentBold className="h-6 w-6 text-primary-dark" />
                  <span className="text-sm md:text-base text-primary-dark">
                    Apply with Admission Voucher
                  </span>
                </button>
                <button
                  onClick={async () => await setLoginform("staff")}
                  className={`${
                    loginform ? "hidden" : "flex"
                  } py-2.5 px-4 md:px-6 w-full flex items-center space-x-4 shadow rounded bg-primary-accent/90 font-bold tracking-wider`}
                >
                  <FcLock className="h-6 w-6" />
                  <span className="text-sm md:text-base">
                    Sign In with Staff Credentials
                  </span>
                </button>
                <button
                  onClick={async () => await setLoginform("student")}
                  className={`${
                    loginform ? "hidden" : "flex"
                  } py-2.5 px-4 md:px-6 w-full flex items-center space-x-4 shadow rounded bg-primary-accent/90 font-bold tracking-wider`}
                >
                  <ImProfile className="h-6 w-6 text-primary-dark" />
                  <span className="text-sm md:text-base">
                    Sign In with Student Access
                  </span>
                </button>
              </div>

              {/* Login Form */}
              { loginform && ['student','voucher','staff'].includes(loginform) &&
              <form
                onSubmit={authenticateCredential}
                className={`${
                  loginform ? "flex" : "hidden"
                } mx-auto py-4 px-3 md:p-4 md:w-[90%] rounded-xl border-[3px] border-primary-dark/30 bg-primary flex-col space-y-4 text-white text-lg`}
              >
                <div className="shadow bg-white/10 rounded-md flex items-center justify-between overflow-hidden">
                  <h1 className="px-4 py-1 text-lg text-amber-100 font-semibold tracking-widest">
                    {loginform == "student"
                      ? "STUDENT LOGIN"
                      : loginform == "voucher"
                      ? "APPLICANT LOGIN"
                      : "STAFF LOGIN"}
                  </h1>
                  <div className="relative opacity-50">
                    <img src={Adinkra} alt="" className="h-10" />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    name={`username`}
                    value={form.username}
                    onChange={onChange}
                    placeholder={`${
                      ["voucher"].includes(loginform) ? "Serial" : "Username"
                    }`}
                    className="px-4 py-2 w-full text-border-primary/20 font-medium rounded-md border-2 border-primary/20 focus:border-primary/20 bg-primary-dark/30 focus:ring-0 focus:outline-none  placeholder:text-base md:placeholder:text-base placeholder:text-white/50 placeholder:tracking-widest placeholder:uppercase"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    name={`password`}
                    value={form.password}
                    onChange={onChange}
                    placeholder={`${
                      loginform == "voucher" ? "Pin" : "Password"
                    }`}
                    className="px-4 py-2 w-full text-border-blue-50/20 font-medium rounded-md border-2 border-primary/20 focus:border-primary/20 bg-primary-dark/30 focus:ring-0 focus:outline-none  placeholder:text-base md:placeholder:text-base placeholder:text-white/50 placeholder:tracking-widest placeholder:uppercase"
                  />
                </div>

                {/* Message */}
                {message ? (
                  <div
                    className={`${
                      message ? "flex items-center" : "hidden"
                    } p-3 md:px-4 mx-auto md:w-full space-x-2 md:space-x-4 shadow rounded-lg backdrop-blur-sm bg-white/80 bg-opacity-80`}
                  >
                    <MdWarning className="md:h-5 md:w-5 text-amber-800" />
                    <p className="text-sm md:text-base font-semibold text-amber-900">
                      Sorry! check your credentials.
                    </p>
                  </div>
                ) : null}

                <button
                  disabled={loading}
                  type="submit"
                  className={`py-2.5 px-4 md:px-10 w-full flex items-center justify-center space-x-4 shadow rounded ${
                    loading ? "bg-primary-accent/10" : "bg-primary-accent/90"
                  } font-bold tracking-wider`}
                >
                  {loading ? (
                    <>
                      <FaLock className="h-4 w-4 text-gray-200" />
                      <span className="text-sm md:text-sm text-gray-300 uppercase animate-pulse">
                        Authenticating ...
                      </span>
                    </>
                  ) : (
                    <>
                      <FaLock className="h-4 w-4 text-gray-800" />
                      <span className="text-sm md:text-base text-gray-800 uppercase">
                        Sign In
                      </span>
                    </>
                  )}
                </button>
                <div className="flex items-center space-x-2 justify-center">
                  <button
                    disabled={loading}
                    onClick={async () => await setLoginform("forget")}
                    className="py-1 px-2 w-fit rounded-xl focus:ring-0 focus:outline-none "
                  >
                    <span className="text-xs font-medium text-white/80 underline underline-offset-4">
                      Forgot Password
                    </span>
                  </button>
                  <button
                    disabled={loading}
                    onClick={async () => await setLoginform("")}
                    className="py-1 px-4 w-fit rounded-xl bg-primary-dark/70 focus:ring-0 focus:outline-none flex items-center space-x-2"
                  >
                    <FaArrowLeft className="w-3 h-3 text-white/60" />
                    <span className="text-sm font-bold text-white/60">
                      Go Back
                    </span>
                  </button>
                </div>
              </form>
              }

              {/* Forget Passord Form */}
              { loginform && ['forget'].includes(loginform) &&
              <form
                 onSubmit={resetPassword}
                className={`${
                  loginform ? "flex" : "hidden"
                } mx-auto py-4 px-3 md:p-4 md:w-[90%] rounded-xl border-[3px] border-primary-dark/30 bg-primary flex-col space-y-4 text-white text-lg`}
              >
                <div className="shadow bg-white/10 rounded-md flex items-center justify-between overflow-hidden">
                  <h1 className="px-4 py-1 text-lg text-amber-100 font-semibold tracking-widest">FORGET PASSWORD</h1>
                  <div className="relative opacity-50">
                    <img src={Adinkra} alt="" className="h-10" />
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    name={`tag`}
                    value={fgform.tag}
                    onChange={onForgetChange}
                    placeholder={`Username`}
                    className="px-4 py-2 w-full text-border-primary/20 font-medium rounded-md border-2 border-primary/20 focus:border-primary/20 bg-primary-dark/30 focus:ring-0 focus:outline-none  placeholder:text-base md:placeholder:text-base placeholder:text-white/50 placeholder:tracking-widest placeholder:uppercase"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name={`phone`}
                    value={fgform.phone}
                    onChange={onForgetChange}
                    placeholder={`User Phone Number`}
                    className="px-4 py-2 w-full text-border-blue-50/20 font-medium rounded-md border-2 border-primary/20 focus:border-primary/20 bg-primary-dark/30 focus:ring-0 focus:outline-none  placeholder:text-base md:placeholder:text-base placeholder:text-white/50 placeholder:tracking-widest placeholder:uppercase"
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className={`py-2.5 px-4 md:px-10 w-full flex items-center justify-center space-x-4 shadow rounded ${
                    loading ? "bg-primary-accent/10" : "bg-primary-accent/90"
                  } font-bold tracking-wider`}
                >
                  {loading ? (
                    <>
                      <FaLock className="h-4 w-4 text-gray-200" />
                      <span className="text-sm md:text-sm text-gray-300 uppercase animate-pulse">
                        Submitting ...
                      </span>
                    </>
                  ) : (
                    <>
                      <FaLock className="h-4 w-4 text-gray-800" />
                      <span className="text-sm md:text-base text-gray-800 uppercase">RESET ACCOUNT</span>
                    </>
                  )}
                </button>
                <button
                  disabled={loading}
                  onClick={async () => await setLoginform("")}
                  className="py-1 px-4 mx-auto w-fit rounded-xl bg-primary-dark/70 focus:ring-0 focus:outline-none flex items-center space-x-2"
                >
                  <FaArrowLeft className="w-3 h-3 text-white/60" />
                  <span className="text-sm font-bold text-white/60">
                    Go Back
                  </span>
                </button>
              </form>
              }

            </div>
             {/* Privacy Policy Link */}
             <Link
                  to="/mobile"
                  className="block w-full py-2 px-4 text-center text-white/90 hover:text-white underline underline-offset-4 text-sm transition-colors"
                >
                  Get Student Mobile App
                </Link>
          </div>
          <div className="h-14 w-full flex items-center justify-center">
            <p className="text-white text-xs font-medium">
              Copyright &copy; {new Date().getFullYear()} AUCB
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
