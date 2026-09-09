import React from "react";
import { FaFolder, FaTrash } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { Form, Link } from "react-router-dom";
// @ts-ignore
import moment from "moment";
import { IoIosTime } from "react-icons/io";
import { useHasRole } from "../../utils/roles";

type Props = {
  data: any;
};

function EvaluationFormCardItem({ data }: Props) {
  const canEdit = useHasRole("ais", ["evaluation::admin"]);
  const canDelete = useHasRole("ais", ["evaluation::admin"]);

  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-100/50 hover:bg-slate-100 space-y-3 md:group font-roboto">
      <div className="flex items-center justify-between">
        <h2 className="text-base md:text-base font-semibold text-gray-500 uppercase">
          {data?.name}
        </h2>
        <div
          className={`py-0.5 px-1.5 text-[0.55rem] rounded font-bold text-white ${
            data?.status ? "bg-green-900/70" : "bg-gray-400"
          }`}
        >
          {data?.status ? "ENABLED" : "DISABLED"}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <span className="px-3 py-0.5 bg-white rounded shadow-[0px_0px_2px_#aaa_inset] text-xs text-gray-500/80">
          <b>{data?.key}</b>
        </span>
        <span className="text-xs text-gray-400">
          {data?._count?.questions ?? 0} question(s) · {data?._count?.guides ?? 0} guide(s)
        </span>
      </div>

      <div className="space-y-1">
        {data?.startDate && (
          <div className="flex items-center space-x-2">
            <IoIosTime className="h-4 w-5 text-green-700/70" />
            <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
              Opens: &nbsp;<b>{moment(data.startDate).format("MMM DD, YY HH:mm")}</b>
            </span>
          </div>
        )}
        {data?.endDate && (
          <div className="flex items-center space-x-2">
            <IoIosTime className="h-4 w-5 text-amber-700/70" />
            <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">
              Closes: &nbsp;<b>{moment(data.endDate).format("MMM DD, YY HH:mm")}</b>
            </span>
          </div>
        )}
        <div className="text-xs text-gray-400">
          Year Groups:{" "}
          <b>
            {data?.yearGroups?.length
              ? data.yearGroups.map((yg: any) => yg.yearGroup).sort().join(", ")
              : "All"}
          </b>
        </div>
      </div>

      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center md:justify-left space-x-2 group">
          <Link
            to={`${encodeURIComponent(data?.id)}`}
            className="py-0.5 px-2 rounded flex items-center space-x-1.5 bg-primary/60"
          >
            <FaFolder className="h-4 w-4 text-amber-200" />
            <span className="text-sm text-white font-semibold">View</span>
          </Link>

          {canEdit ? (
            <Link
              to={`${encodeURIComponent(data?.id)}/edit`}
              className="py-0.5 px-2 rounded flex items-center space-x-1.5 bg-primary/60"
            >
              <MdEditDocument className="h-4 w-4 text-green-200" />
              <span className="text-sm text-white font-semibold">Edit</span>
            </Link>
          ) : null}
          {canDelete ? (
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
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default EvaluationFormCardItem;
