import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import DefermentCardItem from "../../components/ais/DefermentCardItem";
import PageTitle from "../../components/ais/PageTitle";
import StudentListView from "../../components/ais/StudentListView";
import DefermentShimCard from "../../components/shims/DefermentShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function action({ params }) {
  await Service.deleteDeferment(params.defermentId);
  return redirect("/ais/deferments");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.deferments;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, deferments: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchDeferments(search, page, limit);
  return { data, search, page };
}

function PgAISDeferments({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canCreateDeferment = useHasRole("ais", ["deferment::admin", "deferment::clerk"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Deferments"
        createtext={canCreateDeferment ? "New" : undefined}
        createlink={canCreateDeferment ? "create" : undefined}
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      {!loading && (
        <div className="">
          {view == "card" && (
            <div className="grid md:grid-cols-3 gap-3 md:gap-6">
              {data &&
                data?.data?.map((row: any) => (
                  <DefermentCardItem key={row.id} data={row} />
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

          {view == "list" && <StudentListView data={data} />}
        </div>
      )}
      {loading && <DefermentShimCard view={view} />}
    </div>
  );
}

export default PgAISDeferments;
