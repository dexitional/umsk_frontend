import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImPlus } from "react-icons/im";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  createtext?: string;
  createlink?: string;
  setView: (arg: string) => void;
  view: string;
};

function PageTitle({ title, createtext, createlink, setView, view }: Props) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-sm md:text-xl text-primary/70 font-medium uppercase tracking-widest">
        {title}
      </h1>
      <div className="flex items-center space-x-2">
        <div></div>
        {view ? (
          <div className="p-1 rounded border md:border-2 flex items-center space-x-1">
            <button
              onClick={() => setView("list")}
              className={`${
                view == "list" ? "bg-slate-200" : "bg-slate-50"
              } md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}
            >
              <GiHamburgerMenu className="h-5 w-5 text-gray-500" />
            </button>
            <button
              onClick={() => setView("card")}
              className={`${
                view == "card" ? "bg-slate-200" : "bg-slate-50"
              } md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}
            >
              <MdDashboard className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        ) : null}

        {createlink && createtext ? (
          <Link
            to={createlink || "#"}
            className="py-2 px-3 md:px-4 h-9 md:h-11 rounded-md border bg-blue-950/70 flex items-center space-x-3"
          >
            <ImPlus className="text-white h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:flex text-white text-sm md:text-base font-medium">
              {createtext}
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default PageTitle;
