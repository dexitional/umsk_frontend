import React from "react";
import { MdFolderDelete } from "react-icons/md";
// @ts-ignore
import { TiDocumentText } from "react-icons/ti";
import { Form, Link } from "react-router-dom";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function MatriculantListItem({ data }: Props) {
  return (
    <div className="px-3 md:px-6 pb-4 grid md:grid-cols-7 gap-y-4 md:gap-y-0 md:gap-x-2 md:place-items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group">
      <div className="md:col-span-2 md:place-self-start flex flex-col space-y-2">
        <ListHeading title="Applicant Name" />
        <div className="px-2 flex items-center space-x-3 md:space-x-4">
          <span>
            {data?.student?.fname}
            {data?.student?.mname && data?.student?.mname + " "}{" "}
            {data?.student?.lname}
          </span>
        </div>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Applicant ID" />
        <span className="px-2">{data?.serial}</span>
      </div>
      <div className="capitalize flex flex-col flex-wrap space-y-2">
        <ListHeading title="Program" />
        <div className="px-2 flex flex-col space-y-2">
          <span className="capitalize md:px-0">
            {data.program?.longName?.toLowerCase()}
          </span>
          {/* <span className="text-[0.65rem]">{data.applyType?.title?.toUpperCase()}{data.stage?.categoryId  == 'CP' ? 'CERTIFICATE PROGRAM': data.stage?.categoryId  == 'DP' ? 'DIPLOMA PROGRAM': data.stage?.categoryId  == 'UG' ? 'UNDERGRAD PROGRAMS': 'POSTGRADUATE PROGRAMS'}</span> */}
        </div>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Level" />
        <span className="px-2 md:px-0">
          {Math.ceil(data?.semesterNum / 2) * 100}
        </span>
      </div>
      <div className="flex flex-col space-y-2">
        <ListHeading title="Credentials" />
        <div className="px-2 md:px-0 flex flex-col space-y-1 text-xs tracking-widest">
          <span>
            Username
            <br />
            <b className="italic">{data?.username}</b>
          </span>
          <span>
            Password
            <br />
            <b className="italic">{data?.password}</b>
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <ListHeading title="Action" />
        <div className="px-2 md:ml-6 w-fit flex items-center justify-evenly space-x-2">
          <Link
            to={`${encodeURIComponent(data?.serial)}`}
            className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
          >
            <TiDocumentText className="h-4 w-4 text-amber-200" />
            <span className="hidden text-sm text-white font-semibold">
              Letter
            </span>
          </Link>

          <Form
            method="post"
            action={`${data?.serial}/destroy`}
            onSubmit={(e) => {
              if (!confirm("Revoke Admission?")) e.preventDefault();
              return false;
            }}
          >
            <button
              type="submit"
              className="cursor-pointer p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
            >
              <MdFolderDelete className="h-4 w-4 text-red-100" />
              <span className="hidden text-sm text-white font-semibold">
                Delete
              </span>
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default MatriculantListItem;
