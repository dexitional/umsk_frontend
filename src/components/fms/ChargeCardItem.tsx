import moment from "moment";
import React from "react";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";
import { HiMiniAcademicCap } from "react-icons/hi2";
import { MdEditDocument, MdOutlineDateRange } from "react-icons/md";
import { Form, Link } from "react-router-dom";
import Logo from "../../assets/img/logo.webp";
import { useHasRole } from "../../utils/roles";

const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
};

function ChargeCardItem({ data }: Props) {
  const canManageCharge = useHasRole("fms", ["charge::admin"]);
  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-2 md:group font-roboto">
      <h2 className="text-sm font-semibold text-gray-500 uppercase">
        {data?.title}
      </h2>
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="w-full flex items-center justify-between space-x-2">
          <div className="text-sm md:text-sm text-primary-dark/70 font-bold capitalize">
            {(
              data?.student?.fname +
              " " +
              (data?.student?.mname ? data?.student?.mname + " " : "") +
              data?.student?.lname
            ).toUpperCase()}
          </div>
          <div className="py-0.5 px-2 text-sm rounded bg-primary/60 text-white font-bold">
            {data?.student?.gender}
          </div>
        </div>
        <img
          crossOrigin="anonymous"
          src={
            `${REACT_APP_API_URL}/auth/photos/?tag=${data?.student?.id}` || Logo
          }
          className="p-1 h-12 w-12 border rounded-md bg-white object-contain"
        />
      </div>
      <div className="space-y-2">
        <div className="mb-4 px-4 py-1 w-fit flex items-center space-x-4 rounded bg-primary-dark/10">
          <span className={`text-gray-500 text-sm  font-bold capitalize`}>
            {data?.type}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <HiMiniAcademicCap className="shrink-0 h-5 w-5 text-primary/70" />
          <span
            className={`${
              data.student?.program?.longName ? "text-gray-500" : "text-red-500"
            } text-xs  font-bold capitalize`}
          >
            {data?.student?.program?.longName || "Not assigned"}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <AiOutlineFieldNumber className="h-4 w-5 text-primary/70" />
          <span className="text-xs text-gray-500 font-semibold tracking-wide">
            STUDENT ID:&nbsp;&nbsp; {data?.student?.id || "Not Set"}
          </span>
        </div>
        <div className="mt-10 flex items-center space-x-4">
          <MdOutlineDateRange className="h-4 w-5 text-primary/70" />
          <div
            className={`bg-green-50 px-2 py-0.5 rounded border text-xs font-semibold text-gray-500`}
          >
            {data?.createdAt &&
              moment(data?.createdAt)
                .format("DD-MMM-YYYY h:mm a")
                .toUpperCase()}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center md:justify-start space-x-2 group">
          {canManageCharge ? (
          <Link
            to={`${encodeURIComponent(data?.id)}/edit`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            <MdEditDocument className="h-4 w-4 text-green-200" />
            <span className="text-sm text-white font-semibold">Edit</span>
          </Link>
          ) : null}

          {canManageCharge ? (
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
            <button type="submit" className="text-sm text-white font-semibold">
              Delete
            </button>
          </Form>
          ) : null}
          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`bg-green-800/70 py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              AMOUNT
            </span>
            <span className="font-semibold text-base text-primary/60">
              {data?.currency == "GHC" ? "GH₵" : data?.currency} {data?.amount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChargeCardItem;
