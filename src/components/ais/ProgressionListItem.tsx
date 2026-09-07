import React from "react";
import { FaTrash } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { MdEditDocument } from "react-icons/md";
// @ts-ignore
import moment from "moment";
import { Form, Link } from "react-router-dom";
import Logo from "../../assets/img/logo/aucc/logo.png";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function ProgressionListItem({ data }: Props) {
  return (
    <div className="px-3 md:px-6 pb-4 grid md:grid-cols-9 gap-y-4 md:gap-y-0 md:gap-x-2 md:place-items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group">
      <div className="md:col-span-2 md:place-self-start flex flex-col space-y-2">
        <ListHeading title="Student Name" />
        <div className="px-2 flex items-center space-x-3 md:space-x-4">
          <img src={Logo} className="h-5 w-5 object-contain" />
          <span>
            {(
              data?.student?.fname +
              " " +
              (data?.student?.mname && data?.student?.mname + " ") +
              data?.student?.lname
            ).toUpperCase()}
          </span>
        </div>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Index Number" />
        <span className="px-2">{data?.student?.indexno}</span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Programme" />
        <span className="px-2 md:pl-6">{data?.student?.program?.longName}</span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Level" />
        <span className="px-2">
          {Math.ceil(data?.student?.semesterNum / 2) * 100}
        </span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Courses" />
        <span className="px-2">{data?.courses}</span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Credits" />
        <span className="px-2">{data?.credits}</span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Date" />
        <span className="px-2">
          {(data?.createdAt &&
            moment(data?.createdAt).format("MMM DD, YYYY")) ||
            "Not Set"}
        </span>
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
              Slip
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
        </div>
      </div>
    </div>
  );
}

export default ProgressionListItem;
