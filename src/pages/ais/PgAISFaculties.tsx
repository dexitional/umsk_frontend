import React from "react";
import { redirect, useLoaderData } from "react-router-dom";
import FacultyListView from "../../components/ais/FacultyListView";
import PageTitle from "../../components/ais/PageTitle";
import Service from "../../utils/aisService";

type Props = {};
export async function action({ params }) {
  // await Service.deleteRole(params.roleId);
  return redirect("/ais/departments");
}

export async function loader() {
  const data = await Service.fetchFaculties();
  return { data };
}

function PgAISFaculties({}: Props) {
  const { data }: any = useLoaderData();
  console.log(data)
  
  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Faculties"
        createtext=""
        createlink="create"
        setView={() => null}
        view={""}
      />
      <div className="">
        <FacultyListView data={data} />
      </div>
    </div>
  );
}

export default PgAISFaculties;
