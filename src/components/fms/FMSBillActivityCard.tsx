import moment from "moment";
import React from "react";
import { BsActivity } from "react-icons/bs";
import { useRouteLoaderData } from "react-router-dom";
const { REACT_APP_API_URL } = import.meta.env;

type Props = { data?: any };

function FMSBillActivityCard({ data }: Props) {
  const bill: any = useRouteLoaderData("billId");
  console.log(bill);
  return (
    <div className="w-full space-y-3 rounded">
      <h1 className="text-sm font-bold font-roboto tracking-wider text-primary-dark/60 flex flex-col md:flex-row justify-between">
        <span className="px-3 py-0.5 rounded bg-primary/70 text-xs text-white font-bold flex items-center">
          {data?.length} RECORDS
        </span>
      </h1>
      <div className="w-full rounded-lg shadow-md text-xs overflow-x-scroll md:overflow-hidden">
        <div className="px-3 py-2 bg-primary/10 text-primary-dark/70 font-bold grid grid-cols-4 tracking-wider text-center">
          <span className="">PUBLISHED DATE</span>
          <span className="">BILL AMOUNT</span>
          <span className="">BILL DISCOUNT</span>
          <span className="">NUMBER OF RECEIPIENTS</span>
        </div>
        {data &&
          data?.map((row: any) => (
            <div
              title={row.receivers.join("\n")}
              className="px-3 py-2 border-b grid grid-cols-4 font-medium text-xs text-primary/80 text-center"
            >
              <span className="font-semibold ">
                {row.createdAt &&
                  moment(row.createdAt).format("LL").toUpperCase()}
              </span>
              <span className="font-semibold">
                {bill.data?.currency} {row.amount || 0}
              </span>
              <span className="font-semibold">
                {bill.data?.currency} {row.discount || 0}
              </span>
              <span className="font-semibold">{row.receivers?.length}</span>
            </div>
          ))}
        {!data ? (
          <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-3">
            <BsActivity className="h-14 w-14 text-primary/30 border rounded-md" />
            <span className="text-primary/40 font-medium">No Activity</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default FMSBillActivityCard;
