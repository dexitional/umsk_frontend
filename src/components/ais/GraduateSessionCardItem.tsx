import moment from "moment";
import React from "react";
import { FaFolder, FaTrash } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";
import { MdEditDocument } from "react-icons/md";
// @ts-ignore
import { Form, Link } from "react-router-dom";
import { useHasRole } from "../../utils/roles";

type Props = {
  data: any;
};

function GraduateSessionCardItem({ data }: Props) {
  const canEditGraduateSession = useHasRole("ais", ["graduation::admin"]);

  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group font-roboto">
      <h2 className="text-base md:text-base font-semibold text-gray-500 uppercase">
        {" "}
        {data?.title?.toUpperCase()}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          {/* <div className="text-sm md:text-sm text-primary-dark/70 font-bold capitalize">YEAR {data?.year} - {data?.semester}</div> */}
          {data?.default && (
            <div className="py-0.5 px-2 text-sm rounded bg-primary/60 text-white font-bold">
              DEFAULT
            </div>
          )}
        </div>
      </div>
      <div className="space-y-1">
        {data.start && (
          <div className="flex items-center space-x-4">
            <IoIosTime className="h-4 w-5 text-primary/70" />
            <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
              Graduation Starts: &nbsp;&nbsp;&nbsp;
              <b>{moment(data.start).format("MMM DD, YY")}</b>
            </span>
          </div>
        )}
        {data.end && (
          <div className="flex items-center space-x-4">
            <IoIosTime className="h-4 w-5 text-primary/70" />
            <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
              Graduation Ends:&nbsp;&nbsp;&nbsp;
              <b>{moment(data.end).format("MMM DD, YY")}</b>
            </span>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <IoIosTime className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
            Graduates:&nbsp;<b>{data?._count?.graduate || 0}</b>
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center md:justify-between space-x-2 group">
          <Link
            to={`${encodeURIComponent(data?.id)}/graduants`}
            className="py-0.5 px-2 rounded flex items-center space-x-1.5 bg-primary/60"
          >
            {/* <FcViewDetails className="h-4 w-4 text-white"/> */}
            <FaFolder className="h-4 w-4 text-amber-200" />
            <span className="text-sm text-white font-semibold">View</span>
          </Link>
          {canEditGraduateSession ? (
            <>
              <Link
                to={`${encodeURIComponent(data?.id)}/edit`}
                className="py-0.5 px-2 rounded flex items-center space-x-1.5 bg-primary/60"
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
                className="py-0.5 px-2 rounded flex items-center space-x-1.5 bg-secondary-accent"
              >
                <FaTrash className="h-3 w-4 text-pink-100" />
                <button type="submit" className="text-sm text-white font-semibold">
                  Delete
                </button>
              </Form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default GraduateSessionCardItem;
