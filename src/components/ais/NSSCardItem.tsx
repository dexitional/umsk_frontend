import moment from "moment";
import React from "react";
import { FaEnvelope, FaPhone, FaTrash } from "react-icons/fa";
import { FaCreditCard, FaFilePdf, FaFolder } from "react-icons/fa6";
import { MdEditDocument, MdLocationOn } from "react-icons/md";
import { Form, Link } from "react-router-dom";
import Logo from "../../assets/img/logo/ucc/logo.png";

type Props = {
  data: any;
};

function NSSCardItem({ data }: Props) {
  return (
    <div className="p-4 md:p-6 min-h-max border rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group">
      <h2 className="text-base md:text-lg font-semibold font-noto text-gray-500 uppercase">
        {data?.nss_no}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <div className="text-sm md:text-sm text-blue-950/70 font-medium font-roboto capitalize">
            {(
              data.fname +
              " " +
              (data.mname && data.mname + " " + data.lname)
            ).toUpperCase()}
          </div>
          <div className="py-0.5 px-2 text-sm rounded bg-blue-950/60 text-white font-bold">
            {data?.gender}
          </div>
        </div>
        <img
          src={`https://cdn.ucc.edu.gh/photos/?tag=${data?.nss_no}` || Logo}
          className="p-1 h-12 w-12 border rounded-md bg-white object-contain"
        />
      </div>
      <div className="space-y-1 font-roboto">
        <div className="flex items-center space-x-4">
          <FaPhone className="rotate-90 h-4 w-5 text-blue-950/70" />
          <span className="text-sm text-gray-500">{data?.mobile}</span>
        </div>
        <div className="flex items-center space-x-4">
          <FaEnvelope className="h-4 w-5 text-blue-950/70" />
          <span className="text-sm text-gray-500 line-clamp-1">
            {data?.email?.toLowerCase()}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <MdLocationOn className="shrink-0 h-5 w-5 text-blue-950/70" />
          <span
            className={`${
              data.unit_id ? "text-gray-500" : "text-red-500"
            } text-sm  font-medium capitalize line-clamp-1`}
          >
            {data?.department?.toLowerCase() || "Not assigned"}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <FaCreditCard className="h-4 w-5 text-blue-950/70" />
          <span className="text-sm text-gray-500 italic">
            {data?.ezwich_no || "Not Set"}
          </span>
        </div>
        {data?.nss_form ? (
          <div className="flex items-center space-x-4">
            <FaFilePdf className="h-4 w-5 text-blue-950/70" />
            <Link
              to={data?.nss_form}
              className="px-2 py-0 bg-red-50 rounded border text-sm text-gray-500 italic"
            >
              NSS Appointment Form
            </Link>
          </div>
        ) : null}
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
              Service Start Period
            </span>
            <span className="font-semibold font-roboto text-base text-blue-950/60">
              {data?.start_date && moment(data?.start_date).format("YYYY")}
            </span>
          </div>
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center md:justify-between space-x-2 group">
          <Link
            to={`${data?.id}`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-blue-950/60"
          >
            {/* <FcViewDetails className="h-4 w-4 text-white"/> */}
            <FaFolder className="h-4 w-4 text-amber-100" />
            <span className="text-sm text-white font-semibold">View</span>
          </Link>
          <Link
            to={`${data?.id}/edit`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-blue-950/60"
          >
            <MdEditDocument className="h-4 w-4 text-green-100" />
            <span className="text-sm text-white font-semibold">Edit</span>
          </Link>
          <Form
            method="post"
            action={`${data?.id}/destroy`}
            onSubmit={(e) => {
              if (!confirm("Do you want to delete")) e.preventDefault();
              return false;
            }}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-blue-950/60"
          >
            <FaTrash className="h-3 w-4 text-pink-100" />
            <button type="submit" className="text-sm text-white font-semibold">
              Delete
            </button>
          </Form>
          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`${
                moment(data?.start_date).format("YYYY") ==
                moment().format("YYYY")
                  ? "bg-green-950/60"
                  : "bg-red-950/60"
              } py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              Service Start Period
            </span>
            <span className="font-semibold font-roboto text-base text-blue-950/60">
              {data?.start_date && moment(data?.start_date).format("YYYY")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NSSCardItem;
