import ReactHtml from "html-react-parser";
import React from "react";
import { CgTemplate } from "react-icons/cg";
import { FaTrash } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { PiSignatureBold } from "react-icons/pi";
import { Form, Link } from "react-router-dom";

type Props = {
  data: any;
};

function LetterCardItem({ data }: Props) {
  return (
    <div className="p-4 md:p-6 min-h-max border border-primary/20 rounded-xl bg-slate-50/50 hover:bg-slate-100 space-y-4 md:group">
      {/* <h2 className="text-base md:text-lg font-semibold font-noto text-gray-500 uppercase">{data?.id}</h2> */}
      <div className="w-full flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <div className="flex-1 text-sm md:text-sm text-primary-accent/70 font-bold font-roboto capitalize">
            {(data?.title).toUpperCase()}
          </div>
          <div className="py-0.5 px-2 w-fit text-xs rounded bg-primary/60 text-white font-bold">
            {data?.category.id}
          </div>
        </div>
      </div>
      <div className="w-full space-y-1 font-roboto">
        <div className="flex items-center space-x-4">
          <span className="px-4 py-2 w-full bg-green-50 rounded border text-sm text-gray-500">
            <b>Signatory</b> &nbsp;&nbsp;&nbsp;
            <br />
            <div className="ml-4 mt-2 text-xs">
              <em>{ReactHtml(data.signatory)}</em>
            </div>
          </span>
        </div>
        <div className="px-4 flex items-center space-x-2">
          <div className="h-14 w-14">
            <PiSignatureBold className="h-14 w-14 text-primary/70" />
          </div>
          <span className="px-2 py-1 bg-white border rounded-lg text-sm text-gray-500 relative ">
            <img src={data.signature} className="h-10 w-full object-fill" />
          </span>
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <div className="px-3 py-2 opacity-80 md:opacity-100 md:hidden flex rounded-md border bg-blue-50/30 items-center md:justify-between space-x-2 md:group">
          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`${
                !data?.completeStatus
                  ? "bg-primary-dark/60"
                  : "bg-primary-accent/60"
              } py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              STATUS
            </span>
            <span className="font-semibold font-roboto text-sm text-primary/60">
              {data?.status == 1 ? "ENABLED" : "DISABLED"}
            </span>
          </div>
        </div>
        <div className="px-3 py-2 opacity-80 md:opacity-100 flex rounded-md border bg-white items-center space-x-2 group">
          <Link
            to={`${encodeURIComponent(data?.id)}`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            <CgTemplate className="h-4 w-4 text-amber-200" />
            <span className="text-sm text-white font-semibold">View</span>
          </Link>
          <Link
            to={`${encodeURIComponent(data?.id)}/edit`}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary/60"
          >
            <MdEditDocument className="h-4 w-4 text-green-200" />
            <span className="text-sm text-white font-semibold">Edit</span>
          </Link>
          <Form
            method="post"
            action={`${data?.id}/destroy`}
            onSubmit={(e) => {
              if (!confirm("Do you want to delete")) e.preventDefault();
              return false;
            }}
            className="py-0.5 px-2 rounded flex md:hidden group-hover:flex items-center space-x-1.5 bg-primary-accent/60"
          >
            <FaTrash className="h-3 w-4 text-pink-100" />
            <button type="submit" className="text-sm text-white font-semibold">
              Delete
            </button>
          </Form>
          <div className="hidden md:flex md:group-hover:hidden items-center justify-center space-x-3 text-center">
            <span
              className={`${
                !data?.completeStatus
                  ? "bg-primary-dark/60"
                  : "bg-primary-accent/60"
              } py-0.5 px-2 rounded flex items-center space-x-1.5 text-sm text-white font-semibold`}
            >
              STATUS
            </span>
            <span className="font-semibold font-roboto text-sm text-primary/60">
              {data?.status == 1 ? "ENABLED" : "DISABLED"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LetterCardItem;
