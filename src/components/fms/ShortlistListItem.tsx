import React from "react";
import { FaTrash } from "react-icons/fa";
// @ts-ignore
import { CgTemplate } from "react-icons/cg";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { Form, Link } from "react-router-dom";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function ShortlistListItem({ data }: Props) {
  return (
    <div className="px-3 md:px-6 pb-4 grid md:grid-cols-7 gap-y-4 md:gap-y-0 md:gap-x-2 md:place-items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group">
      <div className="md:col-span-2 md:place-self-start flex flex-col space-y-2">
        <ListHeading title="Applicant Name" />
        <div className="px-2 flex items-center space-x-3 md:space-x-4">
          <span>
            {data?.profile.fname}
            {data?.profile.mname && data?.profile.mname + " "}{" "}
            {data?.profile.lname}
          </span>
        </div>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Applicant ID" />
        <span className="px-2">{data?.serial}</span>
      </div>
      <div className="capitalize flex flex-col flex-wrap space-y-2">
        <ListHeading title="Apply Mode" />
        <div className="px-2 flex flex-col space-y-2">
          <span className="capitalize md:px-0">
            {data.stage?.categoryId == "CP"
              ? "Certificate Programs"
              : data.stage?.categoryId == "DP"
              ? "Diploma Programs"
              : data.stage?.categoryId == "UG"
              ? "Undergrad Programs"
              : "Postgraduate Programs"}
          </span>
          {/* <span className="text-[0.65rem]">{data.applyType?.title?.toUpperCase()}{data.stage?.categoryId  == 'CP' ? 'CERTIFICATE PROGRAM': data.stage?.categoryId  == 'DP' ? 'DIPLOMA PROGRAM': data.stage?.categoryId  == 'UG' ? 'UNDERGRAD PROGRAMS': 'POSTGRADUATE PROGRAMS'}</span> */}
        </div>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Choice 1" />
        <span className="px-2 md:px-0">
          {data?.choice1?.program?.longName?.toLowerCase()}
        </span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Choice 2" />
        <span className="px-2 md:px-0">
          {data?.choice2?.program?.longName?.toLowerCase()}
        </span>
      </div>

      <div className="flex flex-col space-y-2">
        <ListHeading title="Action" />
        <div className="px-2 md:ml-6 w-fit flex items-center justify-evenly space-x-2">
          <Link
            to={`${encodeURIComponent(data?.serial)}`}
            className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
          >
            <CgTemplate className="h-4 w-4 text-amber-200" />
            <span className="hidden text-sm text-white font-semibold">
              View
            </span>
          </Link>
          {!data?.admitted ? (
            <Link
              to={`${encodeURIComponent(data?.serial)}/process`}
              className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
            >
              <IoCheckmarkDoneCircleSharp className="h-4 w-4 text-green-100" />
              <span className="hidden text-sm text-white font-semibold">
                Admit Applicant
              </span>
            </Link>
          ) : null}
          {!data?.admitted ? (
            <Form
              method="post"
              action={`${encodeURIComponent(data?.serial)}/destroy`}
              onSubmit={(e) => {
                if (!confirm("Unlist Applicant for Admission?"))
                  e.preventDefault();
                return false;
              }}
              className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
            >
              <FaTrash className="h-4 w-4 text-pink-100" />
              <button
                type="submit"
                className="hidden text-sm text-white font-semibold"
              >
                Unlist
              </button>
            </Form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ShortlistListItem;
