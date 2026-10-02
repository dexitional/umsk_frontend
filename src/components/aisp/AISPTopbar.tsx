import moment from "moment";
import React from "react";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineArrowUturnLeft,
  HiOutlineBars3,
  HiOutlineCalendarDays,
  HiOutlineSquaresPlus,
} from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";
import { AISP_NAV } from "./AISPNav";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  user: any;
  impersonating: boolean;
  onMenu: () => void;
  onSignout: () => void;
  onSwitchBack: (e: React.MouseEvent) => void;
};

// Longest nav url that prefixes the current path wins, so nested pages
// (e.g. /aisp/services/12/edit) still show their section's title.
function useSectionTitle() {
  const { pathname } = useLocation();
  const match = AISP_NAV.flatMap((g) => g.items)
    .filter((item) => pathname.startsWith(item.url))
    .sort((a, b) => b.url.length - a.url.length)[0];
  return match?.title || "Student Portal";
}

function AISPTopbar({ user, impersonating, onMenu, onSignout, onSwitchBack }: Props) {
  const title = useSectionTitle();
  const name = [user?.user?.fname, user?.user?.lname].filter(Boolean).join(" ").toLowerCase();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div className="h-16 px-4 md:px-8 flex items-center gap-3">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="lg:hidden h-10 w-10 -ml-1 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <HiOutlineBars3 className="h-6 w-6" />
        </button>

        <div className="flex-1 min-w-0">
          <span className="hidden sm:block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Student Portal
          </span>
          <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight truncate">{title}</h1>
        </div>

        <div className="hidden md:flex items-center gap-2 h-10 px-3.5 rounded-xl bg-slate-100/80 text-slate-500 text-xs font-semibold">
          <HiOutlineCalendarDays className="h-4 w-4" />
          {moment().format("ddd, MMM D YYYY")}
        </div>

        {impersonating ? (
          <button
            onClick={onSwitchBack}
            title="Return to your account"
            className="h-10 px-3 rounded-xl flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-semibold ring-1 ring-inset ring-amber-200 hover:bg-amber-100 transition-colors"
          >
            <HiOutlineArrowUturnLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Exit view</span>
          </button>
        ) : null}

        <Link
          to="/dash"
          title="All apps"
          className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
        >
          <HiOutlineSquaresPlus className="h-5 w-5" />
        </Link>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <img
            src={`${REACT_APP_API_URL}/auth/photos/?tag=${user?.user?.tag}`}
            alt=""
            className="h-9 w-9 rounded-xl object-cover bg-slate-100 ring-2 ring-white shadow"
          />
          <div className="hidden xl:block leading-tight">
            <span className="block text-sm font-semibold text-slate-800 capitalize">{name}</span>
            <span className="block text-[0.7rem] text-slate-400">{user?.user?.tag}</span>
          </div>
          <button
            onClick={onSignout}
            title="Log out"
            className="lg:hidden h-10 w-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default AISPTopbar;
