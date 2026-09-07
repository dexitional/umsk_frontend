import React, { useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import PageTitle from "../../components/hrs/PageTitle";
import ProjectCardItem from "../../components/hrs/ProjectCardItem";
import ProjectListView from "../../components/hrs/ProjectListView";
import Service from "../../utils/aisService";
type Props = {};

export async function action({ params }) {
  await Service.deleteFunder(params.projectId);
  return redirect("/dric/projects");
}

export async function loader() {
  const data = await Service.fetchProjects();
  return { data };
}

function PgDricProjects({}: Props) {
  // project - [ list, short overview with modal ]

  // project/:projectId  - [ overview, editProject, deleteProject ]

  // project/:projectId/phases - [ list, createPhase ]
  // project/:projectId/phases/phaseId - [ overview - with activities, editPhase, deletePhase, createActivity ]
  // project/:projectId/phases/phaseId/activityId - [ overview - with personel, editActivity, deleteActivity ]

  // project/:projectId/report - [ overview ] - modal

  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Projects"
        createtext="New Project"
        createlink="create"
        setView={setView}
        view={view}
      />
      <div className="">
        {view == "card" && (
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {data &&
              data?.map((row: any) => (
                <ProjectCardItem key={row.id} data={row} />
              ))}
            {!data && (
              <div className="p-3 border rounded-xl">
                <h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">
                  No Records ...
                </h1>
              </div>
            )}
          </div>
        )}

        {view == "list" && <ProjectListView data={data} />}
      </div>
    </div>
  );
}

export default PgDricProjects;
