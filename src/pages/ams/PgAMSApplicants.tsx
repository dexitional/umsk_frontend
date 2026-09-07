import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ApplicantCardItem from "../../components/ams/ApplicantCardItem";
import PageTitle from "../../components/ams/PageTitle";
import Service from "../../utils/amsService";
import { useUserStore } from "../../utils/authService";
import { useHasRole } from "../../utils/roles";
type Props = {};

function PgAMSApplicants({}: Props) {
  const [view, setView] = useState("card");
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = searchParams.get("page") || 1;
  const limit =
    searchParams.get("limit") || useUserStore.getState().limit?.applicants || 9;
  const canCreateApplicant = useHasRole("ams", ["applicant::admin-ug", "applicant::admin-pg"]);

  // Server derives undergrad/postgrad scope from the caller's role
  // (applicant::admin-ug/pg, applicant::clerk-ug/pg), so no group param
  // is sent from here — see amsScope.ts on the backend.
  const { data, isLoading }: any = useQuery({
    queryKey: ["ams-applicants", search, page, limit],
    queryFn: () => Service.fetchApplicants(search, page, limit),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <div className="p-10 text-center font-bold">Loading Applicants...</div>;

  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title="Applicants"
        createtext={canCreateApplicant ? "New" : undefined}
        createlink={canCreateApplicant ? "create" : undefined}
        pages={data?.totalPages}
        setView={setView}
        view={view}
      />
      <div className="">
        {view == "card" && (
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {data?.data &&
              data?.data?.map((row: any) => (
                <ApplicantCardItem key={row.id} data={row} />
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

        {/* {view == "list" && <ApplicantListView data={data} />} */}
      </div>
    </div>
  );
}

export default PgAMSApplicants;
