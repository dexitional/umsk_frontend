import React from "react";
import { FaPhone } from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { Form, Link } from "react-router-dom";
// @ts-ignore
import moment from "moment";
import { AiOutlineFileDone } from "react-icons/ai";
import { CgNotes, CgTemplate } from "react-icons/cg";
import { FaCircleCheck } from "react-icons/fa6";
import { HiMiniAcademicCap } from "react-icons/hi2";
import Logo from "../../assets/img/logo/aucc/logo.png";

type Props = {
  data: any;
};

function ApplicantCardItem({ data }: Props) {
  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group">
      <h2 className="text-base md:text-lg font-semibold font-noto text-gray-500 uppercase">
        {data?.serial}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <div className="text-sm md:text-sm text-primary-dark/70 font-bold font-roboto capitalize">
            {(
              data?.profile?.fname +
              " " +
              (data?.profile?.mname ? data?.profile?.mname + " " : "") +
              data?.profile?.lname
            ).toUpperCase()}
          </div>
          <div className="py-0.5 px-2 text-sm rounded bg-primary/60 text-white font-bold">
            {data?.profile?.gender}
          </div>
        </div>
        <img
          src={data?.photo || Logo}
          className="p-1 h-12 w-12 border rounded-md bg-white object-contain"
        />
      </div>
      <div className="space-y-1.5 font-roboto">
        <div className="flex items-center space-x-2">
          <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-primary/70" />
          <span className={`text-gray-500 text-sm  font-semibold capitalize`}>
            {data.choice?.program?.longName || "No Program Set"}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FaPhone className="rotate-90 h-4 w-5 text-primary/70" />
          <span className="text-sm text-gray-500">
            {data?.profile?.phone || "No Phone Set"}
          </span>
        </div>
        {/* <div className="flex items-center space-x-2">
            <FaEnvelope className="h-4 w-5 text-primary/70" />
            <span className="text-sm text-gray-500 line-clamp-1">{data?.email?.toLowerCase() || 'Not Set'}</span>
        </div> */}
        <div className="flex items-center space-x-2">
          <AiOutlineFileDone className="h-4 w-5 text-primary/70" />
          <span className="text-xs text-gray-500 font-medium tracking-wider">
            {data?.submitted
              ? `SUBMITTED - ${moment(data?.submittedAt)
                  .format("MMM DD, YYYY")
                  ?.toUpperCase()}`
              : "IN-PROGRESS"}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-green-50 rounded border text-xs font-semibold font-roboto text-gray-500 tracking-wide">
            {data.stage?.title?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="px-2 py-0.5 bg-green-50 rounded border text-xs font-semibold font-roboto text-gray-500 tracking-wide">
            {data.applyType?.title?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <CgNotes className="h-4 w-5 text-primary-accent/70" />
          <span className="px-2 py-0.5 bg-amber-50 rounded border text-xs font-semibold font-roboto text-gray-500 tracking-wide uppercase">
            {data?.stage?.category?.title}
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="flex group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`${
                data?.sorted ? "bg-primary-dark/60" : "bg-primary-accent/70"
              } py-1 px-3 rounded flex items-center space-x-1.5 text-xs text-white font-semibold`}
            >
              FILED ON
            </span>
            <span className="font-semibold font-roboto text-sm text-primary/60">
              {moment(data?.createdAt).format("MMM DD, YYYY")?.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center space-x-2 group">
          <Link
            to={`${encodeURIComponent(data?.serial)}`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            {/* <FcViewDetails className="h-4 w-4 text-white"/> */}
            <CgTemplate className="h-4 w-4 text-amber-200" />
            <span className="text-sm text-white font-semibold">Form</span>
          </Link>
          {/* <Link to={`${encodeURIComponent(data?.serial)}/edit`} className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60">
            <IoCheckmarkDoneCircleSharp className="h-4 w-4 text-green-200"/>
            <span className="text-sm text-white font-semibold">Shortlist</span>
          </Link> */}
          {!data?.sorted && data?.submitted ? (
            <Form
              method="post"
              action={`${data?.serial}/shortlist`}
              onSubmit={(e) => {
                if (!confirm("Shortlist Applicant?")) e.preventDefault();
                return false;
              }}
              className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
            >
              <IoCheckmarkDoneCircleSharp className="h-4 w-4 text-green-200" />
              <button
                type="submit"
                className="text-sm text-white font-semibold"
              >
                Shortlist
              </button>
            </Form>
          ) : null}
          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`${
                data?.sorted ? "bg-primary-dark/60" : "bg-primary-accent/70"
              } py-1 px-3 rounded flex items-center space-x-1.5 text-xs text-white font-semibold`}
            >
              FILED ON
            </span>
            <span
              className={`${
                data?.sorted ? "text-primary-dark/60" : "text-primary-accent/70"
              } font-semibold font-roboto text-sm `}
            >
              {moment(data?.createdAt).format("MMM DD, YYYY")?.toUpperCase()}
            </span>
          </div>
          {data?.sorted ? (
            <FaCircleCheck className="w-10 h-6 text-primary/60" />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ApplicantCardItem;
