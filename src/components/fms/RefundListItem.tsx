import moment from "moment";
import React from "react";
import { FaTrash } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
// @ts-ignore
import { Form, Link } from "react-router-dom";
import Logo from "../../assets/img/logo.webp";
import { useHasRole } from "../../utils/roles";
import ListHeading from "./ListHeading";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
};

// Refund's own list-view row -- shows the refund record itself (student,
// type, amount, date), not a stale copy of a student-profile row.
function RefundListItem({ data }: Props) {
  const canManageRefund = useHasRole("fms", ["refund::admin"]);
  return (
    <div className="px-3 md:px-6 pb-4 grid md:grid-cols-7 gap-y-4 md:gap-y-0 md:gap-x-2 text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group">
      <div className="md:col-span-2 flex md:flex-row flex-col md:justify-start md:items-center md:space-y-0 space-y-2">
        <ListHeading title="Student" />
        <div className="px-2 flex items-center space-x-3 md:space-x-4 justify-self-start">
          <img
            crossOrigin="anonymous"
            src={`${REACT_APP_API_URL}/auth/photos/?tag=${data?.student?.id}` || Logo}
            className="h-5 w-5 object-contain"
          />
          <span>
            {(
              (data?.student?.fname || "") +
              " " +
              (data?.student?.mname ? data?.student?.mname + " " : "") +
              (data?.student?.lname || "")
            ).toUpperCase()}
          </span>
        </div>
      </div>
      <div className="capitalize flex flex-col space-y-2 self-center">
        <ListHeading title="Type" />
        <span className="px-2">{data?.type}</span>
      </div>
      <div className="capitalize flex flex-col space-y-2 self-center">
        <ListHeading title="Narrative" />
        <span className="px-2 md:pl-6">{data?.title}</span>
      </div>
      <div className="flex flex-col space-y-2 self-center">
        <ListHeading title="Amount" />
        <span className="px-2 font-semibold text-emerald-700">
          {data?.currency == "GHC" ? "GH₵" : data?.currency} {data?.amount}
        </span>
      </div>
      <div className="flex flex-col space-y-2 self-center">
        <ListHeading title="Date" />
        <span className="px-2">
          {data?.createdAt && moment(data?.createdAt).format("DD-MMM-YYYY").toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col space-y-2 self-center">
        <ListHeading title="Action" />
        <div className="px-2 md:ml-6 w-fit flex items-center justify-evenly space-x-2">
          {canManageRefund ? (
            <Link
              to={`${encodeURIComponent(data?.id)}/edit`}
              className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
            >
              <MdEditDocument className="h-4 w-4 text-green-100" />
              <span className="hidden text-sm text-white font-semibold">
                Edit
              </span>
            </Link>
          ) : null}
          {canManageRefund ? (
            <Form
              method="post"
              action={`${encodeURIComponent(data?.id)}/destroy`}
              onSubmit={(e) => {
                if (!confirm("Do you want to delete")) e.preventDefault();
                return false;
              }}
              className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/50"
            >
              <FaTrash className="h-4 w-4 text-pink-100" />
              <button
                type="submit"
                className="hidden text-sm text-white font-semibold"
              >
                Delete
              </button>
            </Form>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default RefundListItem;
