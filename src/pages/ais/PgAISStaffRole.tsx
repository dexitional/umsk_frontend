import React from "react";
import { BsShieldLock } from "react-icons/bs";
import { useLoaderData, useRevalidator } from "react-router-dom";
import AccessWorkspace from "../../components/ais/access/AccessWorkspace";
import Service from "../../utils/aisService";
import { useHasRole } from "../../utils/roles";

// Staff profile > Roles: the staff member's access workspace. Role data is
// restricted to Access Control administrators (access::admin), so others
// see a notice instead.
export async function loader({ params }) {
  try {
    const [overview, person] = await Promise.all([Service.fetchAccessOverview(), Service.fetchUserAccess(params.staffId)]);
    return { overview, person };
  } catch (error: any) {
    if (error?.response?.status === 403) return { forbidden: true };
    throw error;
  }
}

function PgAISStaffRole() {
  const { overview, person, forbidden }: any = useLoaderData();
  const canEdit = useHasRole("ais", ["access::admin"]);
  const revalidator = useRevalidator();

  if (forbidden) {
    return (
      <div className="flex w-full flex-col items-center justify-center space-y-3 rounded-xl border border-primary/10 p-10">
        <BsShieldLock className="h-14 w-14 text-primary/30" />
        <span className="text-sm font-medium text-primary/50">Only Access Control administrators can view system roles.</span>
      </div>
    );
  }
  return (
    <div className="w-full">
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

export default PgAISStaffRole;
