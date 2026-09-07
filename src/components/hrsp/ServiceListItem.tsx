import React from "react";
// @ts-ignore
import moment from "moment";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { TbMessage2Check } from "react-icons/tb";
import { Link } from "react-router-dom";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function ServiceListItem({ data }: Props) {
  return (
    <div className="px-3 md:px-6 pb-4 grid md:grid-cols-8 gap-y-4 md:gap-y-0 md:gap-x-2 md:place-items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group">
      <div className="md:col-span-4 md:place-self-start flex flex-col space-y-2">
        <ListHeading title="Title" />
        <div className="px-2 flex items-center space-x-3 md:space-x-4">
          <TbMessage2Check className="h-6 w-6" />
          <span>{data?.title}</span>
        </div>
      </div>
      <div className="flex flex-col space-y-2 md:text-center">
        <ListHeading title="Request Type" />
        <span className="px-2 capitalize text-blue-950/90 text-xs font-semibold">
          {data?.type || "NOT SET"}
        </span>
      </div>
      <div className="flex flex-col space-y-2 md:text-center">
        <ListHeading title="Status" />
        <span className="px-2 capitalize text-blue-950/90 text-xs font-semibold">
          {data?.status}
        </span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Created On" />
        <span className="px-2">
          {data?.created_at && moment(data?.created_at).format("MMM DD, YYYY")}
        </span>
      </div>

      <div className="flex flex-col space-y-2">
        <ListHeading title="Action" />
        <div className="px-2 md:ml-6 w-fit flex items-center justify-evenly space-x-2">
          <Link
            to={`${data?.id}`}
            className="p-2 border rounded-full flex items-center space-x-1.5 bg-blue-200/50"
          >
            <FaEnvelopeOpenText className="h-6 w-6 text-blue-950/70" />
            <span className="hidden text-sm text-white font-semibold">
              Edit
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ServiceListItem;
