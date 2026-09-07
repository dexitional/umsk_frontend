import React, { useState } from "react";
import { redirect, useLoaderData, useNavigation } from "react-router-dom";
import PageTitle from "../../components/ais/PageTitle";
import StaffCardItem from "../../components/ais/StaffCardItem";
import StaffListView from "../../components/ais/StaffListView";
import StaffShimCard from "../../components/shims/StaffShimCard";
import Service from "../../utils/aisService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";

type Props = {};

export async function action({ params }) {
  console.log("Delete Staff: ", params.staffId)
  await Service.deleteStaff(params.staffId);
  return redirect("/ais/staff");
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.staff;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, staff: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchStaffs(search, page, limit);
  return { data, search, page };
}

function PgAISStaffs({}: Props) {
  const [view, setView] = useState("card");
  const {
    data: { data, totalPages, totalData },
    page,
    search,
  }: any = useLoaderData();
  const navigation = useNavigation();
  const loading = navigation.state === "loading";
  const canCreateStaff = useHasRole("ais", ["hrm::admin"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Staff"
        createtext={canCreateStaff ? "New" : undefined}
        createlink={canCreateStaff ? "create" : undefined}
        pages={totalPages}
        setView={setView}
        view={view}
      />
      {!loading && (
        <div className="">
          {view == "card" && (
            <div className="grid md:grid-cols-3 gap-3 md:gap-6">
              {data &&
                data?.map((row: any,i: number) => (
                  <StaffCardItem key={i} data={row} />
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

          {view == "list" && <StaffListView data={data} />}
        </div>
      )}
      {loading && <StaffShimCard view={view} />}
    </div>
  );
}

export default PgAISStaffs;
