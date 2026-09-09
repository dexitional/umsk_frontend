import React from "react";
import { FaFolder, FaTrash } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { Form, Link } from "react-router-dom";
// @ts-ignore
import moment from "moment";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { FaFilePdf, FaTimeline } from "react-icons/fa6";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { useHasRole } from "../../utils/roles";

type Props = {
  data: any;
};

function ProgramCardItem({ data }: Props) {
  const canEditProgram = useHasRole("ais", ["program::admin"]);

  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group font-roboto">
      <h2 className="text-base md:text-lg font-semibold text-gray-500 uppercase">
        {data?.shortName}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <div className="text-sm md:text-sm text-primary-dark/70 font-bold capitalize">
            {data?.longName?.toUpperCase()}
          </div>
          <div className="py-0.5 px-2 text-sm rounded bg-primary/60 text-white font-bold">
            {data?.category}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center space-x-4">
          <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-primary/70" />
          <span
            className={`${
              data.department?.title ? "text-gray-500" : "text-red-500"
            } text-xs  font-bold capitalize`}
          >
            {data.department?.title || "Not assigned"}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <FaTimeline className="rotate-90 h-4 w-5 text-primary/70" />
          <span className="text-sm text-gray-500">
            <span className="font-bold">{data?.semesterTotal}</span> Semesters
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <AiOutlineFieldNumber className="h-4 w-5 text-primary/70" />
          <span className="text-xs text-gray-500 font-semibold tracking-wider">
            {data?.prefix || "Not Set"}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <FaFilePdf className="h-4 w-5 text-primary/70" />
          <Link
            to={data?.nss_form}
            className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500"
          >
            Minimum Credit Completion:{" "}
            <span className="font-bold">{data?.creditTotal}</span>
          </Link>
        </div>
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
              Level
            </span>
            <span className="font-semibold text-base text-primary/60">
              {Math.ceil(data?.semesterNum / 2) * 100}
            </span>
          </div>
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center md:justify-between space-x-2 group">
          <Link
            to={`${encodeURIComponent(data?.id)}/curriculum`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            <FaFolder className="h-4 w-4 text-amber-200" />
            <span className="text-sm text-white font-semibold">View</span>
          </Link>

          {canEditProgram ? (
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
              className={`${
                !data?.completeStatus
                  ? "bg-primary-dark/60"
                  : "bg-secondary-accent"
              } py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              DURATION
            </span>
            <span className="font-semibold text-sm text-primary/60">
              {Math.ceil(data?.semesterTotal / 2) + " YEARS" || ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramCardItem;
