import React from "react";
// @ts-ignore
import moment from "moment";
import { TbMessage2Check } from "react-icons/tb";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { Link } from "react-router-dom";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function NoticeListItem({ data }: Props) {
  return (
    <div className="px-4 md:px-6 py-4 grid md:grid-cols-7 gap-3 md:gap-4 md:items-center border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors">
      <div className="md:col-span-4 flex flex-col space-y-1.5">
        <ListHeading title="Title" />
        <div className="flex items-center space-x-3 min-w-0">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-primary-accent/10 flex items-center justify-center">
            <TbMessage2Check className="h-4 w-4 text-primary-accent" />
          </div>
          <span className="text-sm font-medium text-primary truncate">{data?.subject}</span>
        </div>
      </div>
      <div className="flex flex-col space-y-1.5">
        <ListHeading title="Reference" />
        <span className="text-sm text-slate-500 capitalize">{data?.letter_no?.toUpperCase()}</span>
      </div>
      <div className="flex flex-col space-y-1.5">
        <ListHeading title="Date" />
        <span className="text-sm text-slate-500">
          {data?.created_at && moment(data?.created_at).format("MMM DD, YYYY")}
        </span>
      </div>
      <div className="flex flex-col space-y-1.5 md:items-end">
        <ListHeading title="Action" />
        <Link
          to={`${data?.id}`}
          className="h-8 w-8 rounded-lg bg-primary-accent/10 flex items-center justify-center hover:bg-primary-accent/20 transition-colors"
        >
          <FaEnvelopeOpenText className="h-4 w-4 text-primary-accent" />
        </Link>
      </div>
    </div>
  );
}

export default NoticeListItem;
