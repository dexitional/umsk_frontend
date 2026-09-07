import React from "react";
import { FaFolder, FaTrash } from "react-icons/fa";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { MdEditDocument } from "react-icons/md";
// @ts-ignore
import { Form, Link } from "react-router-dom";
import { useHasRole } from "../../utils/roles";

type Props = {
  data: any;
};

function BacklogCardItem({ data }: Props) {
  const canEditBacklog = useHasRole("ais", ["backlog::admin"]);

  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group">
      <h2 className="text-sm md:text-sm font-semibold font-noto text-gray-500 uppercase">
        {data?.title}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="w-full flex items-center justify-between space-x-2">
          <div className="flex-1 text-sm md:text-sm text-primary-dark/70 font-bold font-roboto capitalize">
            {data?.type}
          </div>
          <div className="py-0.5 px-2 w-fit text-sm rounded bg-primary/60 text-white font-bold">
            {data?.status ? "APPROVED" : "PENDED"}
          </div>
        </div>
      </div>
      <div className="space-y-1 font-roboto">
        <div className="flex items-center space-x-2">
          <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-primary/70" />
          <span
            className={`text-primary/80 text-xs  font-semibold tracking-wider uppercase`}
          >
            {data?.session?.title}
          </span>
        </div>
        {data.session?.tag == "sub" && (
          <div>
            <span className="px-2 py-1 bg-green-50 rounded border text-xs font-medium text-gray-500 tracking-wider">
              {data.session?.tag ? "MAIN STREAM" : "JANUARY/SUB STREAM"}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="flex group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`bg-green-950/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              SEMESTER
            </span>
            <span className="font-semibold font-roboto text-base text-primary/60">
              {data?.semesterNum % 2 == 0 ? 2 : 1}
            </span>
          </div>
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center space-x-2 group">
          <Link
            to={`${encodeURIComponent(data?.id)}/records`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            <FaFolder className="h-4 w-4 text-amber-200" />
            <span className="text-sm text-white font-semibold">View</span>
          </Link>
          {!data.status && canEditBacklog ? (
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
                className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary-accent/60"
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
              RECORDS
            </span>
            <span className="font-semibold font-roboto text-base text-primary/60">
              {data?.meta?.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BacklogCardItem;
