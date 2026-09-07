import React from "react";
import { FaShippingFast } from "react-icons/fa";
// @ts-ignore
import moment from "moment";
import { FaEnvelopeOpenText } from "react-icons/fa6";
import { LuReceiptCent } from "react-icons/lu";
import { TbMessage2Check } from "react-icons/tb";
import { Link } from "react-router-dom";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function ServiceListItem({ data }: Props) {
  const statusStyle =
    data.status == "COMPLETED"
      ? "bg-primary/10 text-primary"
      : !data.receipient
      ? "bg-red-50 text-red-500"
      : "bg-primary-accent/10 text-primary-accent";
  return (
    <div className="px-4 md:px-6 py-4 grid md:grid-cols-8 gap-3 md:gap-4 md:items-center border-b border-slate-50 last:border-0 hover:bg-slate-50/70 transition-colors">
      <div className="md:col-span-2 flex flex-col space-y-1.5">
        <ListHeading title="Document" />
        <div className="flex items-center space-x-3 min-w-0">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-primary-accent/10 flex items-center justify-center">
            <TbMessage2Check className="h-4 w-4 text-primary-accent" />
          </div>
          <span className="text-sm font-medium text-primary truncate">{data?.transact?.transtype?.title}</span>
        </div>
      </div>
      <div className="flex flex-col space-y-1.5">
        <ListHeading title="Transact ID" />
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <LuReceiptCent className="h-4 w-4 text-slate-400" />
          <span>{data?.transact?.transtag || data.transactId}</span>
        </div>
      </div>

      <div className="flex flex-col space-y-1.5">
        <ListHeading title="Type" />
        <span className="text-sm text-slate-500 capitalize">
          {data?.version || "NOT SET"}
        </span>
      </div>
      <div className="flex flex-col space-y-1.5">
        <ListHeading title="Quantity" />
        <span className="text-sm font-semibold text-primary">
          {data?.quantity || "-"}
        </span>
      </div>
      <div className="flex flex-col space-y-1.5">
        <ListHeading title="Status" />
        <span className={`inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${data.status == "COMPLETED" ? "bg-primary" : !data.receipient ? "bg-red-500" : "bg-primary-accent"}`} />
          {data?.status}
        </span>
      </div>
      <div className="flex flex-col space-y-1.5">
        <ListHeading title="Created On" />
        <span className="text-sm text-slate-500">
          {data?.createdAt &&
            moment(data?.createdAt).format("MMM DD, YYYY")?.toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col space-y-1.5 md:items-end">
        <ListHeading title="Action" />
        <div className="flex items-center space-x-2">
          <Link
            to={`${data?.id}`}
            title="Request Information"
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${statusStyle}`}
          >
            <FaEnvelopeOpenText className="h-4 w-4" />
          </Link>
          {!["COMPLETED", "PRINTED"].includes(data.status) && (
            <Link
              to={`${data?.id}/edit`}
              title="Update Delivery or Receipient Information"
              className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
            >
              <FaShippingFast className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceListItem;
