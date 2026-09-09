import React from "react";
import { FaTrash } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { Form, Link } from "react-router-dom";
// @ts-ignore
import { IoIosTime } from "react-icons/io";
import { useHasRole } from "../../utils/roles";

type Props = {
  data: any;
};

function CourseCardItem({ data }: Props) {
  const canEditCourse = useHasRole("ais", ["course::admin"]);

  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-2 md:space-y-4 md:group font-roboto">
      <h2 className="text-sm md:text-base font-semibold text-gray-500 uppercase tracking-wider">
        {data?.id}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <div className="flex-1 text-xs md:text-sm text-primary-dark/70 font-semibold capitalize">
            {(data?.title).toUpperCase()}
          </div>
          {/* <div className="py-0.5 px-2 w-fit text-xs rounded bg-primary/60 text-white font-bold">{data?.creditHour} CR</div> */}
        </div>
      </div>
      <div className="space-y-1">
        {data.practicalHour ? (
          <div className="flex items-center space-x-4">
            <IoIosTime className="h-4 w-5 text-primary/70" />
            <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
              Practicals: &nbsp;&nbsp;&nbsp;<b>{data.practicalHour}</b> Credits
            </span>
          </div>
        ) : (
          ""
        )}
        {data.theoryHour ? (
          <div className="flex items-center space-x-4">
            <IoIosTime className="h-4 w-5 text-primary/70" />
            <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
              Theory: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <b>{data.theoryHour}</b> Credits
            </span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1">
        <div className="px-3 py-2 w-fit opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="flex group-hover:hidden items-center justify-center space-x-3 text-center">
            <div
              className={`px-2.5 py-0.5 bg-red-950/60 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              Credit
            </div>
            <span className="font-semibold text-base text-primary/60">
              {data?.creditHour}
            </span>
          </div>
        </div>
        <div
          className={`px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center space-x-2 ${
            canEditCourse && "group"
          }`}
        >
          {/* <Link to={`${encodeURIComponent(data?.id)}/profile`} className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60">
            <FaFolder className="h-4 w-4 text-amber-200"/>
            <span className="text-sm text-white font-semibold">View</span>
          </Link> */}

          {canEditCourse ? (
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
              className={`bg-primary/60 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              CREDIT
            </span>
            <span className="font-semibold text-base italic text-primary/60">
              {data?.creditHour}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseCardItem;
