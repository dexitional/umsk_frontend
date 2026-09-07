import React, { useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import PageTitle from "../../components/ams/PageTitle";
import SessionCardItem from "../../components/ams/SessionCardItem";
import Service from "../../utils/amsService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";
type Props = {};

export async function action({ params }) {
  await Service.deleteSession(params.sessionId);
  return redirect("/ams/sessions");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.admissionsessions;
  if (!pglimit)
    useUserStore.setState({ limit: { ...lm, admissionsessions: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchSessions(search, page, limit);
  return { data, search, page };
}

function PgAMSSessions({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const canCreateSession = useHasRole("ams", ["session::admin"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Admission Sessions"
        createtext={canCreateSession ? "New" : ""}
        createlink="create"
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      <div className="">
        {view == "card" && (
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {data?.data &&
              data?.data?.map((row: any) => (
                <SessionCardItem key={row.id} data={row} />
              ))}
            {!data?.data && (
              <div className="p-3 border rounded-xl">
                <h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">
                  No Records ...
                </h1>
              </div>
            )}
          </div>
        )}

        {/* { view == 'list' && (
           <SessionListView data={data} />
         )} */}
      </div>
    </div>
  );
}

export default PgAMSSessions;
