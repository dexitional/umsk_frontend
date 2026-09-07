import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import CircularCardItem from "../../components/ais/CircularCardItem";
import PageTitle from "../../components/ais/PageTitle";
import CircularShimCard from "../../components/shims/CircularShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function action({ request, params }) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  console.log(url);
  if (pathname.endsWith("send")) await Service.sendNotice(params.noticeId);
  else await Service.deleteNotice(params.noticeId);

  return redirect("/ais/notices");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.circulars;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, circulars: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchNotices(search, page, limit);
  return { data, search, page };
}

function PgAISCirculars({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canCreateCircular = useHasRole("ais", ["circular::admin", "circular::clerk"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Circulars"
        createtext={canCreateCircular ? "New" : undefined}
        createlink={canCreateCircular ? "create" : undefined}
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
                  <CircularCardItem key={row.id} data={row} />
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
           <ResitSessionListView data={data} />
         )} */}
        </div>
      )}
      {loading && <CircularShimCard view={view} />}
    </div>
  );
}

export default PgAISCirculars;
