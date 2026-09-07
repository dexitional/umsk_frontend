import React from "react";
import { MdEditDocument } from "react-icons/md";
import { Link } from "react-router-dom";
// @ts-ignore
import moment from "moment";
import { FaCalendarCheck, FaCalendarXmark, FaFolder } from "react-icons/fa6";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
};

function ElectionCardItem({ data }: Props) {
  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group">
      <h2 className="text-base md:text-base font-semibold font-noto text-gray-500 uppercase">
        {data?.title?.toUpperCase()}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="w-full flex items-center justify-between space-x-2">
          <div className="flex flex-col space-y-1">
            <div className="text-sm md:text-sm text-primary font-bold font-roboto capitalize">
              {data?.group?.title.toUpperCase()} ELECTIONS
            </div>
            <div className="text-sm md:text-sm text-primary-dark/70 font-bold font-roboto capitalize">
              {data?.type.toUpperCase()}
            </div>
          </div>
          <div className="py-0.5 px-2 text-sm rounded bg-primary/60 text-white font-bold">
            {data?.voterData?.length}
          </div>
        </div>
      </div>
      <div className="space-y-1 font-roboto">
        <div className="flex items-center space-x-4">
          <FaCalendarCheck className="h-4 w-5 text-primary/70" />
          <span className="text-sm text-gray-500 font-semibold">
            {data?.startAt && moment(data?.startAt).format("LLL")}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <FaCalendarXmark className="h-4 w-5 text-primary/70" />
          <span className="text-sm text-gray-500 font-semibold">
            {data?.endAt && moment(data?.endAt).format("LLL")}
          </span>
        </div>
        {/* <div className="flex items-center space-x-4">
            <FaFilePdf className="h-4 w-5 text-primary/70" />
            <Link to={data?.nss_form} className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">Financial Statement</Link>
        </div>
        <div className="flex items-center space-x-4">
            <FaFilePdf className="h-4 w-5 text-primary/70" />
            <Link to={data?.nss_form} className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">Academic Statement</Link>
        </div> */}
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="flex group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`${
                moment(data?.start_date).format("YYYY") ==
                moment().format("YYYY")
                  ? "bg-green-950/60"
                  : "bg-red-950/60"
              } py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              STATUS
            </span>
            <span className="font-semibold font-roboto text-base text-primary/60">
              {data?.action}
            </span>
          </div>
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center space-x-2 group">
          <Link
            to={`${encodeURIComponent(data?.id)}/portfolios`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            {/* <FcViewDetails className="h-4 w-4 text-white"/> */}
            <FaFolder className="h-4 w-4 text-amber-200" />
            <span className="text-sm text-white font-semibold">View</span>
          </Link>
          <Link
            to={`${encodeURIComponent(data?.id)}/edit`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            <MdEditDocument className="h-4 w-4 text-green-200" />
            <span className="text-sm text-white font-semibold">Edit</span>
          </Link>
          {/* <Form method="post" action={`${data?.id}/destroy`} onSubmit={(e)=> { if(!confirm("Do you want to delete")) e.preventDefault(); return false; }} className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary-accent/60">
            <FaTrash className="h-3 w-4 text-pink-100" />
            <button type="submit" className="text-sm text-white font-semibold">Delete</button>
          </Form> */}
          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`bg-primary/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              STATUS
            </span>
            <span className="font-semibold font-roboto text-base text-primary/60">
              {data?.action}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElectionCardItem;
