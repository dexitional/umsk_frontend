import React from "react";
import { FaTrash } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { GiTimeBomb } from "react-icons/gi";
import { IoTimer } from "react-icons/io5";
import { MdCategory, MdEditDocument } from "react-icons/md";
import { Form, Link } from "react-router-dom";
import ProgressBar from "./ProgressBar";
// @ts-ignore
import moment from "moment";
import Logo from "../../assets/img/logo/ucc/logo.png";

type Props = {
  data: any;
};

function ProjectCardItem({ data }: Props) {
  return (
    <div className="p-4 md:p-6 min-h-max border rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 group">
      <h2 className="text-base md:text-lg font-semibold font-noto text-gray-500">
        {data?.title}
      </h2>
      <div className="w-full flex items-center justify-between space-x-3">
        <div className="flex items-center justify-between space-x-3">
          <div className="text-base text-gray-400">
            {data.phaseCount} Phases
          </div>
          <div className="py-0.5 px-2 text-sm rounded bg-blue-950/60 text-white font-bold">
            {data?.amount}
          </div>
        </div>
        <img
          src={Logo}
          className="p-1 h-12 w-12 border rounded-md bg-white object-contain"
        />
      </div>
      <div className="space-y-1">
        <div className="flex items-center space-x-4">
          <IoTimer className="rotate-90 h-5 w-5 text-blue-950/70" />
          <span className="text-sm text-gray-500">
            {moment(data?.end).diff(data?.start, "months")} Months duration
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <GiTimeBomb className="h-5 w-5 text-blue-950/70" />
          <span className="text-sm text-gray-500">
            Starts -{" "}
            {data?.start && moment(data?.start).format("MMMM DD, YYYY")}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <GiTimeBomb className="h-5 w-5 text-blue-950/70" />
          <span className="text-sm text-gray-500 italic">
            Ends - {data?.end && moment(data.end).format("MMMM DD, YYYY")}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <MdCategory className="h-5 w-5 text-blue-950/70" />
          <div className="text-sm text-gray-500 flex space-x-2">
            Project Type - &nbsp;
            <pre className="font-semibold">{data?.type}</pre>
          </div>
        </div>
        <div className="pt-6 px-6">
          <ProgressBar
            value={(data?.phases?.length / data?.phaseCount) * 100}
          />
        </div>
      </div>

      <div className="px-3 py-2 opacity-80 md:opacity-100 flex md:hidden group-hover:flex rounded-md border bg-white items-center md:justify-between space-x-2">
        <Link
          to={`${data?.id}`}
          className="py-0.5 px-2 rounded flex items-center space-x-1.5 bg-blue-950/60"
        >
          <FcViewDetails className="h-4 w-4 text-white" />
          <span className="text-sm text-white font-semibold">View</span>
        </Link>
        <Link
          to={`${data?.id}/edit`}
          className="py-0.5 px-2 rounded flex items-center space-x-1.5 bg-blue-950/60"
        >
          <MdEditDocument className="h-4 w-4 text-green-100" />
          <span className="text-sm text-white font-semibold">Edit</span>
        </Link>
        <Form
          method="post"
          action={`${data?.id}/destroy`}
          onSubmit={(e) => {
            if (!confirm("Do you want to delete")) e.preventDefault();
            return false;
          }}
          className="py-0.5 px-2 rounded flex items-center space-x-1.5 bg-blue-950/60"
        >
          <FaTrash className="h-3 w-4 text-pink-100" />
          <button type="submit" className="text-sm text-white font-semibold">
            Delete
          </button>
        </Form>
      </div>
    </div>
  );
}

export default ProjectCardItem;
