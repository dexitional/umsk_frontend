import React from "react";
import { FaPrint } from "react-icons/fa6";
import { FiHash, FiUser } from "react-icons/fi";
import { HiCheckBadge } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useUserStore } from "../../utils/authService";

const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
};

const UPDATE_PROFILE_LABEL = "Update Profile";
const NBSP = " ";

function AISPProfileCard({ data }: Props) {
  const user = useUserStore((state) => state.user);

  return (
    <div className="bg-white border border-slate-100 shadow-sm rounded-3xl overflow-hidden font-inter">
      <div className="p-3">
        <div className="relative w-full h-64 bg-slate-100 rounded-2xl overflow-hidden">
          <img
            className="w-full h-full object-cover object-top"
            crossOrigin="anonymous"
            src={`${REACT_APP_API_URL}/auth/photos/?tag=${user?.user?.tag}`}
          />
        </div>
      </div>

      <div className="px-5 pb-5 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-black font-bold text-xl capitalize leading-tight">
              {user?.user?.fname?.toLowerCase()}{" "}
              {user?.user?.mname && user?.user?.mname?.toLowerCase() + " "}
              {user?.user?.lname?.toLowerCase()}
            </h1>
            <HiCheckBadge className="h-5 w-5 text-green-500 shrink-0" />
          </div>
          <p className="text-gray-500 text-sm capitalize leading-snug">
            {data?.program?.longName?.toLowerCase()}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <FiUser className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-800">{user?.user?.tag}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiHash className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-800">{data?.indexno || "Not Set"}</span>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <Link
            to={`/aisp/profile/${encodeURIComponent(user?.user?.tag)}/edit`}
            data-label={UPDATE_PROFILE_LABEL}
            className="btn-3d-letters w-full h-11 text-white rounded-full font-semibold text-xs uppercase tracking-wider flex items-center justify-center"
            style={{ backgroundColor: "hsl(210deg 100% 44%)", boxShadow: "hsl(210deg 87% 36%) 0px 5px 0px 0px" }}
          >
            {UPDATE_PROFILE_LABEL.split("").map((ch, i) => (
              <i key={i} className="letter" style={{ transitionDelay: `${0.03 * i}s` }}>
                {ch === " " ? NBSP : ch}
              </i>
            ))}
          </Link>
          <Link
            to="/print/registration"
            className="w-full flex justify-center gap-2 items-center shadow-xl text-sm bg-gray-50 backdrop-blur-md font-semibold isolation-auto border-gray-50 before:content-[''] before:absolute before:w-full before:transition-all before:duration-700 before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2.5 overflow-hidden border-2 rounded-full group text-gray-700"
          >
            <span>Registration Slip</span>
            <FaPrint className="w-8 h-8 group-hover:rotate-90 group-hover:bg-gray-50 group-hover:border-none text-gray-800 ease-linear duration-300 rounded-full border border-gray-700 p-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AISPProfileCard;
