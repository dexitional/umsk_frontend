import React from "react";
import { FaPrint } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useUserStore } from "../../utils/authService";

type Props = {
  data: any;
};

function AISPProfileCard({ data }: Props) {
  const user = useUserStore((state) => state.user);

  return (
    <div className="relative pt-6 pb-6 px-4 bg-white border border-slate-100 shadow-sm rounded-2xl flex flex-col items-center justify-center space-y-4 text-center group overflow-hidden">
      <div className="relative w-4/5 md:w-40 aspect-square bg-slate-100 rounded-xl overflow-hidden">
        <img
          className="w-full h-full object-cover object-top"
          src={`https://cdn.ucc.edu.gh/photos/?tag=${user?.user?.tag}`}
        />
      </div>
      <div className="space-y-1">
        <h1 className="text-primary font-semibold text-sm capitalize">
          {user?.user?.fname?.toLowerCase()}{" "}
          {user?.user?.mname && user?.user?.mname?.toLowerCase() + " "}
          {user?.user?.lname?.toLowerCase()}
        </h1>
        <p className="text-xs text-slate-400 font-medium capitalize">
          {data?.program?.longName?.toLowerCase()}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="px-2.5 py-1 rounded-full bg-primary-accent/10 text-primary-accent text-xs font-semibold">
            STUDENT NO: {user?.user?.tag}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            INDEX: {data?.indexno || "Not Set"}
          </span>
        </div>
      </div>
      <Link
        to="/print/registration"
        className="w-full px-4 py-2.5 bg-primary-accent/10 text-primary-accent rounded-lg font-semibold text-xs flex items-center justify-center space-x-2 hover:bg-primary-accent/20 transition-colors"
      >
        <FaPrint className="h-4 w-4" />
        <span>Semester Registration Slip</span>
      </Link>
      <Link
        to={`/aisp/profile/${encodeURIComponent(user?.user?.tag)}/edit`}
        className="w-full px-4 py-2.5 bg-primary text-white rounded-lg font-semibold text-xs flex items-center justify-center space-x-2 hover:bg-primary/90 transition-colors"
      >
        <FiEdit className="h-4 w-4" />
        <span>Update Student Profile</span>
      </Link>
    </div>
  );
}

export default AISPProfileCard;
