import React from "react";
import { FaTrash } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
// @ts-ignore
import { Form, Link } from "react-router-dom";
import Logo from "../../assets/img/logo/ucc/logo.png";
import ListHeading from "./ListHeading";

type Props = {
  data: any;
};

function RoleListItem({ data }: Props) {
  return (
    <div className="px-3 md:px-6 pb-4 grid md:grid-cols-6 gap-y-4 md:gap-y-0 md:gap-x-2 md:place-items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50 group">
      <div className="md:col-span-2 md:place-self-start flex flex-col space-y-2">
        <ListHeading title="Username" />
        <div className="px-2 flex items-center space-x-3 md:space-x-4">
          <img
            src={`https://cdn.ucc.edu.gh/photos/?tag=${data?.tag}` ?? Logo}
            className="h-8 w-8 object-contain"
          />
          <span>{data?.username}</span>
        </div>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Identity" />
        <span className="px-2">{data?.tag}</span>
      </div>
      <div className="flex flex-col space-y-2 md:text-center">
        <ListHeading title="Role" />
        <span className="px-2 capitalize">{data?.role_name.toLowerCase()}</span>
      </div>
      <div className="capitalize flex flex-col space-y-2">
        <ListHeading title="Status" />
        <span className="px-2">{data?.status ? "Enabled" : "Disabled"}</span>
      </div>
      <div className="flex flex-col space-y-2">
        <ListHeading title="Action" />
        {data?.role_name.toLowerCase() != "dric techlead" ? (
          <div className="px-2 md:ml-6 w-fit flex items-center justify-evenly space-x-2">
            <Link
              to={`${data?.id}/edit`}
              className="p-2 rounded-full flex items-center space-x-1.5 bg-blue-950/50"
            >
              <MdEditDocument className="h-4 w-4 text-green-100" />
              <span className="hidden text-sm text-white font-semibold">
                Edit
              </span>
            </Link>
            <Form
              method="post"
              action={`${data?.id}/destroy`}
              onSubmit={(e) => {
                if (!confirm("Do you want to delete")) e.preventDefault();
                return false;
              }}
              className="p-2 rounded-full flex items-center space-x-1.5 bg-blue-950/50"
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
        ) : (
          <div className="px-2 md:ml-6 w-fit flex flex-col items-center justify-center space-y-1">
            <span className="text-[0.65rem] italic text-center">
              TECH SUPPORT
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoleListItem;
