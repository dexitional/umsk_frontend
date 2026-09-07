import React from "react";
import { MdOutlinePayments } from "react-icons/md";
// @ts-ignore
import moment from "moment";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function FeeListItem({ data }: Props) {
  return (
    <div
      className={`${
        data.type == "PAYMENT" ? "bg-primary/5" : "bg-primary-accent/5"
      } px-3 md:px-6 pb-4 grid md:grid-cols-6 gap-y-4 md:gap-y-0 md:gap-x-2 md:place-items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group`}
    >
      <div className="md:col-span-2 md:place-self-start flex flex-col space-y-2">
        <ListHeading title="Narrative" />
        <div className="px-2 flex items-center space-x-3 md:space-x-4">
          <MdOutlinePayments
            className={`h-6 w-6 ${
              data.type == "PAYMENT"
                ? "text-primary/50"
                : "text-primary-accent/50"
            }`}
          />
          <span>{data?.narrative?.toUpperCase()}</span>
        </div>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Amount" />
        <span className="px-2">
          {data?.currency} {data?.amount}
        </span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Type" />
        <span className="px-2">{data?.type}</span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Reference" />
        <span className="px-2">
          {data?.transaction ? data?.transaction.transtag : "ACADEMIC-DEBT"}
        </span>
      </div>
      <div className="flex flex-col space-y-2 md:text-center">
        <ListHeading title="Date" />
        <span className="px-2 capitalize">
          {data?.createdAt &&
            moment(data?.createdAt).format("MMM DD, YYYY")?.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export default FeeListItem;
