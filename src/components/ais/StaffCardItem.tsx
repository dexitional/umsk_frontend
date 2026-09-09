import React from "react";
import { FaEnvelope, FaPhone, FaTrash } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { Form, Link } from "react-router-dom";
// @ts-ignore
import moment from "moment";
import { FaFolder } from "react-icons/fa6";
import { HiMiniAcademicCap } from "react-icons/hi2";
import Logo from "../../assets/img/logo.webp";
import { useHasRole } from "../../utils/roles";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
};

function StaffCardItem({ data }: Props) {
  const canEditStaff = useHasRole("ais", ["hrm::admin"]);

  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group font-roboto">
      <h2 className="text-base md:text-lg font-semibold text-gray-500 uppercase">
        {data?.staffNo}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <div className="text-sm md:text-sm text-primary-dark/70 font-bold capitalize">
            {(
              (data?.title?.label ? data.title.label + ". " : "") +
              data.fname +
              " " +
              (data.mname && data.mname + " ") +
              data.lname
            ).toUpperCase()}
          </div>
          <div className="py-0.5 px-2 text-sm rounded bg-primary/60 text-white font-bold">
            {data?.gender}
          </div>
        </div>
        <img
          crossOrigin="anonymous"
          src={`${REACT_APP_API_URL}/auth/photos/?tag=${data?.staffNo}` || Logo}
          className="p-1 h-12 w-12 border rounded-md bg-white object-contain"
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-center space-x-4">
          <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-primary/70" />
          <span className="text-gray-500 text-xs  font-bold capitalize">
            {data?.unit?.title || "Not assigned"}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <FaPhone className="rotate-90 h-4 w-5 text-primary/70" />
          <span className="text-sm text-gray-500">{data?.phone}</span>
        </div>
        <div className="flex items-center space-x-4">
          <FaEnvelope className="h-4 w-5 text-primary/70" />
          <span className="text-sm text-gray-500 line-clamp-1">
            {data?.email?.toLowerCase() || "Not Set"}
          </span>
        </div>
        {/* <div className="flex items-center space-x-4">
            <GoPeople className="h-4 w-5 text-primary/70" />
            <span  className="px-2 py-0 bg-green-50 rounded border text-xs font-semibold text-gray-500 uppercase tracking-wider">{data?.job?.title}</span>
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
              ROLE
            </span>
            <span className="font-semibold text-base text-primary/60 uppercase">
              {data?.job?.title}
            </span>
          </div>
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center md:justify-between space-x-2 group">
          <Link
            to={`${encodeURIComponent(data?.staffNo)}/profile`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            {/* <FcViewDetails className="h-4 w-4 text-white"/> */}
            <FaFolder className="h-4 w-4 text-amber-200" />
            <span className="text-sm text-white font-semibold">View</span>
          </Link>
          {canEditStaff ? (
            <>
              <Link
                to={`${encodeURIComponent(data?.staffNo)}/edit`}
                className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
              >
                <MdEditDocument className="h-4 w-4 text-green-200" />
                <span className="text-sm text-white font-semibold">Edit</span>
              </Link>
              <Form
                method="post"
                action={`${data?.staffNo}/destroy`}
                onSubmit={(e) => {
                  if (!confirm("Do you want to delete")) e.preventDefault();
                  return false;
                }}
                className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-secondary-accent"
              >
                <FaTrash className="h-3 w-4 text-pink-100" />
                <button type="submit" className="text-sm text-white font-semibold">
                  Delete
                </button>
              </Form>
            </>
          ) : null}
          <div className="hidden md:flex flex-col md:group-hover:hidden items-center justify-center space-y-0 md:space-y-2 space-x-3 text-center">
            <span className="bg-primary-dark/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold">
              ROLE
            </span>
            <span className="font-semibold text-base text-primary/60 uppercase">
              {data?.job?.title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffCardItem;
