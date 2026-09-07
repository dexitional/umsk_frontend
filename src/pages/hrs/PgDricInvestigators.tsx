import React, { useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import InvestigatorCardItem from "../../components/hrs/InvestigatorCardItem";
import InvestigatorListView from "../../components/hrs/InvestigatorListView";
import PageTitle from "../../components/hrs/PageTitle";
import Service from "../../utils/aisService";

type Props = {};

export async function action({ params }) {
  await Service.deleteInvestigator(params.funderId);
  return redirect("/dric/investigators");
}

export async function loader() {
  const data = await Service.fetchInvestigators();
  return { data };
}

function PgDricInvestigators({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Investigators"
        createtext="New Investigator"
        createlink="create"
        setView={setView}
        view={view}
      />
      <div className="">
        {view == "card" && (
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {data &&
              data.map((row: any) => (
                <InvestigatorCardItem key={row.id} data={row} />
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

        {view == "list" && <InvestigatorListView data={data} />}
      </div>
    </div>
  );
}

export default PgDricInvestigators;
