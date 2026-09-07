import React from "react";
import { BiDownload } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useUserStore } from "../../utils/authService";

type Props = {
  data: any;
};

function NSSProfileCard({ data }: Props) {
  const user = useUserStore((state) => state.user);

  return (
    <div className="relative pt-6 bg-white border shadow-lg md:border-blue-950/60 rounded-xl flex flex-col items-center justify-center space-y-2 md:space-y-6 text-center group overflow-hidden">
      <div className="relative w-4/5 md:w-52 h-52 bg-[#d4dbe0] rounded-xl overflow-hidden">
        <img
          className="w-full h-full md:w-52 md:h-52 object-cover object-top"
          src={`https://cdn.ucc.edu.gh/photos/?tag=${user.user?.tag}`}
        />
      </div>
      <div className="px-3 space-y-1">
        <h1 className="text-zinc-500 leading-5 md:font-medium text-base capitalize">
          {user?.user?.fname?.toLowerCase()}{" "}
          {user?.user?.mname && user?.user?.mname?.toLowerCase() + " "}
          {user?.user?.lname?.toLowerCase()}
        </h1>
        <p className="leading-5 text-sm text-blue-950/60 font-medium capitalize">
          {data?.department?.toLowerCase()}
        </p>
      </div>
      <button className="px-4 py-2 bg-blue-950/80 text-white border shadow-lg rounded-md font-semibold tracking-wider flex items-center justify-center space-x-2">
        <BiDownload className="h-6 w-5" />
        <span className="text-sm">NSS Appointment Form</span>
      </button>
      {/* <div className="px-4 py-1 bg-red-700 text-white border shadow-lg rounded-md font-semibold tracking-wider">Completed NSS</div> */}
      {/* <div className="px-4 py-1 bg-[#01A4A6] text-white border shadow-lg rounded-md font-semibold tracking-wider">LOGOUT</div> */}
      <Link
        to={`profile/${user?.user?.tag}/edit`}
        className="p-2.5 md:p-4 w-full bg-green-600 md:bg-blue-950/60 flex items-center justify-center space-x-3"
      >
        <FiEdit className="md:h-5 md:w-5 text-white" />
        <span className="text-white text-sm md:text-base font-medium tracking-wider">
          Update NSS Profile
        </span>
      </Link>
    </div>
  );
}

export default NSSProfileCard;
