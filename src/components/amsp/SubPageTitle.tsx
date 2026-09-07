import React from "react";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

type Props = {
  title: string;
  page: string;
  link?: string;
};

function SubPageTitle({ title, page, link }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 md:space-y-0 space-y-2">
        <h1 className="py-0.5 px-2 w-fit bg-slate-100 border-r-8 border-primary/70 rounded-md text-[0.65rem] md:text-xs font-semibold text-primary-dark/70 uppercase">
          {page}
        </h1>
        <h1 className="text-[0.6rem] md:text-lg font-medium text-primary/70 uppercase tracking-wider">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-2">
        <div></div>
        <div className="p-1 rounded border-2 flex items-center space-x-1">
          {link ? (
            <Link
              to={link}
              onClick={() => navigate(-1)}
              className={`bg-slate-200 md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}
            >
              <IoChevronBack className="h-3 w-3 md:h-5 md:w-5 text-gray-500" />
            </Link>
          ) : (
            <button
              onClick={() => navigate(-1)}
              className={`bg-slate-200 md:h-8 md:w-8 h-6 w-6 rounded border flex items-center justify-center`}
            >
              <IoChevronBack className="h-3 w-3 md:h-5 md:w-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubPageTitle;
