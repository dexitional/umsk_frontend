import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdLockReset } from "react-icons/md";
import { Form, Link } from "react-router-dom";
// @ts-ignore
import { BiSolidSend } from "react-icons/bi";
import { IoMdPerson } from "react-icons/io";
import { PiMoneyBold } from "react-icons/pi";
import { TbNotes } from "react-icons/tb";
import { useHasRole } from "../../utils/roles";

type Props = {
  data: any;
};

function VoucherCardItem({ data }: Props) {
  const canManageVoucher = useHasRole("ams", ["voucher::admin", "voucher::clerk"]);

  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group">
      <div className="flex items-center space-x-4">
        <h2 className="text-sm md:text-base font-semibold font-noto text-gray-500 uppercase tracking-wider">
          {data?.serial}
        </h2>
        <div className="py-0.5 px-2 w-fit text-sm rounded bg-primary/60 text-white font-medium tracking-widest">
          {data.pin}
        </div>
        {data.soldAt && (
          <div className="flex-1 text-xs md:text-xs text-primary-dark/70 font-semibold font-roboto capitalize">
            SOLD
          </div>
        )}
      </div>

      <div className="space-y-1 font-roboto">
        <div className="flex items-center space-x-2">
          <TbNotes className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border text-sm text-primary/60 font-medium">
            {data?.category?.title}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <TbNotes className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border border-primary-accent/20 text-sm text-primary/60 font-medium">
            {" "}
            {data?.sellType == 0
              ? "General"
              : data?.sellType == 1
              ? "Matured"
              : "International"}
          </span>
        </div>

        {/* <div className="flex items-center space-x-4">
            <FaPeopleGroup className="h-4 w-5 text-primary/70" />
            <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">Serial: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{data?.serial }</b></span>
        </div>
        <div className="flex items-center space-x-4">
            <IoIosTime className="h-4 w-5 text-primary/70" />
            <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500">Pin: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{data?.pin}</b></span>
        </div> */}
        {data.applicantName && (
          <div className="flex items-center space-x-4">
            <IoMdPerson className="h-4 w-5 text-primary-accent/70" />
            <span className="px-2 py-0.5 bg-green-50 rounded border text-xs text-gray-500">
              Buyer: &nbsp;&nbsp;<b>{data.applicantName}</b>
            </span>
          </div>
        )}
        {data.applicantPhone && (
          <div className="flex items-center space-x-4">
            <FaPhoneAlt className="h-4 w-5 text-primary-accent/70" />
            <span className="px-2 py-0 bg-green-50 rounded border text-xs text-gray-500">
              Phone: &nbsp;&nbsp;<b>{data.applicantPhone}</b>
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center space-x-2 group">
          {!data.soldAt && canManageVoucher && (
            <Link
              to={`${encodeURIComponent(data?.serial)}/sell`}
              className="py-0.5 px-2 cursor-pointer rounded flex items-center space-x-1.5 bg-primary/60"
            >
              <PiMoneyBold className="h-4 w-4 text-white" />
              <span className="text-sm text-white font-semibold">Sell</span>
            </Link>
          )}
          {data.soldAt && canManageVoucher && (
            <Form
              method="post"
              action={`${encodeURIComponent(data?.serial)}/recover`}
              onSubmit={(e) => {
                if (!confirm("Recover voucher?")) e.preventDefault();
                return false;
              }}
              className="py-0.5 px-2 cursor-pointer rounded flex items-center space-x-1.5 bg-primary/60"
            >
              <BiSolidSend className="h-4 w-4 text-white" />
              <button
                type="submit"
                className="text-sm text-white font-semibold"
              >
                Recover
              </button>
            </Form>
          )}
          {data.soldAt &&
            canManageVoucher && (
              <Form
                method="post"
                action={`${encodeURIComponent(data?.serial)}/reset`}
                onSubmit={(e) => {
                  if (!confirm("Reset voucher?")) e.preventDefault();
                  return false;
                }}
                className="py-0.5 px-2 cursor-pointer rounded flex md:flex items-center space-x-1.5 bg-primary-accent/60"
              >
                <MdLockReset className="h-4 w-4 text-white" />
                <button
                  type="submit"
                  className="text-sm text-white font-semibold"
                >
                  Reset
                </button>
              </Form>
            )}
          {/* <Link to={`${encodeURIComponent(data?.id)}/edit`} className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60">
            <MdEditDocument className="h-4 w-4 text-green-200"/>
            <span className="text-sm text-white font-semibold">Edit</span>
          </Link> */}
          {/* <Form method="post" action={`${data?.id}/destroy`} onSubmit={(e)=> { if(!confirm("Do you want to delete")) e.preventDefault(); return false; }} className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary-accent/60">
            <FaTrash className="h-3 w-4 text-pink-100" />
            <button type="submit" className="text-sm text-white font-semibold">Delete</button>
          </Form> */}
        </div>
      </div>
    </div>
  );
}

export default VoucherCardItem;
