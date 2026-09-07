import React from "react";
import { FaTrash } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { MdEditDocument } from "react-icons/md";
// @ts-ignore
import { Form, Link } from "react-router-dom";
import { getStudyMode } from "../../utils/util";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function SheetListItem({ data }: Props) {
  return (
    <div className="px-3 md:px-6 pb-4 grid md:grid-cols-7 gap-y-4 md:gap-y-0 md:gap-x-2 md:place-items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group">
      <div className="md:col-span-2 md:place-self-start flex flex-col space-y-2">
        <ListHeading title="Program" />
        <div className="px-2 md:px-0 flex items-center space-x-3 md:space-x-4">
          <span className="leading-5">
            {data.program?.longName}
            <br />
            <b>L {Math.ceil(data?.semesterNum / 2) * 100}</b>
            {data?.studyMode && (
              <>
                <br />
                <b className="text-primary/70 uppercase">
                  -- {getStudyMode(data?.studyMode)} SESSION
                </b>
              </>
            )}
          </span>
        </div>
      </div>
      <div className="md:col-span-2  md:place-self-start capitalize flex flex-col space-y-2">
        <ListHeading title="Course" />
        <span className="px-2 md:px-0 leading-5">
          {data?.course?.title?.toUpperCase()} <br />
          <b>{data?.courseId}</b>
          <br />
          <b className="text-primary/70 uppercase">
            {data.finalized
              ? "SHEET CLOSED"
              : data.certified
              ? "PUBLISHED"
              : data.certified
              ? "SUBMITTED"
              : "CAPTURE MODE"}
          </b>
        </span>
      </div>
      <div className="md:col-span-2  md:place-self-start capitalize flex flex-col space-y-2">
        <ListHeading title="Session" />
        <span className="px-2 md:px-0 uppercase leading-5">
          {data?.session?.title}
          <br />
          <b>
            {data?.session?.tag == "sub" ? "JANUARY/SUB STREAM" : "MAIN STREAM"}
          </b>
        </span>
      </div>
      <div className="flex flex-col space-y-2">
        <ListHeading title="Action" />
        <div className="px-2 md:px-0 w-fit flex items-center justify-evenly space-x-2">
          <Link
            to={`${encodeURIComponent(data?.id)}/students`}
            className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
          >
            <FcViewDetails className="h-4 w-4 text-white" />
            <span className="hidden text-sm text-white font-semibold">
              View
            </span>
          </Link>
          <Link
            to={`${encodeURIComponent(data?.id)}/edit`}
            className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
          >
            <MdEditDocument className="h-4 w-4 text-green-100" />
            <span className="hidden text-sm text-white font-semibold">
              Edit
            </span>
          </Link>
          <Form
            method="post"
            action={`${encodeURIComponent(data?.id)}/destroy`}
            onSubmit={(e) => {
              if (!confirm("Do you want to delete")) e.preventDefault();
              return false;
            }}
            className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
          >
            <FaTrash className="h-4 w-4 text-pink-100" />
            <button
              type="submit"
              className="hidden text-sm text-white font-semibold"
            >
              Delete
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SheetListItem;
