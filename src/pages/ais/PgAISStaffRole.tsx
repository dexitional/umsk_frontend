import React from "react";
import { BsActivity } from "react-icons/bs";
import { Link, redirect, useLoaderData } from "react-router-dom";
import AISStaffRoleCard from "../../components/ais/AISStaffRoleCard";
import Service from "../../utils/aisService";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function action({ request, params }) {
  const id = params?.roleId || 0;
  const staffNo = params?.staffId;
  let resp = await Service.deleteUserRole(id);
  if (resp) {
    return redirect(`/ais/staff/${encodeURIComponent(staffNo)}/roles`);
  }
}

export async function loader({ params }) {
  const res = await Service.fetchUserRolesById(params.staffId);
  const data = Array.isArray(res) ? res : [];
  return { data };
}

function PgAISStaffRole({}: Props) {
  const { data }: any = useLoaderData();
  const canManageRoles = useHasRole("ais", ["hrm::admin"]);

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center space-y-8 md:space-y-8 ">
      <div className="flex w-full flex-1 flex-col space-y-8 md:space-y-10 ">
        {/* <div>{JSON.stringify(data?.meta)}</div> */}
        {data.length ? <AISStaffRoleCard data={data} /> : null}

        {!data?.length ? (
          <div className="p-10 border border-primary/10 rounded-xl flex flex-col items-center justify-center space-y-4">
            <BsActivity className="h-20 w-20 text-primary/30 border rounded-md" />
            <span className="text-primary/40 font-medium">
              No Privileges Assigned ...
            </span>
            {canManageRoles ? (
              <Link
                to="create"
                className="px-3 py-1 w-fit rounded bg-primary/70 text-xs text-white font-bold flex items-center"
              >
                ADD NEW STAFF ROLE
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PgAISStaffRole;
