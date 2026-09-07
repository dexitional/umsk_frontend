import React, { useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import NSSCardItem from "../../components/hrs/NSSCardItem";
import NSSListView from "../../components/hrs/NSSListView";
import PageTitle from "../../components/hrs/PageTitle";
import Service from "../../utils/hrsService";

type Props = {};

export async function action({ params }) {
  await Service.deleteNSS(params.nssId);
  return redirect("/hrs/nss");
}

export async function loader({ request }) {
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const data = await Service.fetchNSSAll(search, page);
  return { data, search, page };
}

function PgHRSNSSPeople({}: Props) {
  const [view, setView] = useState("card");
  const {
    data: { data, totalPages, totalData },
    page,
    search,
  }: any = useLoaderData();

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="NSS Module"
        createtext="New"
        createlink="create"
        pages={totalPages}
        setView={setView}
        view={view}
      />
      <div className="">
        {view == "card" && (
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {/* { data && data.filter(r => (r.nss_no.toLowerCase().includes(search?.toLowerCase())) || (r.fname.toLowerCase().includes(search?.toLowerCase())) || (r.lname.toLowerCase().includes(search?.toLowerCase()))  || (r.mname.toLowerCase().includes(search?.toLowerCase()))).map((row:any) => (<NSSCardItem key={row.id} data={row} /> ))} */}
            {data &&
              data.map((row: any) => <NSSCardItem key={row.id} data={row} />)}
            {!data && (
              <div className="p-3 border rounded-xl">
                <h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">
                  No Records ...
                </h1>
              </div>
            )}
          </div>
        )}

        {view == "list" && <NSSListView data={data} />}
      </div>
    </div>
  );
}

export default PgHRSNSSPeople;
