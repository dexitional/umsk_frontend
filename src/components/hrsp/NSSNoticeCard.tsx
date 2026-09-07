import moment from "moment";
import React from "react";
import { FcViewDetails } from "react-icons/fc";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  content: string;
  date: string;
  id: string;
};

function NSSNoticeCard({ id, title, content, date }: Props) {
  return (
    <Link
      to={`/nss/notices/${id}`}
      className="p-4 rounded-lg shadow flex space-x-4 bg-gradient-to-r from-blue-50 via-blue-50"
    >
      <div className="flex flex-col space-y-1 md:space-y-2">
        <span className="text-[0.65rem] md:text-xs text-gray-400 tracking-wider italic">
          {moment(date).format("MMM DD,YY")}
        </span>
        <button className="p-2 w-fit h-fit border-4 border-slate-100 bg-white rounded-full flex items-center justify-center">
          <FcViewDetails className="h-4 w-4 md:h-6 md:w-6" />
        </button>
      </div>
      <div className="flex flex-col space-y-1 md:space-y-2">
        <h1 className="font-semibold text-gray-500 md:line-clamp-1">{title}</h1>
        <p className="text-xs md:text-sm text-gray-500 line-clamp-1">
          {content}
        </p>
      </div>
    </Link>
  );
}

export default NSSNoticeCard;
