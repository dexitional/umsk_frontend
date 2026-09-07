import React, { useState } from "react";
import { redirect, useLoaderData, useNavigate, useNavigation } from "react-router-dom";
import GraduateSessionCardItem from "../../components/ais/GraduateSessionCardItem";
import PageTitle from "../../components/ais/PageTitle";
import GraduateSessionShimCard from "../../components/shims/GraduateSessionShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import GraduateActions from "../../components/ais/GraduateActions";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function action({ params }) {
  await Service.deleteGraduateSession(params.sessionId);
  return redirect("/ais/rsessions");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.graduatesessions;
  if (!pglimit)
    useUserStore.setState({ limit: { ...lm, graduatesessions: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchGraduateSessions(search, page, limit);
  return { data, search, page };
}

function PgAISGraduateSessions({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canCreateGraduateSession = useHasRole("ais", ["graduation::admin"]);



  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Graduate Sessions"
        createtext={canCreateGraduateSession ? "New" : undefined}
        createlink={canCreateGraduateSession ? "create" : undefined}
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      <GraduateActions />
      {!loading && (
        <div className="">
          {view == "card" && (
            <div className="grid md:grid-cols-3 gap-3 md:gap-6">
              {data?.data &&
                data?.data?.map((row: any) => (
                  <GraduateSessionCardItem key={row.id} data={row} />
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

          {/* { view == 'list' && (
           <GraduateSessionListView data={data} />
         )} */}
        </div>
      )}
      {loading && <GraduateSessionShimCard view={view} />}
    </div>
  );
}

export default PgAISGraduateSessions;
