import React from "react";
import { FaTrash } from "react-icons/fa";
// @ts-ignore
import { Form, Link } from "react-router-dom";
import { useHasRole } from "../../utils/roles";

type Props = {
  data?: any;
};

function AISStaffRoleCard({ data }: Props) {
  const canManageRoles = useHasRole("ais", ["hrm::admin"]);

  return (
    <div className="w-full space-y-3 rounded">
      <h1 className="text-sm font-bold font-roboto tracking-wider text-primary-dark/60 flex flex-col md:flex-row md:justify-between space-y-2 md:space-y-0">
        <span className="px-3 py-0.5 rounded border border-primary/50">
          SYSTEM ROLES & PRIVILEGES
        </span>
        {canManageRoles ? (
          <Link
            to="create"
            className="px-3 py-0.5 w-fit rounded bg-primary/70 text-xs text-white font-bold flex items-center"
          >
            ADD ROLE
          </Link>
        ) : null}
      </h1>
      <div className="w-full rounded-lg shadow-md text-xs overflow-x-scroll md:overflow-hidden">
        <div className="px-3 py-2 bg-primary/10 text-primary-dark/70 font-bold hidden md:grid md:grid-cols-8 tracking-wider">
          <span>APP TAG</span>
          <span className="col-span-2">ROLE NAME</span>
          <span className="col-span-3">DESCRIPTION</span>
          <span>&nbsp;</span>
        </div>

        {data?.map((row: any) => (
          <div
            className={`px-3 py-2 border-b grid grid-cols-1 md:grid-cols-8 gap-y-2 md:gap-y-0 font-medium text-xs ${
              row.type == "E" ? "text-primary-dark/80" : "text-primary/80"
            }`}
          >
            <span className="font-bold uppercase">{row.app || row.module}</span>
            <span className="col-span-2 font-medium uppercase">
              {row.role}
            </span>
            <span className="col-span-3 uppercase">{row.roleDesc || "—"}</span>
            {/* <span className="uppercase">
                 <Link to="" className="px-3 py-0.5 w-fit rounded bg-primary-accent/70 text-[0.65rem] text-white font-bold flex items-center">REMOVE</Link>
              </span> */}
            {canManageRoles ? (
              <Form
                method="post"
                action={`${row?.id}/destroy`}
                onSubmit={(e) => {
                  if (!confirm("Do you want to delete")) e.preventDefault();
                  return false;
                }}
              >
                <label
                  htmlFor="btn"
                  className="px-3 py-0.5 w-fit rounded flex items-center space-x-1.5 bg-primary-accent/80 text-[0.65rem]"
                >
                  <FaTrash className="my-0.5 h-3 w-4 text-amber-100" />
                  <button
                    id="btn"
                    type="submit"
                    className="flex text-sm text-white font-semibold"
                  >
                    Remove
                  </button>
                </label>
              </Form>
            ) : null}
          </div>
        ))}
        {/* Totals */}
        {/* <div className="px-3 py-2 border-b grid grid-cols-8 font-bold text-xs text-primary-accent/80">
            <span>&nbsp;</span>
            <span className="col-span-4 font-bold">CGPA:&nbsp;&nbsp;&nbsp;{ cgpa && cgpa[index] || 0 }</span>
            <span>GPA:&nbsp;&nbsp;&nbsp;{gpa?.toFixed(1)}</span>
            <span>TCR:&nbsp;&nbsp;&nbsp;{ credit?.toFixed(1) }</span>
            <span>TGP:&nbsp;&nbsp;&nbsp;{ gradepoint?.toFixed(1) }</span>
          </div> */}
      </div>
    </div>
  );
}

export default AISStaffRoleCard;
