import React, { useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import PageTitle from "../../components/ais/PageTitle";
import RoleListView from "../../components/ais/RoleListView";
import Service from "../../utils/aisService";

type Props = {};

export async function action({ params }) {
  await Service.deleteUserRole(params.roleId);
  return redirect("/ais/roles");
}

export async function loader({ request }) {
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || 9;
  const data = await Service.fetchUserRoles(search, page, limit);
  return { data, search, page };
}

function PgAISRoles({}: Props) {
  const [view, setView] = useState("list");
  const { data }: any = useLoaderData();

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Roles"
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      <RoleListView data={data?.data} />
    </div>
  );
}

export default PgAISRoles;
