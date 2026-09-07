import React from "react";
import { FaUserLock } from "react-icons/fa6";
import { HiAcademicCap } from "react-icons/hi2";
import { MdFolderDelete, MdNumbers } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { TiDocumentText } from "react-icons/ti";
import { Form, Link } from "react-router-dom";

type Props = {
  data: any;
};

function MatriculantCardItem({ data }: Props) {
  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group">
      <h2 className="text-sm md:text-sm font-semibold font-noto text-gray-500 uppercase">
        {data?.student?.fname}
        {data?.student?.mname && data?.student?.mname + " "}{" "}
        {data?.student?.lname}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <div className="flex-1 text-sm md:text-sm text-primary-dark/70 font-bold font-roboto uppercase">
            {data?.category?.title}
          </div>
          <div className="py-0.5 px-2 w-fit text-xs rounded bg-primary/60 text-white font-bold">
            {data?.student?.gender == "M" ? "MALE" : "FEMALE"}
          </div>
        </div>
      </div>
      <div className="space-y-1 font-roboto">
        <div className="flex items-center space-x-2">
          <HiAcademicCap className="h-4 w-5 text-primary/70" />
          <span className="capitalize px-2 py-0 bg-green-50 rounded border font-semibold text-sm text-gray-500">
            {data?.program?.longName?.toLowerCase()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <MdNumbers className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border font-semibold text-sm text-gray-500">
            Level {Math.ceil(data?.semesterNum / 2) * 100}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <FaUserLock className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0.5 bg-green-50 rounded border text-xs font-semibold font-roboto text-gray-500 tracking-wide">
            Username: {data?.serial}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <RiLockPasswordFill className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0.5 bg-green-50 rounded border text-xs font-semibold font-roboto text-gray-500 tracking-wide">
            Password: {data.password}
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`bg-primary-dark/60 py-1 px-3 rounded flex items-center space-x-1.5 text-xs text-white font-semibold`}
            >
              APPLICANT ID
            </span>
            <span className="font-semibold font-roboto text-sm text-primary/60">
              {data?.serial}
            </span>
          </div>
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center space-x-2 group">
          <Link
            to={`${encodeURIComponent(data?.serial)}`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            {/* <FcViewDetails className="h-4 w-4 text-white"/> */}
            <TiDocumentText className="h-4 w-4 text-amber-200" />
            <span className="text-sm text-white font-semibold">Letter</span>
          </Link>
          <Form
            method="post"
            action={`${data?.serial}/destroy`}
            onSubmit={(e) => {
              if (!confirm("Revoke Admission?")) e.preventDefault();
              return false;
            }}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            <MdFolderDelete className="h-4 w-4 text-red-100" />
            <button type="submit" className="text-sm text-white font-semibold">
              Revoke
            </button>
          </Form>

          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`bg-primary-dark/60 py-1 px-3 rounded flex items-center space-x-1.5 text-xs text-white font-semibold`}
            >
              APPLICANT ID
            </span>
            <span className="font-semibold font-roboto text-sm text-primary/60">
              {data?.serial}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatriculantCardItem;
