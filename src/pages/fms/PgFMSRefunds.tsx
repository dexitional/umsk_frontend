import React, { useState } from "react";
import { redirect, useLoaderData } from "react-router-dom";
import RefundCardItem from "../../components/fms/RefundCardItem";
import RefundListView from "../../components/fms/RefundListView";
import PageTitle from "../../components/fms/PageTitle";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/fmsService";
import { useHasRole } from "../../utils/roles";
type Props = {};

// Refund Module: clone of the Charges module, but the opposite effect --
// a charge debits a student's account, a refund credits it (see
// fmsController.ts's postRefund/updateRefund for the sign flip).
export async function action({ params }) {
  const data = await Service.deleteRefund(params.refundId);
  if (data) return redirect("/fms/refunds");
  return null;
}

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.studentrefunds;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, studentrefunds: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchRefunds(search, page, limit);
  return { data, search, page };
}

function PgFMSRefunds({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();
  const canManageRefund = useHasRole("fms", ["refund::admin"]);

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Student Refunds"
        createtext={canManageRefund ? "Create" : undefined}
        createlink={canManageRefund ? "create" : undefined}
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      <div className="">
        {view == "card" && (
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {data?.data &&
              data?.data?.map((row: any) => (
                <RefundCardItem key={row.id} data={row} />
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

        {view == "list" && <RefundListView data={data} />}
      </div>
    </div>
  );
}

export default PgFMSRefunds;
