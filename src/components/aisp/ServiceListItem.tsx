import React from "react";
// @ts-ignore
import moment from "moment";
import { HiOutlineDocumentText, HiOutlineEye, HiOutlineTruck } from "react-icons/hi2";
import { Link } from "react-router-dom";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function ServiceListItem({ data }: Props) {
  const tone =
    data.status == "COMPLETED"
      ? { pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" }
      : !data.receipient
      ? { pill: "bg-rose-50 text-rose-600 ring-rose-200", dot: "bg-rose-500" }
      : { pill: "bg-sky-50 text-sky-700 ring-sky-200", dot: "bg-sky-500" };
  return (
    <div className="aisp-row grid-cols-2 md:grid-cols-8">
      <div className="col-span-2 flex flex-col gap-1.5">
        <ListHeading title="Document" />
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
            <HiOutlineDocumentText className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-slate-800 truncate">{data?.transact?.transtype?.title}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <ListHeading title="Transact ID" />
        <span className="text-xs font-mono text-slate-500 truncate">{data?.transact?.transtag || data.transactId}</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <ListHeading title="Type" />
        <span className="text-sm text-slate-500 capitalize">
          {data?.version?.toLowerCase() || "Not set"}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <ListHeading title="Quantity" />
        <span className="text-sm font-bold text-slate-900 tabular-nums">
          {data?.quantity || "-"}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <ListHeading title="Status" />
        <span className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.68rem] font-bold tracking-wide ring-1 ring-inset ${tone.pill}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
          {data?.status}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <ListHeading title="Created On" />
        <span className="text-sm text-slate-500">
          {data?.createdAt && moment(data?.createdAt).format("MMM DD, YYYY")}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 md:items-end">
        <ListHeading title="Action" />
        <div className="flex items-center gap-2">
          <Link
            to={`${data?.id}`}
            title="Request Information"
            className="h-9 w-9 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-sky-100 hover:text-sky-700 transition-colors"
          >
            <HiOutlineEye className="h-4 w-4" />
          </Link>
          {!["COMPLETED", "PRINTED"].includes(data.status) && (
            <Link
              to={`${data?.id}/edit`}
              title="Update Delivery or Receipient Information"
              className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
                !data.receipient
                  ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/30 hover:brightness-110"
                  : "bg-sky-50 text-sky-700 hover:bg-sky-100"
              }`}
            >
              <HiOutlineTruck className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceListItem;
