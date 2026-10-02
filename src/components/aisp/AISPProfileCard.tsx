import React from "react";
import { HiCheckBadge, HiOutlinePencilSquare, HiOutlinePrinter } from "react-icons/hi2";
import { Link } from "react-router-dom";
import Logo from "../../assets/img/logo.webp";
import { useUserStore } from "../../utils/authService";
import { AISPCrest, AISPPhotoBlend } from "./AISPPhotoBlend";

const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
};

// Digital student ID shown beside the dashboard.
function AISPProfileCard({ data }: Props) {
  const user = useUserStore((state) => state.user);
  const fullName = [user?.user?.fname, user?.user?.mname, user?.user?.lname]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const year = Math.ceil(data?.semesterNum / 2);

  return (
    <div className="aisp-rise aisp-card overflow-hidden" style={{ animationDelay: "120ms" }}>
      {/* Card face */}
      <div className="relative px-5 pt-5 pb-16 bg-gradient-to-br from-secondary via-primary to-sky-700 text-white overflow-hidden">
        <AISPPhotoBlend photo="gate" fade="none" className="opacity-[0.35]" />
        <AISPCrest className="-right-6 -bottom-10 h-36 opacity-[0.16] mix-blend-luminosity" />
        <div className="pointer-events-none absolute inset-0 aisp-grid opacity-70" />
        <div className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-sky-400/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-indigo-400/30 blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 p-1 rounded-lg bg-white/95 shadow">
              <img src={Logo} alt="" className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-sky-200">Student ID</span>
              <span className="block text-xs font-bold tracking-wide">AKATSICO</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-400/[0.15] text-emerald-200 ring-1 ring-inset ring-emerald-300/30 text-[0.6rem] font-bold uppercase tracking-wider">
            {data?.completeStatus ? "Completed" : "Active"}
          </span>
        </div>
      </div>

      {/* Photo + identity */}
      <div className="relative px-5 -mt-12">
        <div className="h-24 w-24 rounded-3xl p-1 bg-white shadow-xl shadow-slate-900/10">
          <img
            className="h-full w-full rounded-[1.25rem] object-cover object-top bg-slate-100"
            crossOrigin="anonymous"
            alt=""
            src={`${REACT_APP_API_URL}/auth/photos/?tag=${user?.user?.tag}`}
          />
        </div>
      </div>

      <div className="px-5 pt-3 pb-5 space-y-5">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-extrabold text-slate-900 capitalize leading-tight tracking-tight">{fullName}</h2>
            <HiCheckBadge className="h-5 w-5 text-sky-500 shrink-0" />
          </div>
          <p className="mt-1 text-sm text-slate-500 capitalize leading-snug">
            {data?.program?.longName?.toLowerCase() || "Programme not set"}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Student No.", value: user?.user?.tag },
            { label: "Level", value: year ? `Year ${year}` : "Completed" },
            { label: "Index No.", value: data?.indexno || "Not Set", wide: true },
          ].map((item) => (
            <div key={item.label} className={`p-3 rounded-2xl bg-slate-50 ring-1 ring-inset ring-slate-100 ${item.wide ? "col-span-2" : ""}`}>
              <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-slate-400">{item.label}</dt>
              <dd className="mt-0.5 text-sm font-bold text-slate-800 truncate">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="grid grid-cols-2 gap-2.5">
          <Link to={`/aisp/profile/${encodeURIComponent(user?.user?.tag)}/edit`} className="aisp-btn-primary">
            <HiOutlinePencilSquare className="h-4 w-4" />
            Update
          </Link>
          <Link to="/print/registration" className="aisp-btn-soft">
            <HiOutlinePrinter className="h-4 w-4" />
            Reg. Slip
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AISPProfileCard;
