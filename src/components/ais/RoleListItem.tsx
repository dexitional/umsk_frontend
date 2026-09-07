import React from "react";
import { FaTrash } from "react-icons/fa";
// @ts-ignore
import { Form } from "react-router-dom";
// @ts-ignore
import moment from "moment";
import Logo from "../../assets/img/logo/aucc/logo.png";
import { useHasRole } from "../../utils/roles";
import ListHeading from "./ListHeading";
const { REACT_APP_API_URL } = import.meta.env;

type Props = {
  data: any;
};

function RoleListItem({ data }: Props) {
  const canManageRoles = useHasRole("ais", ["hrm::admin"]);

  return (
    <div className="px-3 md:px-6 py-4 grid md:grid-cols-6 gap-y-4 md:gap-y-0 md:gap-x-2 items-center text-gray-500 border-b border-slate-200 hover:bg-slate-50/50">
      <div className="md:col-span-2 flex md:flex-row flex-col md:items-center space-y-2 md:space-y-0 md:space-x-3">
        <ListHeading title="User" />
        <img
          crossOrigin="anonymous"
          src={`${REACT_APP_API_URL}/auth/photos/?tag=${data?.tag}` || Logo}
          className="h-9 w-9 rounded-full object-cover bg-slate-100 border"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-primary-dark/80 capitalize">
            {data?.name}
          </span>
          <span className="text-xs text-slate-400 lowercase">
            {data?.mail || data?.tag}
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <ListHeading title="Permission" />
        <span className="w-fit px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-primary-accent/10 text-primary-accent border border-primary-accent/20">
          {data?.role}
        </span>
      </div>

      <div className="flex flex-col space-y-2">
        <ListHeading title="Context" />
        <span className="text-xs text-slate-500">{data?.roleMeta || "—"}</span>
      </div>

      <div className="flex flex-col space-y-2">
        <ListHeading title="Assigned Date" />
        <span className="text-xs text-slate-500">
          {data?.createdAt ? moment(data.createdAt).format("MMM DD, YYYY") : "—"}
        </span>
      </div>

      <div className="flex flex-col space-y-2">
        <ListHeading title="Action" />
        {canManageRoles ? (
          <Form
            method="post"
            action={`${data?.id}/destroy`}
            onSubmit={(e) => {
              if (!confirm(`Remove ${data?.role} from ${data?.name}?`)) e.preventDefault();
              return false;
            }}
          >
            <button
              type="submit"
              className="p-2 rounded-full flex items-center space-x-1.5 bg-primary/5 hover:bg-primary-accent/10 border border-primary/10 text-primary-dark/50 hover:text-primary-accent transition-colors"
              title="Remove role"
            >
              <FaTrash className="h-3.5 w-3.5" />
            </button>
          </Form>
        ) : null}
      </div>
    </div>
  );
}

export default RoleListItem;
