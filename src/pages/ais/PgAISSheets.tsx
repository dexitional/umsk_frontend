import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import PageTitle from "../../components/ais/PageTitle";
import SheetCardItem from "../../components/ais/SheetCardItem";
import SheetShimCard from "../../components/shims/SheetShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function action({ params }) {
  await Service.deleteSheet(params.sheetId);
  return redirect("/ais/sheets");
}

export async function loader({ request }) {
  // NOTE: sheets are meant to be scoped to a dean/head's own unit, but the
  // backend's role payload (authController.ts) doesn't include a unit/
  // department identifier per role, so there's nothing to scope by yet.
  // Needs a backend change (e.g. a unitId on the role object) before this
  // can filter by unit again.
  const unit = '';
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.assessmentsheet;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, assessmentsheet: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchSheets(search, page, limit,unit);
  return { data, search, page };
}

function PgAISSheets({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canCreateSheet = useHasRole("ais", ["sheet::admin"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Assessment Sheet"
        createtext={canCreateSheet ? "New" : undefined}
        createlink={canCreateSheet ? "create" : undefined}
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

          {/* { view == 'list' && (
           <SheetListView data={data} />
         )} */}
        </div>
      )}
      {loading && <SheetShimCard view={view} />}
    </div>
  );
}

export default PgAISSheets;
