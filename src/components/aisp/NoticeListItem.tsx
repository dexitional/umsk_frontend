import React from "react";
// @ts-ignore
import moment from "moment";
import { HiOutlineArrowUpRight, HiOutlineMegaphone } from "react-icons/hi2";
import { Link } from "react-router-dom";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function NoticeListItem({ data }: Props) {
  return (
    <div className="aisp-row grid-cols-2 md:grid-cols-7">
      <div className="col-span-2 md:col-span-4 flex flex-col gap-1.5">
        <ListHeading title="Title" />
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 shrink-0 rounded-xl bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100 flex items-center justify-center">
            <HiOutlineMegaphone className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-slate-800 truncate">{data?.subject}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <ListHeading title="Reference" />
        <span className="text-xs font-mono text-slate-500">{data?.letter_no?.toUpperCase()}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <ListHeading title="Date" />
        <span className="text-sm text-slate-500">
          {data?.created_at && moment(data?.created_at).format("MMM DD, YYYY")}
        </span>
      </div>
      <div className="flex flex-col gap-1.5 md:items-end">
        <ListHeading title="Action" />
        <Link
          to={`${data?.id}`}
          className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-sky-100 hover:text-sky-700 transition-colors"
        >
          <HiOutlineArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default NoticeListItem;
