import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import PageTitle from "../../components/ais/PageTitle";
import SheetCardItem from "../../components/ais/SheetCardItem";
import SheetListView from "../../components/ais/SheetListView";
import MySheetShimCard from "../../components/shims/MySheetShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
type Props = {};

export async function action({ params }) {
  await Service.deleteSheet(params.sheetId);
  return redirect("/ais/mysheets");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.assessorsheet;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, assessorsheet: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchMySheets(search, page, limit);
  return { data, search, page };
}

function PgAISMySheets({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Assessor Sheet"
        createtext=""
        createlink=""
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      {!loading && (
        <div className="">
          {view == "card" && (
            <div
              className={`grid ${
                data?.data?.length ? "md:grid-cols-3" : "md:grid-cols-2 justify"
              } gap-3 md:gap-6`}
            >
              {data?.data?.map((row: any) => (
                <SheetCardItem key={row.id} data={row} />
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

          {view == "list" && <SheetListView data={data} />}
        </div>
      )}
      {loading && <MySheetShimCard view={view} />}
    </div>
  );
}

export default PgAISMySheets;
