import React, { useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import ChargeCardItem from "../../components/fms/ChargeCardItem";
import ChargeListView from "../../components/fms/ChargeListView";
import PageTitle from "../../components/fms/PageTitle";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/fmsService";
import { useHasRole } from "../../utils/roles";
type Props = {};

export async function action({ params }) {
  const data = await Service.deleteCharge(params.chargeId);
  if (data) return redirect("/fms/charges");
  return null;
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.studentcharges;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, studentcharges: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchCharges(search, page, limit);
  return { data, search, page };
}

function PgFMSCharges({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const canManageCharge = useHasRole("fms", ["charge::admin"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Student Charges"
        createtext={canManageCharge ? "Create" : undefined}
        createlink={canManageCharge ? "create" : undefined}
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      <div className="">
        {view == "card" && (
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {data?.data &&
              data?.data?.map((row: any) => (
                <ChargeCardItem key={row.id} data={row} />
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

        {view == "list" && <ChargeListView data={data} />}
      </div>
    </div>
  );
}

export default PgFMSCharges;
