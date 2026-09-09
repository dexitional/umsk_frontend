import React from "react";
import { FaTrash } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
// @ts-ignore
import { Form, Link } from "react-router-dom";
// @ts-ignore
import { HiMiniAcademicCap } from "react-icons/hi2";
import { useHasRole } from "../../utils/roles";

type Props = {
  data: any;
};

function StructureCardItem({ data }: Props) {
  const canEditStructure = useHasRole("ais", ["curriculum::admin"]);

  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group font-roboto">
      <h2 className="text-base md:text-lg font-semibold text-gray-500 uppercase">
        {data?.courseId}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <div className="flex-1 text-sm md:text-sm text-primary-dark/70 font-bold capitalize">
            {data?.course?.title?.toUpperCase()}
          </div>
          <div className="py-0.5 px-2 w-fit text-sm rounded bg-primary/60 text-white font-bold">
            L {Math.ceil(data?.semesterNum / 2) * 100}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-primary/70" />
          <span
            className={`text-primary/60 text-xs  font-semibold capitalize tracking-wider`}
          >
            {data.type == "C"
              ? " COMPULSORY"
              : data.type == "E"
              ? "ELECTIVE"
              : "OPTIONAL"}
          </span>
        </div>
        <div className="py-1 px-2 bg-green-50 rounded border text-[0.65rem] font-semibold text-gray-500 tracking-wider">
          {data.program?.longName}
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="flex group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`bg-green-950/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              SEMESTER
            </span>
            <span className="font-semibold text-base text-primary/60">
              {data?.semesterNum % 2 == 0 ? 2 : 1}
            </span>
          </div>
        </div>
        <div
          className={`px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center space-x-2 ${
            canEditStructure && "group"
          }`}
        >
          {/* <Link to={`${encodeURIComponent(data?.id)}/curriculum`} className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60">
            <FaFolder className="h-4 w-4 text-amber-200"/>
            <span className="text-sm text-white font-semibold">View</span>
          </Link> */}
          {canEditStructure ? (
            <>
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
                className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-secondary-accent"
              >
                <FaTrash className="h-3 w-4 text-pink-100" />
                <button
                  type="submit"
                  className="text-sm text-white font-semibold"
                >
                  Delete
                </button>
              </Form>
            </>
          ) : null}

          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`bg-primary-dark/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              SEMESTER
            </span>
            <span className="font-semibold text-base text-primary/60">
              {data?.semesterNum % 2 == 0 ? "TWO" : "ONE"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StructureCardItem;
