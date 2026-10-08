import React from "react";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import AccessWorkspace from "../../components/ais/access/AccessWorkspace";
import Service from "../../utils/aisService";
import { useHasRole } from "../../utils/roles";

// One person's access workspace, opened from Access Control (/ais/roles/:tag)
// -- works for any account, including non-staff ones holding roles.
export async function loader({ params }) {
  const [overview, person] = await Promise.all([Service.fetchAccessOverview(), Service.fetchUserAccess(params.tag)]);
  return { overview, person };
}

function PgAISRoleUser() {
  const { overview, person }: any = useLoaderData();
  const canEdit = useHasRole("ais", ["access::admin"]);
  const revalidator = useRevalidator();
  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4">
      <Link to="/ais/roles" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary">
        <HiOutlineArrowLeft className="h-4 w-4" /> Access Control
      </Link>
      <AccessWorkspace
        key={`${person?.tag}:${(person?.roles || []).map((r: any) => r.userRoleId).join(",")}`}
        overview={overview}
        person={person}
        canEdit={canEdit}
        onSaved={() => revalidator.revalidate()}
      />
    </div>
  );
}

export default PgAISRoleUser;
