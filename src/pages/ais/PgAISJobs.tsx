import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import JobCardItem from "../../components/ais/JobCardItem";
import JobListView from "../../components/ais/JobListView";
import PageTitle from "../../components/ais/PageTitle";
import JobShimCard from "../../components/shims/JobShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function action({ params }) {
  await Service.deleteJob(params.jobId);
  return redirect("/ais/jobs");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.jobdesignations;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, jobdesignations: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchJobs(search, page, limit);
  return { data, search, page };
}

function PgAISJobs({}: Props) {
  const [view, setView] = useState("card");
  const {
    data: { data, totalPages, totalData },
    page,
    search,
  }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canCreateJob = useHasRole("ais", ["hrm::admin"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Job Designations"
        createtext={canCreateJob ? "New" : undefined}
        createlink={canCreateJob ? "create" : undefined}
        pages={totalPages}
        setView={setView}
        view={view}
      />
      {!loading && (
        <div className="">
          {view == "card" && (
            <div className="grid md:grid-cols-3 gap-3 md:gap-6">
              {data &&
                data?.map((row: any) => (
                  <JobCardItem key={row.id} data={row} />
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

          {view == "list" && <JobListView data={data} />}
        </div>
      )}
      {loading && <JobShimCard view={view} />}
    </div>
  );
}

export default PgAISJobs;
