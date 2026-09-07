import React, { useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import PageTitle from "../../components/hrs/PageTitle";
import PersonnelCardItem from "../../components/hrs/PersonnelCardItem";
import PersonnelListView from "../../components/hrs/PersonnelListView";
import Service from "../../utils/aisService";

type Props = {};

export async function action({ params }) {
  await Service.deletePersonel(params.personelId);
  return redirect("/dric/personels");
}

export async function loader() {
  const data = await Service.fetchPersonels();
  return { data };
}

function PgDricPersonnels({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Personnels"
        createtext="New Personnel"
        createlink="create"
        setView={setView}
        view={view}
      />
      <div className="">
        {view == "card" && (
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {data &&
              data.map((row: any) => (
                <PersonnelCardItem key={row.id} data={row} />
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

        {view == "list" && <PersonnelListView data={data} />}
      </div>
    </div>
  );
}

export default PgDricPersonnels;
