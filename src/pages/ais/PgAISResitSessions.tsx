import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import PageTitle from "../../components/ais/PageTitle";
import ResitSessionCardItem from "../../components/ais/ResitSessionCardItem";
import ResitSessionListView from "../../components/ais/ResitSessionListView";
import ResitSessionShimCard from "../../components/shims/ResitSessionShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function action({ params }) {
  await Service.deleteResitSession(params.sessionId);
  return redirect("/ais/rsessions");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.resitsessions;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, resitsessions: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchResitSessions(search, page, limit);
  return { data, search, page };
}

function PgAISResitSessions({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canCreateResitSession = useHasRole("ais", ["resit::admin"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Resit Sessions"
        createtext={canCreateResitSession ? "New" : undefined}
        createlink={canCreateResitSession ? "create" : undefined}
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      {!loading && (
        <div className="">
          {view == "card" && (
            <div className="grid md:grid-cols-3 gap-3 md:gap-6">
              {data?.data &&
                data?.data?.map((row: any) => (
                  <ResitSessionCardItem key={row.id} data={row} />
                ))}
              {!data?.data?.length && (
                <div className="p-3 border rounded-xl">
                  <h1 className="w-full text-center text-gray-400/70 text-[0.65rem] font-semibold tracking-widest uppercase">
                    No Records ...
                  </h1>
                </div>
              )}
            </div>
          )}

          {view == "list" && <ResitSessionListView data={data} />}
        </div>
      )}
      {loading && <ResitSessionShimCard view={view} />}
    </div>
  );
}

export default PgAISResitSessions;
