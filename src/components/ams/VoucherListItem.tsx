import React from "react";
import { MdLockReset } from "react-icons/md";
// @ts-ignore
import { BiSolidSend } from "react-icons/bi";
import { PiMoneyBold } from "react-icons/pi";
import { Form, Link } from "react-router-dom";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function VoucherListItem({ data }: Props) {
  return (
    <div className="px-3 md:px-6 pb-4 grid md:grid-cols-7 gap-y-4 md:gap-y-0 md:gap-x-2 md:place-items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group">
      <div className=" md:place-self-start flex flex-col space-y-2">
        <ListHeading title="Serial" />
        <div className="flex items-center">
          <code>{data.serial}</code>
        </div>
      </div>
      <div className="capitalize md:place-self-start flex flex-col space-y-2">
        <ListHeading title="Pin" />
        <code className="lowercase tracking-wider">{data.pin}</code>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Sold" />
        <span className="px-2">{data.soldAt ? "YES" : "NO"}</span>
      </div>
      <div className="capitalize md:col-span-2 md:place-self-start  flex flex-col space-y-2">
        <ListHeading title="Buyer Name" />
        <span className="px-2">{data?.applicantName || "Not Sold"}</span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Admitted" />
        <span className="px-2">{data?.applicantPhone || "-- "}</span>
      </div>

      <div className="flex flex-col space-y-2">
        <ListHeading title="Action" />
        <div className="px-2 md:ml-6 w-fit flex items-center justify-evenly space-x-2">
          {/* <Link to={`${encodeURIComponent(data?.id)}/profile`} className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50">
                    <FcViewDetails className="h-4 w-4 text-white"/>
                    <span className="hidden text-sm text-white font-semibold">View</span>
                </Link> */}
          {/* <Link to={`${encodeURIComponent(data?.id)}/edit`}  className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50">
                    <MdEditDocument className="h-4 w-4 text-green-100"/>
                    <span className="hidden text-sm text-white font-semibold">Edit</span>
                </Link>
                <Form method="post" action={`${encodeURIComponent(data?.id)}/destroy`} onSubmit={(e)=> { if(!confirm("Do you want to delete")) e.preventDefault(); return false; }} className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50">
                   <FaTrash className="h-4 w-4 text-pink-100" />
                   <button type="submit" className="hidden text-sm text-white font-semibold">Delete</button>
                </Form> */}

          {!data.soldAt && (
            <Link
              to={`${encodeURIComponent(data?.serial)}/sell`}
              className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/60"
            >
              <PiMoneyBold className="h-4 w-4 text-white" />
              <span className="hidden text-sm text-white font-semibold">
                Sell
              </span>
            </Link>
          )}
          {data.soldAt && (
            <>
              <Form
                method="post"
                action={`${encodeURIComponent(data?.serial)}/recover`}
                onSubmit={(e) => {
                  if (!confirm("Recover voucher?")) e.preventDefault();
                  return false;
                }}
                className="p-2 rounded-full cursor-pointer flex items-center space-x-1.5 bg-primary/60"
              >
                <BiSolidSend className="h-4 w-4 text-white" />
                <button
                  type="submit"
                  className="hidden text-sm text-white font-semibold"
                >
                  Recover
                </button>
              </Form>
              <Form
                method="post"
                action={`${encodeURIComponent(data?.serial)}/reset`}
                onSubmit={(e) => {
                  if (!confirm("Reset voucher?")) e.preventDefault();
                  return false;
                }}
                className="p-2 rounded-full cursor-pointer flex md:flex items-center space-x-1.5 bg-primary-accent/60"
              >
                <MdLockReset className="h-4 w-4 text-white" />
                <button
                  type="submit"
                  className="hidden text-sm text-white font-semibold"
                >
                  Reset
                </button>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoucherListItem;
