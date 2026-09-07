import moment from "moment";
import React from "react";
import { BiCalendarCheck, BiSolidSend } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { IoPeople } from "react-icons/io5";
import { MdEditDocument } from "react-icons/md";
// @ts-ignore
import { Form, Link } from "react-router-dom";
import { useHasRole } from "../../utils/roles";

type Props = {
  data: any;
};

function CircularCardItem({ data }: Props) {
  const canManageCircular = useHasRole("ais", ["circular::admin"]);

  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group">
      <h2 className="text-base md:text-sm font-semibold font-noto text-gray-500 uppercase">
        {" "}
        {data?.title?.toUpperCase()}
      </h2>
      <div className="space-y-1 font-roboto">
        <div className="flex items-center space-x-4">
          <IoPeople className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500 capitalize">
            Receiver:&nbsp;<b>{data?.receiver?.toLowerCase()}</b>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <BiCalendarCheck className="h-4 w-5 text-primary/70" />
          <span className="px-2 py-0 bg-green-50 rounded border text-sm text-gray-500 capitalize">
            Created On:&nbsp;<b>{moment(data?.createdAt).format("LL")}</b>
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center md:justify-between space-x-2 group">
          {canManageCircular ? (
            <>
              <Form
                method="post"
                action={`${encodeURIComponent(data?.id)}/send`}
                onSubmit={(e) => {
                  if (!confirm("Send circulars ?")) e.preventDefault();
                  return false;
                }}
              >
                <fieldset className="py-0.5 px-2 cursor-pointer rounded flex items-center space-x-1.5 bg-primary/60">
                  <BiSolidSend className="h-4 w-4 text-white" />
                  <button
                    type="submit"
                    className="text-sm text-white font-semibold"
                  >
                    Send
                  </button>
                </fieldset>
              </Form>
              <Link
                to={`${encodeURIComponent(data?.id)}/edit`}
                className="py-0.5 px-2 rounded flex items-center space-x-1.5 bg-primary/60"
              >
                <MdEditDocument className="h-4 w-4 text-green-200" />
                <span className="text-sm text-white font-semibold">Edit</span>
              </Link>
              <Form
                method="post"
                action={`${encodeURIComponent(data?.id)}/destroy`}
                onSubmit={(e) => {
                  if (!confirm("Do you want to delete")) e.preventDefault();
                  return false;
                }}
              >
                <fieldset className="py-0.5 px-2 rounded flex items-center space-x-1.5 bg-primary-accent/60">
                  <FaTrash className="h-3 w-4 text-pink-100" />
                  <button
                    type="submit"
                    className="text-sm text-white font-semibold"
                  >
                    Delete
                  </button>
                </fieldset>
              </Form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CircularCardItem;
