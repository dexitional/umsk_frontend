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

function AISPNoticeCard({ id, title, content, date }: Props) {
  return (
    <Link
      to={`/nss/notices/${id}`}
      className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center space-x-4"
    >
      <div className="h-10 w-10 shrink-0 rounded-lg bg-primary-accent/10 flex items-center justify-center">
        <FcViewDetails className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col space-y-0.5">
        <h1 className="text-sm font-semibold text-primary truncate">{title}</h1>
        <p className="text-xs text-slate-400 line-clamp-1">
          {content}
        </p>
      </div>
      <span className="shrink-0 text-[0.65rem] text-slate-400 tracking-wider">
        {moment(date).format("MMM DD, YY")}
      </span>
    </Link>
  );
}

export default AISPNoticeCard;
