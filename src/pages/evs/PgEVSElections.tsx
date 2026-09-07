import React, { useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import PageTitle from "../../components/ais/PageTitle";
import ElectionCardItem from "../../components/evs/ElectionCardItem";
import ElectionListView from "../../components/evs/ElectionListView";
import Service from "../../utils/evsService";
type Props = {};

export async function action({ params }) {
  await Service.deleteElection(params.electionId);
  return redirect("/evs/admin/elections");
}

export async function loader({ request }) {
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const data = await Service.fetchElectionsAll(search, page);
  return { data, search, page };
}

function PgEVSElections({}: Props) {
  const [view, setView] = useState("card");
  const {
    data: { data, totalPages, totalData },
    page,
    search,
  }: any = useLoaderData();
  console.log(data);
  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="elections"
        createtext="New"
        createlink="create"
        pages={totalPages}
        setView={setView}
        view={view}
      />
      <div className="">
        {view == "card" && (
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {data?.map((row: any) => (
              <ElectionCardItem key={row.id} data={row} />
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

        {view == "list" && <ElectionListView data={data} />}
      </div>
    </div>
  );
}

export default PgEVSElections;
