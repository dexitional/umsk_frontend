import React from "react";
import { FaTrash } from "react-icons/fa";
import { GiClockwork } from "react-icons/gi";
import { MdEditDocument } from "react-icons/md";
import { Form, Link } from "react-router-dom";
// @ts-ignore
import moment from "moment";
import { FaFileInvoiceDollar, FaPeopleGroup } from "react-icons/fa6";
import { IoIosTime } from "react-icons/io";

type Props = {
  data: any;
};

function SessionCardItem({ data }: Props) {
  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group">
      <h2 className="text-base md:text-lg font-semibold font-noto text-gray-500 uppercase">
        {data?.title}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <div className="flex-1 text-xs md:text-xs text-primary-dark/70 font-bold font-roboto capitalize">
            {moment().isAfter(moment(data?.applyEnd))
              ? "CLOSED"
              : data?.applyPause
              ? "PAUSED"
              : "IN-PROGRESS"}
          </div>
          {data?.default && (
            <div className="py-0.5 px-2 w-fit text-xs rounded bg-primary-accent/70 text-white font-bold">
              DEFAULT
            </div>
          )}
        </div>
      </div>
      <div className="space-y-1 font-roboto">
        <div className="flex items-center space-x-4">
          <IoIosTime className="h-4 w-5 text-primary-accent/70" />
          <span className="px-2 py-0 bg-amber-50 rounded border border-primary-accent/20 text-sm text-primary-accent">
            Sorted Applicants:
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b>{data?._count?.sortedApplicant}</b>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <FaFileInvoiceDollar className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
            Generated Vouchers: &nbsp;&nbsp;&nbsp;&nbsp;
            <b>{data?._count?.voucher}</b>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <FaPeopleGroup className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
            Admitted Students: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b>{data?._count?.fresher}</b>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <IoIosTime className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
            Admission Date: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b>{moment(data.admittedAt).format("MMM-DD-YY")}</b>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <GiClockwork className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
            Application Opens: &nbsp;&nbsp;
            <b>{moment(data.applyStart).format("MMM-DD-YY")}</b>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <GiClockwork className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
            Application Closes: &nbsp;&nbsp;
            <b>{moment(data.applyEnd).format("MMM-DD-YY")}</b>
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="flex group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`bg-green-950/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              Status
            </span>
            <span className="font-semibold font-roboto text-base text-primary/60">
              {data?.status == 1 ? "ENABLED" : "DISABLED"}
            </span>
          </div>
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center space-x-2 group">
          {/* <Link to={`${encodeURIComponent(data?.id)}/profile`} className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60">
            <FaFolder className="h-4 w-4 text-amber-200"/>
            <span className="text-sm text-white font-semibold">View</span>
          </Link> */}
          <Link
            to={`${encodeURIComponent(data?.id)}/edit`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            <MdEditDocument className="h-4 w-4 text-green-200" />
            <span className="text-sm text-white font-semibold">Edit</span>
          </Link>
          <Form
            method="post"
            action={`${data?.id}/destroy`}
            onSubmit={(e) => {
              if (!confirm("Do you want to delete")) e.preventDefault();
              return false;
            }}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary-accent/60"
          >
            <FaTrash className="h-3 w-4 text-pink-100" />
            <button type="submit" className="text-sm text-white font-semibold">
              Delete
            </button>
          </Form>
          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`bg-primary-dark/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              STATUS
            </span>
            <span className="font-semibold font-roboto text-sm text-primary/60">
              {data?.status == 1 ? "ENABLED" : "DISABLED"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SessionCardItem;
