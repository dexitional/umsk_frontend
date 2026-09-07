import React from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import Adinkra2 from "../../assets/img/adinkra-bullet.png";
// @ts-ignore
import Logo from "../../assets/img/logo_sso.png";
// @ts-ignore
import { FaDownload, FaApple, FaAndroid } from "react-icons/fa";
// @ts-ignore
const { REACT_APP_API_URL } = import.meta.env;

function MobileLanding() {
  return (
    <div className="w-full h-full bg-primary">
      <main className="mx-auto h-screen w-full md:max-w-7xl flex flex-col justify-center md:flex-row">
        {/* Desktop Section */}
        <section className="md:py-8 flex-1 hidden md:flex flex-col items-start justify-start md:space-y-28">
          <div>
            <img src={Logo} alt="" className="h-[6.5rem]" />
          </div>
          <div className="pl-10 text-white space-y-10">
            <h2 className="px-4 pt-0.5 pb-1 text-[1.1rem] font-noto font-bold rounded-md bg-primary-dark/70 text-slate-50 tracking-wider">
              Student Mobile App - Access Student Services On The Go
            </h2>
            <ul className="space-y-4 text-white">
              <li className="flex items-center space-x-4">
                <img src={Adinkra2} alt="" className="h-4" />
                <span className="text-[1.1rem] font-semibold">
                  Access academic records and results
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <img src={Adinkra2} alt="" className="h-4" />
                <span className="text-[1.1rem] font-semibold">
                  Check financial statements and payments
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <img src={Adinkra2} alt="" className="h-4" />
                <span className="text-[1.1rem] font-semibold">
                  View course registration and schedules
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <img src={Adinkra2} alt="" className="h-4" />
                <span className="text-[1.1rem] font-semibold">
                  Receive important notifications
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <img src={Adinkra2} alt="" className="h-4" />
                <span className="text-[1.1rem] font-semibold">
                  Easy access to student services
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Mobile Header */}
        <section className="mx-2 my-1 py-2 shadow rounded-t-xl border-[3px] border-primary/20 backdrop-blur-lg bg-primary-dark/50 bg-[url('./assets/img/eagle.png')] bg-no-repeat bg-bottom flex md:hidden items-center justify-center">
          <img src={Logo} alt="" className="h-10 w-fit" />
        </section>

        {/* Mobile Content */}
        <section className="m-2 my-1 md:my-10 md:mx-4 md:w-[28rem] rounded-b-xl md:rounded-xl border-[3px] border-primary-dark/20 backdrop-blur-lg bg-primary bg-[url('./assets/img/eagle.png')] bg-no-repeat bg-bottom flex flex-col justify-between overflow-y-scroll scrollbar-hide">
          <div className="p-6 flex-1 flex flex-col items-center">
            <img
              src={Adinkra2}
              alt=""
              className="mt-20 p-2 h-22 md:h-24 rounded-md border-2 border-dashed opacity-40 shadow-lg -rotate-45"
            />
            <div className="my-6 md:my-14 w-full space-y-8">
              <div className="mx-auto md:w-[90%] flex-col space-y-4">
                <h1 className="text-center text-2xl md:text-3xl text-white font-bold tracking-wider">
                  Student Mobile App
                </h1>
                <p className="text-center text-white/80 text-sm md:text-base">
                  Download our mobile app for easy access to student services
                </p>
              </div>

              {/* Download Buttons */}
              <div className="mx-auto md:w-[90%] flex-col space-y-4">
                {/* Android Download */}
                <a href={`${REACT_APP_API_URL}/auth/mobile`} target="_blank" className="w-full py-3 px-6 flex items-center justify-center space-x-4 shadow rounded-lg bg-white font-bold tracking-wider hover:bg-gray-50 transition-colors">
                  <FaAndroid className="h-6 w-6 text-gray-800" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-600">Download for</span>
                    <span className="text-base md:text-lg text-gray-800 font-semibold">Android</span>
                  </div>
                  <FaDownload className="h-5 w-5 text-gray-600 ml-auto" />
                </a>
                {/* iOS Download */}
                <a href={`${REACT_APP_API_URL}/auth/mobile?type=ios`} target="_blank" className="w-full py-3 px-6 flex items-center justify-center space-x-4 shadow rounded-lg bg-white font-bold tracking-wider hover:bg-gray-50 transition-colors">
                  <FaApple className="h-6 w-6 text-gray-800" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-gray-600">Coming soon for</span>
                    <span className="text-base md:text-lg text-gray-800 font-semibold">iOS</span>
                  </div>
                  <FaDownload className="h-5 w-5 text-gray-600 ml-auto" />
                </a>

                <div className="flex flex-col -space-y-2">
                 {/* Privacy Policy Link */}
                 <Link
                    to="/mobile/privacy"
                    className="block w-full py-2 px-4 text-center text-white/90 hover:text-white underline underline-offset-4 text-sm transition-colors"
                  >
                    View Privacy Policy
                  </Link>
                  {/* Privacy Policy Link */}
                  <Link to="/login" className="block w-full py-2 px-4 text-center text-white/40 hover:text-white underline underline-offset-4 text-sm transition-colors">
                    Goto portal login
                  </Link>
                </div>
               
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="h-14 w-full flex items-center justify-center">
            <p className="text-white text-xs font-medium">Copyright &copy; {new Date().getFullYear()} AUCB</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MobileLanding;