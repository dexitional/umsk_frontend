import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { redirect, useSearchParams } from "react-router-dom";
import PageTitle from "../../components/ams/PageTitle";
import ShortlistCardItem from "../../components/ams/ShortlistCardItem";
import Service from "../../utils/amsService";
import { useUserStore } from "../../utils/authService";
type Props = {};

// Still wired directly (not via lazy() on this route) from the sibling
// "shortlists/:shortlistId/destroy" route in AMSRoute.tsx.
export async function action({ params }) {
  await Service.deleteShortlist(params.shortlistId);
  return redirect("/ams/shortlists");
}

function PgAMSShortlists({}: Props) {
  const [view, setView] = useState("card");
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = searchParams.get("page") || 1;
  const limit =
    searchParams.get("limit") ||
    useUserStore.getState().limit?.shortlistedapplicants ||
    9;

  // Server derives undergrad/postgrad scope from the caller's role
  // (shortlist::admin-ug/pg, shortlist::clerk-ug/pg), so no group param
  // is sent from here — see amsScope.ts on the backend.
  const { data, isLoading }: any = useQuery({
    queryKey: ["ams-shortlists", search, page, limit],
    queryFn: () => Service.fetchShortlists(search, page, limit),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <div className="p-10 text-center font-bold">Loading Shortlisted Applicants...</div>;

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Shortlisted Applicants"
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
                <ShortlistCardItem key={row.id} data={row} />
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
           <ShortlistListView data={data} />
         )} */}
      </div>
    </div>
  );
}

export default PgAMSShortlists;
