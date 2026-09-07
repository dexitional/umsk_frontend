import React from "react";
import { FaTrash } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { MdEditDocument } from "react-icons/md";
// @ts-ignore
import moment from "moment";
import { Form, Link } from "react-router-dom";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function SessionListItem({ data }: Props) {
  return (
    <div className="px-3 md:px-6 pb-4 grid md:grid-cols-7 gap-y-4 md:gap-y-0 md:gap-x-2 md:place-items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group">
      <div className="md:col-span-2 md:place-self-start flex flex-col space-y-2">
        <ListHeading title="Title" />
        <div className="px-2 flex items-center space-x-3 md:space-x-4">
          <span>{data.title}</span>
        </div>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Apply Start" />
        <span className="px-2">
          {moment(data.applyStart).format("MMM DD, YYYY")}
        </span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Apply End" />
        <span className="px-2">
          {moment(data.applyEnd).format("MMM DD, YYYY")}
        </span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Vouchers" />
        <span className="px-2">{data?._count?.voucher}</span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Admitted" />
        <span className="px-2">{data?._count?.fresher}</span>
      </div>

      <div className="flex flex-col space-y-2">
        <ListHeading title="Action" />
        <div className="px-2 md:ml-6 w-fit flex items-center justify-evenly space-x-2">
          <Link
            to={`${encodeURIComponent(data?.id)}/profile`}
            className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
          >
            <FcViewDetails className="h-4 w-4 text-white" />
            <span className="hidden text-sm text-white font-semibold">
              View
            </span>
          </Link>
          <Link
            to={`${encodeURIComponent(data?.id)}/edit`}
            className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
          >
            <MdEditDocument className="h-4 w-4 text-green-100" />
            <span className="hidden text-sm text-white font-semibold">
              Edit
            </span>
          </Link>
          <Form
            method="post"
            action={`${encodeURIComponent(data?.id)}/destroy`}
            onSubmit={(e) => {
              if (!confirm("Do you want to delete")) e.preventDefault();
              return false;
            }}
          >
            <button
              type="submit"
              className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
            >
              <FaTrash className="h-4 w-4 text-pink-100" />
              <span className="hidden text-sm text-white font-semibold">
                Delete
              </span>
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SessionListItem;
