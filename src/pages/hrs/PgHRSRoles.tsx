import React from "react";
import { redirect, useLoaderData } from "react-router-dom";
import PageTitle from "../../components/hrs/PageTitle";
import RoleListView from "../../components/hrs/RoleListView";
import Service from "../../utils/aisService";

type Props = {};
export async function action({ params }) {
  await Service.deleteRole(params.roleId);
  return redirect("/hrs/roles");
}

export async function loader() {
  const data = await Service.fetchRoles();
  return { data };
}

function PgHRSRoles({}: Props) {
  const { data }: any = useLoaderData();

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Roles"
        createtext="New Role"
        createlink="create"
        setView={() => null}
        view={""}
      />
      <div className="">
        <RoleListView data={data} />
      </div>
    </div>
  );
}

export default PgHRSRoles;
