import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import AccountCardItem from "../../components/fms/AccountCardItem";
import PageTitle from "../../components/fms/PageTitle";
import { useUserStore } from "../../utils/authService";
import Service from "../../utils/fmsService";
type Props = {};

export async function loader({ request }) {
  const lm = useUserStore.getState().limit;
  const pglimit = lm?.studentaccounts;
  if (!pglimit) useUserStore.setState({ limit: { ...lm, studentaccounts: 9 } });
  const search = new URL(request.url).searchParams.get("search") || "";
  const page = new URL(request.url).searchParams.get("page") || 1;
  const limit = new URL(request.url).searchParams.get("limit") || pglimit || 9;
  const data = await Service.fetchAccounts(search, page, limit);
  return { data, search, page };
}

function PgFMSAccounts({}: Props) {
  const [view, setView] = useState("card");
  const { data }: any = useLoaderData();

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Student Accounts"
        createtext=""
        createlink=""
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      <div className="">
        {view == "card" && (
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {data?.data &&
              data?.data?.map((row: any) => (
                <AccountCardItem key={row.id} data={row} />
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

        {/* { view == 'list' && (<AccountListView data={data} />)} */}
      </div>
    </div>
  );
}

export default PgFMSAccounts;
