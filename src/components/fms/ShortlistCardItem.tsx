import React from "react";
import { BiTrash } from "react-icons/bi";
import { CgNotes, CgTemplate } from "react-icons/cg";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { TbHexagonNumber1, TbHexagonNumber2 } from "react-icons/tb";
import { Form, Link } from "react-router-dom";

type Props = {
  data: any;
};

function ShortlistCardItem({ data }: Props) {
  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group">
      <h2 className="text-sm md:text-sm font-semibold font-noto text-gray-500 uppercase">
        {data?.profile?.fname}
        {data?.profile?.mname && data?.profile?.mname + " "}{" "}
        {data?.profile?.lname}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <div className="flex-1 text-sm md:text-sm text-primary-dark/70 font-bold font-roboto capitalize">
            {data?.title?.toUpperCase()}
          </div>
          <div className="py-0.5 px-2 w-fit text-xs rounded bg-primary/60 text-white font-bold">
            {data?.profile?.gender == "M" ? "MALE" : "FEMALE"}
          </div>
        </div>
      </div>
      <div className="space-y-1 font-roboto">
        <div className="flex items-center space-x-2">
          <TbHexagonNumber1 className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border font-semibold text-xs text-gray-500">
            {data?.choice1?.program?.longName}
          </span>
        </div>
        {data?.choice2 && (
          <div className="flex items-center space-x-2">
            <TbHexagonNumber2 className="h-4 w-5 text-primary/70" />
            <span className="px-2 py-0 bg-green-50 rounded border font-semibold text-xs text-gray-500">
              {data?.choice2?.program?.longName}
            </span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <CgNotes className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0.5 bg-green-50 rounded border text-xs font-semibold font-roboto text-gray-500 tracking-wide">
            {data.stage?.title?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <CgNotes className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0.5 bg-green-50 rounded border text-xs font-semibold font-roboto text-gray-500 tracking-wide">
            {data.applyType?.title?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <CgNotes className="h-4 w-5 text-primary-accent/70" />
          <span className="px-2 py-0.5 bg-amber-50 rounded border text-xs font-semibold font-roboto text-gray-500 tracking-wide uppercase">
            {data?.category?.title}
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`${
                data?.admitted ? "bg-primary-dark/60" : "bg-primary-accent/60"
              } py-1 px-3 rounded flex items-center space-x-1.5 text-xs text-white font-semibold`}
            >
              STATUS
            </span>
            <span className="font-semibold font-roboto text-sm text-primary/60">
              {data?.admitted ? "ADMITTED" : "IN-PROGRESS"}
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
          {!data?.admitted ? (
            <Link
              to={`${encodeURIComponent(data?.serial)}/process`}
              className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
            >
              <IoCheckmarkDoneCircleSharp className="h-4 w-4 text-green-200" />
              <span className="text-sm text-white font-semibold">Admit</span>
            </Link>
          ) : null}

          {!data?.admitted ? (
            <Form
              method="post"
              action={`${data?.serial}/destroy`}
              onSubmit={(e) => {
                if (!confirm("Unlist Applicant for Admission?"))
                  e.preventDefault();
                return false;
              }}
              className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-red-100 border border-red-200"
            >
              <BiTrash className="h-4 w-4 text-red-400" />
              <button
                type="submit"
                className="text-sm text-red-400 font-semibold"
              >
                Unlist
              </button>
            </Form>
          ) : null}

          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`${
                data?.admitted ? "bg-primary-dark/60" : "bg-primary-accent/60"
              } py-1 px-3 rounded flex items-center space-x-1.5 text-xs text-white font-semibold`}
            >
              STATUS
            </span>
            <span className="font-semibold font-roboto text-sm text-primary/60">
              {data?.admitted ? "ADMITTED" : "IN-PROGRESS"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShortlistCardItem;
